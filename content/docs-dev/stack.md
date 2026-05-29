# Documentação de Stack Tecnológica: SRM (Solid Rocket Motor)

**Autor:** Fernando Dorneles da Silva
**Projeto:** `srm` | **Versão:** 1.0.0
**Data:** 11 de Maio de 2026

---

> **Resumo**
> Este documento descreve a infraestrutura de software e a pilha de tecnologias (stack) utilizada no projeto `srm`. A stack foi selecionada visando alta performance de cálculo matemático, execução nativa em ambientes offline (testes de campo e bancada) e uma interface de usuário responsiva e moderna. O projeto utiliza uma arquitetura local desacoplada (Client-Server), unindo a robustez do Java 21 no backend com a agilidade do Tauri e React no frontend, utilizando PostgreSQL para persistência de dados.

---

## Arquitetura do Sistema

A arquitetura do sistema segue um modelo de separação de responsabilidades, onde a interface gráfica (UI) e o motor de cálculo termo-balístico (Engine) operam de forma independente, comunicando-se via rede local. Abaixo, apresenta-se a representação do fluxo de dados e interdependência das tecnologias principais:

- **Tauri / React (Frontend UI)** ↔ (HTTP REST / JSON) ↔ **Spring Boot (Motor Java)**
- **Spring Boot (Motor Java)** ↔ (JPA / JDBC) ↔ **PostgreSQL (Database)**

Para manter o projeto rastreável e unificado, adotou-se a estrutura de _Monorepo_, dividida logicamente da seguinte forma:

```bash
srm/
    |-- engine/               # Backend (Spring Boot 3.x + Java 21)
    |-- ui/                   # Frontend (Tauri 2.x + React + Vite + TS)
    |-- docker-compose.yml    # Orquestracao do Banco de Dados
    `-- README.md             # Descricoes iniciais e documentacao

```

- **Frontend (UI):** Renderizado via WebView2 no Windows, empacotado como um executável leve e seguro através do framework Tauri.
- **Backend (Engine):** Instância embutida do Spring Boot que processas as simulações e cálculos de balística interna e fluxo bifásico, expondo endpoints REST.
- **Database:** Persistência relacional isolada através de conteinerização Docker.

---

## Stack Tecnológica Detalhada

As principais tecnologias escolhidas para a espinha dorsal do simulador, focadas em estabilidade e padronização corporativa:

| Tecnologia             | Função no Projeto                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Java 21 (LTS)**      | Linguagem base do motor de simulação, aproveitando Virtual Threads e alta performance de CPU.                  |
| **Spring Boot 3.x**    | Framework do backend para injeção de dependências, mapeamento objeto-relacional (JPA) e criação da API REST.   |
| **Tauri 2.x**          | Empacotador desktop escrito em Rust, garantindo um consumo de memória drasticamente menor que o Electron.      |
| **React + TypeScript** | Construção da interface gráfica, oferecendo tipagem estática rigorosa e componentização escalável.             |
| **PostgreSQL 16**      | Banco de dados relacional (via Docker Alpine) para armazenar propriedades de propelentes e geometrias de grão. |
| **Docker**             | Orquestração de infraestrutura local (_containers_) para padronização do ambiente de desenvolvimento.          |
| **Flyway**             | Controle de versão automatizado do esquema do banco de dados (Migrations).                                     |

---

## Ambiente de Desenvolvimento e Testes

O projeto preza pela qualidade de código e manutenibilidade a longo prazo, estabelecendo os seguintes padrões para o ecossistema local:

- **Linguagens Base:** Java e TypeScript, garantindo segurança de tipos em ambas as extremidades do sistema.
- **Validação de Contratos:** Uso do Spring Boot Validation (`@NotNull`, `@Min`) para garantir a integridade de dados termodinâmicos críticos antes da persistência.
- **Testes Unitários:** JUnit 5 e Mockito no backend para validação rigorosa dos algoritmos de simulação balística e iterações de passo de tempo (time-stepping).
- **Hot Reload:** Servidor Vite integrado ao Tauri para atualizações instantâneas de interface durante o desenvolvimento.

---

## Motor de Processamento (Backend Java)

O núcleo analítico do simulador reside na pasta `/engine`. Construído via _Spring Initializr_, este módulo centraliza os cálculos de balística interna, dinâmica de queima e geometria do grão do motor a propelente sólido.

A _stack_ do Spring foi configurada com:

- **Spring Web:** Exposição dos _endpoints_ consumidos pela interface React.
- **Spring Data JPA & PostgreSQL Driver:** Mapeamento objeto-relacional (ORM) para salvar o histórico de simulações e propriedades dos propelentes de forma estruturada.
- **Flyway Migration:** Versionamento automático e seguro das tabelas do banco de dados (ex: esquemas dinâmicos de motores e propriedades termodinâmicas).
- **Validation & Lombok:** Garantia de contratos rigorosos (prevenindo que parâmetros físicos nulos ou incorretos quebrem o processamento matemático) e redução drástica de código _boilerplate_.

---

## Estrutura de Arquivos e Módulos

A organização da raiz do repositório reflete a arquitetura modular, isolando os domínios:

- **`/engine`:** Contém toda a aplicação Java/Spring Boot. É responsável pelo modelo de domínio (Propelente, Grão, Tubeira) e pela camada de serviços de simulação.
- **`/ui`:** Contém a aplicação React e as configurações do Tauri (em Rust). Responsável pelo consumo da API e renderização de gráficos de pressão/tempo e empuxo.
- **`docker-compose.yml`:** Arquivo de orquestração na raiz do projeto.

---

## Infraestrutura e Conteinerização

Para garantir que todos os desenvolvedores tenham o exato mesmo ecossistema sem poluir suas máquinas físicas:

- **Banco de Dados (Docker):** Para garantir que o banco de dados não gere resíduos no sistema operacional dos desenvolvedores e possua portabilidade absoluta, o PostgreSQL 16 é levantado via `docker-compose.yml` na raiz do projeto. As credenciais e portas de acesso (5432) são padronizadas e o mapeamento de volumes (diretório `/var/lib/postgresql/data`) assegura a persistência integral do histórico de uso do sistema entre reinicializações do _container_.
- **Independência de SO:** Embora o alvo final de compilação do Tauri seja um executável Windows (focado nas máquinas de campo e laboratório), o backend e o banco de dados rodam em ambientes agnósticos, permitindo desenvolvimento híbrido (WSL/Windows).

---

## Interface Gráfica e Operação _Offline_ (Tauri Sidecar)

Localizado na pasta `/ui`, o _frontend_ gerado via Vite substitui abordagens tradicionais e pesadas (como o Electron) pelo **Tauri 2.x**. A interface conta com React e TypeScript para renderizar, com fluidez, gráficos dinâmicos de pressão/tempo, curvas de empuxo e a evolução geométrica do grão de propelente.

### Integração "Sidecar"

O principal desafio de uma arquitetura Client-Server em contexto de desenvolvimento aeroespacial é a frequente ausência de infraestrutura de rede em locais de testes estáticos (bancadas de queima em áreas remotas). Para solucionar isso, o sistema implementa a funcionalidade de **Tauri Sidecar**.

Para a versão final (_Release_), o artefato compilado do Spring Boot (`.jar`) é embutido diretamente dentro do executável nativo gerado pelo Tauri (`.exe`).

Ao iniciar a aplicação no Windows de campo, o processo em Rust nativo do Tauri automaticamente "acorda" a API em Java em _background_ (no modo _localhost_), estabelecendo comunicação REST instantaneamente. O operador usufrui da experiência de um único aplicativo _desktop_ coeso, sem a necessidade de instanciar servidores web ou configurar bancos de dados manualmente sob pressão.

---

## Análise Técnica da Stack

A substituição de planilhas complexas (`.xlsm`) por um sistema robusto exige precisão. A escolha do Spring Boot com PostgreSQL fornece a confiabilidade transacional necessária para armazenar coeficientes empíricos e dimensões de motores. A adoção do Tauri em vez do JavaFX ou Electron demonstra um foco em tecnologias contemporâneas e de alta eficiência, entregando um executável nativo que se comunica perfeitamente com o servidor de cálculo embutido, eliminando dependências de internet em testes estáticos operacionais.
