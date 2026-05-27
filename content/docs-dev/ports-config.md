# 🔧 Guia de Configuração de Portas: Projetos Tauri + Vite

Ao rodar o ambiente de desenvolvimento de aplicações baseadas na stack **Tauri + Vite**, é comum nos depararmos com conflitos de porta, especialmente se outro serviço já estiver em execução na máquina e ocupando a porta padrão desse ecossistema (`1420`).

Este documento detalha o passo a passo genérico para alterar as portas de desenvolvimento do *frontend* de forma estruturada em qualquer projeto que utilize essa arquitetura.

---

## 1. Configurando o arquivo `.env`

Para não engessarmos o código-fonte toda vez que for necessário trocar de porta, a melhor prática é externalizar essa configuração.

O arquivo `.env` **deve ser colocado na raiz da sua pasta de frontend (ex: dentro de `/ui`)**. Nele, você define a nova porta de roteamento do Vite e do HMR (*Hot Module Replacement*).

Exemplo utilizando portas livres alternativas:

```env
VITE_PORT=
VITE_HMR_PORT=

```

*(Você também pode utilizar outras portas livres comuns no desenvolvimento, como `3000`, `5173`, `8080` ou `1421`).*

---

## 2. Ajustando o `vite.config.ts`

O Vite precisa ser instruído a ler essas variáveis e aplicá-las na inicialização do servidor. Substitua o conteúdo do seu `vite.config.ts` pelo código abaixo.

Note que ele possui um *fallback* de segurança: caso o arquivo `.env` não esteja configurado, ele tenta subir na porta `1420` e falha imediatamente (`strictPort: true`) se ela já estiver em uso.

```typescript
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // @ts-expect-error process is a nodejs global
  const env = loadEnv("development", process.cwd(), "");
  const host = env.TAURI_DEV_HOST;

  return {
    plugins: [react()],

    // Opções do Vite desenhadas para o desenvolvimento com Tauri
    //
    // 1. Impede que o Vite oculte erros do Rust
    clearScreen: false,
    // 2. O Tauri espera uma porta fixa; o processo falha se a porta não estiver disponível
    server: {
      port: Number(env.VITE_PORT) || 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: "ws",
            host,
            port: Number(env.VITE_HMR_PORT) || 1421,
          }
        : undefined,
      watch: {
        // 3. Diz ao Vite para ignorar a pasta `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
  };
});

```

---

## 3. Sincronizando o `tauri.conf.json`

O *backend* nativo (Tauri) atua como a janela do sistema e precisa saber exatamente para qual porta local ele deve apontar a renderização da interface.

Abra o arquivo de configuração do Tauri (`tauri.conf.json` ou `tauri.conf.json5`) e localize o bloco `"build"`. Você precisará alterar a URL em `"devUrl"` para combinar com a porta que foi definida no seu `.env`.

Abaixo está uma estrutura genérica. Certifique-se de alterar apenas o `"devUrl"`, mantendo as especificidades do seu projeto (`productName`, `identifier`, etc.):

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "NOME_DO_SEU_PROJETO",
  "version": "0.1.0",
  "identifier": "com.suaempresa.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1422", 
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "NOME_DO_SEU_PROJETO",
        "width": 800,
        "height": 600
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}

```

> **Atenção:** Se a porta especificada no `"devUrl"` do Tauri for diferente da porta que o Vite subiu, a janela do seu aplicativo abrirá completamente em branco. Garanta que ambas apontem para a mesma numeração definida no seu arquivo `.env`.
