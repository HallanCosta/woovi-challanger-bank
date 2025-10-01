# Backend - Woovi Challenger Bank

API GraphQL moderna construída com Koa.js, MongoDB e Redis, oferecendo funcionalidades completas de sistema bancário com suporte a PIX, contas e transações.

## 🏗️ Arquitetura

### Stack Tecnológica
- **Framework**: Koa.js com TypeScript
- **API**: GraphQL com Relay
- **Banco de Dados**: MongoDB com Mongoose
- **Jobs**: Redis
- **Testes**: Jest com MongoDB Memory Server
- **Build**: tsc para desenvolvimento

## ✅ Módulos Implementados

### 1. 👤 User (Usuário)
**Funcionalidades:**
- Modelo de dados com email e senha
- Type GraphQL com Relay
- Autenticação básica

### 2. 💳 Account (Conta)
**Funcionalidades:**
- Gestão de contas bancárias
- Suporte a contas físicas e empresariais
- Sistema de chaves PIX
- Controle de saldo

### 3. 📊 LedgerEntry (Lançamento Contábil)
**Funcionalidades:**
- Sistema de lançamentos contábeis
- Suporte a débito e crédito
- Rastreamento de transações

**Features:**
- Jobs de processamento em background

### 4. 💸 PixTransaction (Transação PIX)
**Funcionalidades:**
- Sistema de transações PIX
- Criação automática de lançamentos contábeis
- Controle de status e validações

**Mutations:**
- `CreatePixTransaction`: Criar nova transação PIX

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