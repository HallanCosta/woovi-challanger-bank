<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/entria/woovi-playground">
    <img src="https://user-images.githubusercontent.com/70105678/236887308-8ad0ccb7-2fc6-4269-8725-da71c547f54a.png" alt="Logo">
  </a>

  <h3 align="center">Woovi Playground</h3>

  <p align="center">
    <a href="https://github.com/entria/woovi-playground/issues">Report Bug</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

### Built With

[![Next][next.js]][next-url]
[![React][react.js]][react-url]
[![Node][node.js]][node-url]
[![GraphQL][graphql]][graphql-url]
[![MongoDB][mongodb]][mongodb-url]
[![Koa][koa]][koa-url]

<p align="right">(<a href="#top">back to top</a>)</p>

## Backend Implementation Status

### ✅ Implementado

#### **Arquitetura e Infraestrutura**
- **Framework**: Koa.js com TypeScript
- **Banco de Dados**: MongoDB com Mongoose
- **GraphQL**: Schema completo com Relay
- **WebSocket**: Suporte a subscriptions em tempo real
- **Pub/Sub**: Redis para eventos em tempo real
- **CORS**: Configurado para desenvolvimento

#### **Módulos Implementados**

##### **1. User (Usuário)**
- Modelo de dados com email e senha
- Type GraphQL com Relay
- Campos: id, email, password, createdAt

##### **2. Account (Conta)**
- Modelo de dados para contas bancárias
- Campos: pixKey, user, balance, createdAt, updatedAt
- Mutation para criar contas
- Eventos Pub/Sub para notificações

##### **3. LedgerEntry (Lançamento Contábil)**
- Sistema de lançamentos contábeis
- Suporte a débito e crédito
- Campos: value, type, status, ledgerAccount, description, pixTransaction, createdAt
- Loader para otimização de queries

##### **4. PixTransaction (Transação PIX)**
- Sistema de transações PIX
- Criação de transações com lançamentos contábeis
- Campos: value, status, partyDebit, partyCredit, description, createdAt, updatedAt
- Mutation para criar transações PIX

##### **5. Message (Mensagem)**
- Sistema de mensagens com WebSocket
- Campos: content, createdAt
- Mutation para adicionar mensagens
- Subscription em tempo real para novas mensagens
- Loader para otimização

#### **Funcionalidades GraphQL**
- **Queries**: Listagem de todos os tipos (users, accounts, ledgerEntries, pixTransactions, messages)
- **Mutations**: Criação de contas, transações PIX e mensagens
- **Subscriptions**: Notificações em tempo real para mensagens
- **Relay**: Suporte completo ao padrão Relay

#### **Sistema de Eventos**
- Redis Pub/Sub para comunicação entre serviços
- Eventos para: conta criada, transação PIX criada, mensagem adicionada
- WebSocket para subscriptions GraphQL

#### **Scripts e Utilitários**
- Seed de contas para desenvolvimento
- Atualização automática de schema GraphQL
- Configuração de ambiente local
- **Testes automatizados** com Jest e TypeScript

### 🧪 **Testes**
- **Configuração**: Jest com Babel para TypeScript
- **Cobertura**: Testes unitários para serviços de conta
- **Funcionalidades testadas**:
  - Operações de débito e crédito em contas
  - Validação de saldo suficiente
  - Consistência de dados em transações PIX
  - Tratamento de erros e rollback
- **Executar testes**: `npm test` (no diretório do servidor)

### 🚧 Em Desenvolvimento
- Validações de entrada
- Autenticação e autorização
- Testes automatizados
- Documentação da API

### 📋 Próximos Passos
- Implementar autenticação JWT
- Adicionar validações de negócio
- Implementar testes unitários e de integração
- Adicionar logging estruturado
- Implementar rate limiting
- Adicionar monitoramento e métricas

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- Node.js

  ```sh
  https://nodejs.org/en/download/
  ```

- PNPM

  ```sh
  npm install pnpm -g
  ```

- Docker

  ```sh
  https://www.docker.com/get-started/
  ```

## Installation

Clone the repo

```sh
git clone https://github.com/entria/woovi-playground.git
```

1. Install packages

   ```sh
   pnpm install
   ```

2. Run the container(or stop it, if necessary):
  
   ```sh
   pnpm compose:up
   ```

3. Setup Configuration

   ```sh
   pnpm config:local
   ```

4. Run the relay

    ```sh
    pnpm relay
    ```

5. Run the Project

   ```sh
   pnpm dev
   ```

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'feat(amazing-feature): my feature is awesome'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Project Link: [https://github.com/entria/woovi-playground](https://github.com/entria/woovi-playground)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[node.js]: https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
[graphql]: https://img.shields.io/badge/Graphql-E10098?style=for-the-badge&logo=graphql&logoColor=white
[graphql-url]: https://graphql.org/
[mongodb]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://mongodb.com
[koa]: https://img.shields.io/badge/Koa-F9F9F9?style=for-the-badge&logo=koa&logoColor=33333D
[koa-url]: https://koajs.com
