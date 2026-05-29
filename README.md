<div align="center">
  <img src="https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop" alt="SRM Cover" width="100%" style="border-radius: 8px; margin-bottom: 20px;" />

# 🚀 SRM (Solid Rocket Motor Simulator)

**O aplicativo desktop definitivo para simulação de balística interna de motores a propelente sólido.**

<a href="#"><img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=for-the-badge" alt="Status"></a>
<a href="#"><img src="https://img.shields.io/badge/Versão-0.1.9--dev-blue?style=for-the-badge" alt="Version"></a>

  <br>

  <img src="https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=tauri&logoColor=white" alt="Tauri" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  
</div>

---

O **SRM** é o aplicativo desktop oficial de simulação de propulsão sólida. Desenvolvido para substituir planilhas legadas de cálculo de balística interna, o sistema oferece rastreabilidade, alta performance de cálculo e uma interface gráfica moderna para o dimensionamento de motores a propelente sólido.

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
