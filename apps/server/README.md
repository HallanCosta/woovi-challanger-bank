# Backend - Woovi Challenger Bank

API GraphQL moderna construída com Koa.js, MongoDB e Redis, oferecendo funcionalidades completas de sistema bancário com suporte a PIX, contas e transações em tempo real.

## 🏗️ Arquitetura

### Stack Tecnológica
- **Framework**: Koa.js com TypeScript
- **API**: GraphQL com Relay
- **Banco de Dados**: MongoDB com Mongoose
- **Jobs**: Redis
- **Testes**: Jest com MongoDB Memory Server
- **Build**: TSX para desenvolvimento

### Estrutura do Projeto
```
src/
├── modules/              # Módulos de negócio
│   ├── account/         # Gestão de contas
│   ├── user/            # Usuários
│   ├── ledgerEntry/     # Lançamentos contábeis
│   ├── pix/             # Transações PIX
│   ├── pubSub/          # Sistema de eventos
│   ├── queue/           # Filas de processamento
│   └── worker/          # Workers de background
├── schema/              # Schema GraphQL
├── server/              # Configuração do servidor
└── __tests__/           # Testes automatizados
```

## ✅ Módulos Implementados

### 1. 👤 User (Usuário)
**Funcionalidades:**
- Modelo de dados com email e senha
- Type GraphQL com Relay
- Autenticação básica

**Campos:**
- `id`: Identificador único
- `name`: Nome do usuário
- `email`: Email do usuário
- `password`: Senha (hash)
- `createdAt`: Data de criação

### 2. 💳 Account (Conta)
**Funcionalidades:**
- Gestão de contas bancárias
- Suporte a contas físicas e empresariais
- Sistema de chaves PIX
- Controle de saldo

**Campos:**
- `pixKey`: Chave PIX da conta
- `user`: ID do usuário proprietário
- `balance`: Saldo atual
- `type`: Tipo da conta (PHYSICAL/COMPANY)
- `psp`: Provedor de serviços de pagamento
- `createdAt/updatedAt`: Timestamps

**Mutations:**
- `createAccount`: Criar nova conta

### 3. 📊 LedgerEntry (Lançamento Contábil)
**Funcionalidades:**
- Sistema de lançamentos contábeis
- Suporte a débito e crédito
- Rastreamento de transações PIX
- Status de processamento

**Campos:**
- `value`: Valor da transação
- `type`: Tipo (CREDIT/DEBIT)
- `status`: Status (PENDING/COMPLETED/FAILED)
- `ledgerAccount`: Conta contábil
- `description`: Descrição da transação
- `pixTransaction`: Referência à transação PIX
- `createdAt`: Data de criação

**Features:**
- Loader para otimização de queries
- Jobs de processamento em background

### 4. 💸 PixTransaction (Transação PIX)
**Funcionalidades:**
- Sistema completo de transações PIX
- Criação automática de lançamentos contábeis
- Controle de status e validações
- Suporte a diferentes tipos de chave PIX

**Campos:**
- `value`: Valor da transferência
- `status`: Status da transação
- `partyDebit`: Parte que envia (débito)
- `partyCredit`: Parte que recebe (crédito)
- `description`: Descrição da transação
- `createdAt/updatedAt`: Timestamps

**Mutations:**
- `CreatePixTransaction`: Criar nova transação PIX


## 🔌 API GraphQL

### Queries Disponíveis
```graphql
query {
  accounts(filters: { pixKey: "95b7f30c-2fad-43cd-85d1-f5615cf28a39" }) {
    edges {
      node {
        id
        balance
        pixKey
        user {
          name
          email
        }
        type
      }
    }
  }
  users {
    edges {
      node {
        id
        name
        email
        password
      }
    }
  }
  pixTransactions(
    first: 2
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        value
        idempotencyKey
      }
    }
  }
  ledgerEntries(
    first: 2
    filters: { account: "QWNjb3VudDo2OGJlMTliMmEyNzhlN2IyY2Y2N2RhZDU=" }
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        value
        ledgerAccount {
          psp
          account
          type
          pixKey
        }
        type
        description
        pixTransaction
        idempotencyKey
      }
    }
  }
}
```

### Mutations Disponíveis
```graphql
# Criar conta
mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    account {
      id
      pixKey
      balance
    }
  }
}

# Criar transação PIX
mutation CreatePixTransaction($input: CreatePixTransactionInput!) {
  createPixTransaction(input: $input) {
    pixTransaction {
      id
      value
      status
    }
  }
}
```

## 🧪 Testes

### Configuração
- **Framework**: Jest com Babel para TypeScript
- **Banco**: MongoDB Memory Server
- **Mocks**: Redis mock para testes isolados

### Cobertura de Testes
- ✅ Operações de débito e crédito em contas
- ✅ Validação de saldo suficiente
- ✅ Consistência de dados em transações PIX
- ✅ Tratamento de erros e rollback
- ✅ Sistema de lançamentos contábeis

### Executar Testes
```bash
# Todos os testes
pnpm test

# Testes com watch mode
pnpm test --watch

# Testes com cobertura
pnpm test --coverage
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                    # Inicia servidor com hot reload

# Configuração
pnpm config:local          # Copia .env.example para .env

# Schema
pnpm schema                # Atualiza schema GraphQL

# Seeds
pnpm seeds:accounts        # Popula banco com contas de teste

# Reset
pnpm reset                 # Limpa banco e recria seeds
pnpm reset:ledger          # Limpa apenas lançamentos ledger
pnpm reset:pix             # Limpa apenas transações PIX

# Testes
pnpm test                  # Executa testes
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/woovi-playground

# Redis
REDIS_URL=redis://localhost:6379

# Servidor
PORT=4000
NODE_ENV=development

# GraphQL
GRAPHQL_ENDPOINT=/graphql
```

## 📊 Monitoramento

### Logs
- Logs estruturados com Koa Logger
- Rastreamento de requests GraphQL

### Métricas
- Contadores de transações processadas
- Tempo de resposta das queries
- Status de conexões Redis/MongoDB

### Desenlvolvidos
- [x] Users
- [x] Accounts
- [x] LedgerEntry (Jobs)
- [x] PixTransaction
- [x] Tests

### Próximos Passos
- [ ] Sistema de auditoria
- [ ] Métricas avançadas
- [ ] Testes de integração E2E
- [ ] CI/CD pipeline