# 🚀 SRM (Solid Rocket Motor Simulator)

O **SRM** é o aplicativo desktop oficial de simulação de propulsão sólida da Tau Rocket Team. Desenvolvido para substituir planilhas legadas de cálculo de balística interna (como o QuarkIII), o sistema oferece rastreabilidade, alta performance de cálculo e uma interface gráfica moderna para o dimensionamento de motores a propelente sólido.

## 🏗️ Arquitetura

O sistema utiliza uma arquitetura local desacoplada (Client-Server):

- **Motor de Cálculo (Backend):** Java 21 + Spring Boot 3
- **Banco de Dados:** PostgreSQL 16 (via Docker)
- **Interface Desktop (Frontend):** Tauri + React + TypeScript

---

## 🛠️ Pré-requisitos

Para rodar o ambiente de desenvolvimento na sua máquina Windows, você precisará das seguintes ferramentas instaladas:

1. [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/) (com integração WSL 2 ativada)
2. [JDK 21](https://adoptium.net/pt-BR/) (Java Development Kit)
3. [Node.js](https://nodejs.org/) (Versão LTS)
4. [Rust & Cargo](https://rustup.rs/) (Para compilação nativa do Tauri)
5. C++ Build Tools (via Visual Studio Installer)

---

## 🔥 Como rodar o projeto localmente (Sequência de Ignição)

Como o sistema é modular, você precisará rodar os três serviços em paralelo. A recomendação é abrir **3 terminais integrados** no VS Code.

### Passo 1: Subir o Banco de Dados

O banco de dados deve ser o primeiro a ser iniciado. No terminal, na **raiz do projeto**, rode:

```bash
docker-compose up -d

```

_O banco rodará em background na porta `5433`._

### Passo 2: Iniciar o Motor de Cálculo (Backend Java)

Abra um novo terminal, navegue até a pasta do backend e inicie o Spring Boot:

```bash
cd engine
.\mvnw spring-boot:run

```

_O servidor Java ficará ativo na porta `8080`. Aguarde a mensagem de inicialização bem-sucedida._

### Passo 3: Abrir a Interface Desktop (Frontend Tauri)

Abra o terceiro terminal, navegue até a pasta da interface e lance o aplicativo:

```bash
cd ui
npm run tauri dev

```

_O Tauri compilará o aplicativo e abrirá a janela nativa do SRM no seu sistema._

---

## 🛑 Como parar a execução

- **Frontend e Backend:** Pressione `Ctrl + C` nos respectivos terminais.
- **Banco de Dados:** Para desligar o container do PostgreSQL, rode na raiz do projeto:

```bash
docker-compose down

```

---

## 📂 Estrutura de Pastas

- `/engine`: Código-fonte do motor de simulação (Spring Boot).
- `/ui`: Código-fonte da interface do usuário (React/Tauri).
- `docker-compose.yml`: Orquestração do banco de dados local.
- `README.md`: Documentação do projeto.
