# 🚀 Guia de Inicialização do Sistema: Tauri + Spring Boot

Este documento detalha o processo de criação e inicialização de um aplicativo desktop moderno, utilizando uma arquitetura híbrida e modular (_Monorepo_). O sistema combina a robustez do **Spring Boot (Java)** no _backend_ com a performance e agilidade do **Tauri + React + TypeScript** no _frontend_.

---

## 🏗️ 1. Arquitetura e Estrutura de Diretórios

Para garantir a organização e escalabilidade do projeto, adotamos uma estrutura de _monorepo_. Todos os serviços residem dentro da mesma pasta raiz do projeto:

```text
meu-projeto/
├── backend/                # Motor de processamento (Spring Boot)
├── frontend/               # Interface Gráfica (Tauri + React)
└── README.md

```

---

## 🛠️ 2. Pré-requisitos do Sistema

Antes de iniciar a criação dos módulos, garanta que as seguintes ferramentas estejam instaladas no seu ambiente de desenvolvimento:

1. **Java Development Kit (JDK):** Versão 17 ou superior (para o Spring Boot).
2. **Node.js & npm:** Versão LTS (para o ecossistema React/Vite).
3. **Rust & Cargo:** Obrigatório para o Tauri compilar a janela nativa do sistema operacional. Pode ser instalado via terminal:

```bash
# Instalação do Rust (Linux/macOS/WSL)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

```

_(No Windows, utilize o instalador oficial `rustup-init.exe` disponível em rustup.rs, juntamente com o C++ Build Tools)._

---

## ⚙️ 3. Inicializando o Backend (Spring Boot)

O módulo de _backend_ pode ser rapidamente gerado utilizando o [Spring Initializr](https://start.spring.io/).

Gere o projeto com as dependências necessárias (ex: Spring Web, Spring Data JPA, etc.), faça o download e extraia o conteúdo para uma pasta chamada `backend` na raiz do seu projeto.

Foram utilizados nesse projeto as seguintes dependências:

- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Flyway Migration
- Validation
- Lombok

---

## 🖥️ 4. Inicializando o Frontend (Tauri + React)

A interface gráfica será construída com tecnologias web, mas empacotada como um executável nativo ultraleve via Tauri.

Abra o terminal na raiz do seu projeto (`meu-projeto/`) e execute o comando de criação do Tauri:

```bash
npm create tauri-app@latest

```

Durante a execução, o assistente fará algumas perguntas para configurar o _boilerplate_. Siga este padrão para manter a arquitetura alinhada:

- **Project name:** `frontend` _(Isso criará a pasta ao lado do seu backend)_
- **Identifier:** `com.suaempresa.app` _(Substitua pelo domínio reverso do seu projeto)_
- **Choose which language to use for your frontend:** `TypeScript / JavaScript`
- **Choose your package manager:** `npm` _(Ou pnpm/yarn, conforme sua preferência)_
- **Choose your UI template:** `React`
- **Choose your UI flavor:** `TypeScript`

---

## 🚀 5. O Primeiro Teste (Hello World)

Com o esqueleto do projeto criado, o próximo passo é instalar as dependências do React e pedir para o Tauri realizar a primeira compilação.

> **Nota:** O primeiro _build_ do Rust costuma demorar um pouco pois ele baixa e compila os binários nativos do sistema. As compilações subsequentes serão quase instantâneas.

Navegue até a pasta do frontend e inicie o ambiente de desenvolvimento:

```bash
cd frontend
npm install
npm run tauri dev

```

Se o processo ocorrer com sucesso, uma janela nativa do seu sistema operacional se abrirá exibindo o _template_ inicial do React rodando dentro do Tauri.

---

## 💡 Dica de Fluxo de Trabalho (Workflow)

Para otimizar o desenvolvimento nesta arquitetura _Client-Server_ local, recomenda-se organizar sua IDE (como o VS Code) aproveitando o espaço da tela:

1. **Split Lateral:** Deixe as classes Java do Spring Boot de um lado e os componentes TSX do React do outro.
2. **Terminal Integrado Dividido:** Mantenha um terminal rodando o servidor do Spring Boot (`./mvnw spring-boot:run`) e outro rodando a interface gráfica (`npm run tauri dev`) na parte inferior da tela.

Desta forma, você tem controle total sobre ambas as extremidades do ecossistema de forma simultânea.
