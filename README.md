# Woovi Challenger Bank

<div id="top"></div>

Uma aplicação bancária moderna construída com tecnologias de ponta, oferecendo funcionalidades completas de PIX, gestão de contas e transações em tempo real.

### Built With

[![Next][next.js]][next-url]
[![React][react.js]][react-url]
[![Node][node.js]][node-url]
[![GraphQL][graphql]][graphql-url]
[![MongoDB][mongodb]][mongodb-url]
[![Koa][koa]][koa-url]
[![Redis][redis]][redis-url]
[![TypeScript][typescript]][typescript-url]

## 🏗️ Arquitetura

O projeto é um monorepo estruturado com:

- **Frontend**: Next.js com React, TypeScript e Tailwind CSS
- **Backend**: Koa.js com GraphQL, MongoDB e Redis
- **Comunicação**: GraphQL com Relay para otimização de queries
- **Tempo Real**: Redis Pub/Sub para eventos
- **Testes**: Jest com cobertura completa
- **Infraestrutura**: Docker Compose para desenvolvimento

## 🚀 Funcionalidades

### 💳 Sistema Bancário
- **Contas**: Criação e gestão de contas físicas e empresariais
- **PIX**: Transferências instantâneas com chaves PIX
- **Extrato**: Histórico completo de transações com atualização em tempo real
- **Saldo**: Visualização e atualização automática do saldo
- **Favoritos**: Lista de contatos para transferências rápidas

### 🔐 Autenticação
- Login seguro com email e senha
- Gerenciamento de sessão com localStorage
- Redirecionamento automático baseado no estado de autenticação

### 📱 Interface Moderna
- Dashboard responsivo e intuitivo
- Componentes reutilizáveis com design system
- Tema escuro/claro
- Notificações toast para feedback do usuário
- Loading states e animações suaves

### ⚡ Performance
- Cache inteligente com Relay
- Atualizações em background sem interrupção da UI
- Otimização de queries GraphQL
- Lazy loading de componentes

## 📁 Estrutura do Projeto

```
woovi-challanger-bank/
├── apps/
│   ├── server/          # Backend GraphQL
│   └── web/             # Frontend Next.js
├── packages/
│   ├── ui/              # Componentes compartilhados
│   ├── types/           # Tipos TypeScript
│   └── eslint-config/   # Configuração ESLint
├── k6/                  # Scripts de teste de carga
└── scripts/             # Scripts de setup
```

## Documentação por App

### Frontend (Next.js)
- **Local**: `apps/web/`
- **README**: [`apps/web/README.md`](apps/web/README.md)
- **Descrição**: Interface moderna com dashboard, autenticação, transferências PIX, extrato em tempo real e gestão de favoritos.

### Backend (Koa, GraphQL, MongoDB)
- **Local**: `apps/server/`
- **README**: [`apps/server/README.md`](apps/server/README.md)
- **Descrição**: API GraphQL completa com módulos de usuário, conta, transações PIX, lançamentos contábeis e sistema de mensagens em tempo real.

<p align="right">(<a href="#top">back to top</a>)</p>

## 🛠️ Getting Started

Para executar o projeto localmente, siga estes passos:

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
  ```sh
  https://nodejs.org/en/download/
  ```

- **PNPM** (gerenciador de pacotes)
  ```sh
  npm install pnpm -g
  ```

- **Docker** (para MongoDB e Redis)
  ```sh
  https://www.docker.com/get-started/
  ```

### Instalação

1. **Clone o repositório**
   ```sh
   git clone https://github.com/hallancosta/woovi-challanger-bank.git
   cd woovi-challanger-bank
   ```

2. **Instale as dependências**
   ```sh
   pnpm install
   ```

3. **Inicie os serviços (MongoDB e Redis)**
   ```sh
   pnpm compose:up
   ```

4. **Configure as variáveis de ambiente**
   ```sh
   pnpm config:local
   ```

5. **Execute o Relay Compiler**
   ```sh
   pnpm relay
   ```

6. **Inicie o projeto**
   ```sh
   pnpm dev
   ```

### URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000/graphql
- **GraphiQL**: http://localhost:4000/graphql (interface de testes)

## 🧪 Testes

### Executar Testes
```sh
# Todos os testes
pnpm test

# Testes com cobertura
pnpm --filter @challanger-bank/web test:coverage

# Testes do servidor
pnpm --filter @challanger-bank/server test
```

### Teste de Carga (K6)
```sh
pnpm k6:pix
```

## 📊 Scripts Disponíveis

- `pnpm dev` - Inicia o ambiente de desenvolvimento
- `pnpm build` - Build de produção
- `pnpm test` - Executa todos os testes
- `pnpm lint` - Verifica código com ESLint
- `pnpm format` - Formata código com Prettier
- `pnpm compose:up` - Inicia containers Docker
- `pnpm compose:down` - Para containers Docker
- `pnpm relay` - Compila queries GraphQL
- `pnpm schema` - Atualiza schema GraphQL

## 🔧 Tecnologias Utilizadas

### Frontend
- **Next.js** - Framework React com SSR/SSG
- **React** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Relay** - Cliente GraphQL otimizado
- **Material-UI** - Componentes de interface
- **React Hook Form** - Gerenciamento de formulários

### Backend
- **Koa.js** - Framework web Node.js
- **GraphQL** - API query language
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Redis** - Cache e Pub/Sub
- **WebSocket** - Comunicação em tempo real
- **BullMQ** - Sistema de filas

### DevOps & Tools
- **Docker** - Containerização
- **Jest** - Framework de testes
- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Formatador de código
- **Turbo** - Build system para monorepos
- **K6** - Testes de carga

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Hallan Costa** - [@hallancosta](https://github.com/hallancosta)

---

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Badges -->
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
[redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white
[redis-url]: https://redis.io
[typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org