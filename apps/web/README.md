# Frontend - Woovi Challenger Bank

Interface moderna e responsiva construída com React.js, TypeScript e Shadcn, oferecendo uma experiência bancária completa com PIX, gestão de contas e transações.

## 🏗️ Arquitetura

### Stack Tecnológica
- **Framework**: React.js com TypeScript
- **Styling**: Tailwind CSS + Shadcn
- **API Client**: Relay GraphQL
- **Testing**: Jest + React Testing Library

## 🚀 Funcionalidades

### 🔐 Autenticação
- **Login**: Formulário com validação
- **Gerenciamento de Sessão**: localStorage com verificação automática

### 💳 Dashboard Bancário
- **Cartão de Saldo**: Visualização do saldo com toggle de visibilidade
- **Extrato**: Lista de transações com atualização
- **Transferências PIX**: Modal para envio de PIX
- **Favoritos**: Lista de contatos para transferências rápidas
- **Ações Rápidas**: Botões de acesso direto às funcionalidades

## 🧪 Testes

### Configuração
- **Framework**: Jest + React Testing Library
- **Coverage**: Cobertura completa de componentes
- **Mocks**: Mocks para hooks e APIs

### Componentes Testados
- ✅ `Login` - Autenticação e validação
- ✅ `TransactionList` - Lista de transações
- ✅ `TransferModal` - Modal de transferência

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                 # Inicia servidor de desenvolvimento
pnpm build              # Build de produção
pnpm start              # Inicia servidor de produção

# Relay
pnpm relay              # Compila queries GraphQL

# Testes
pnpm test               # Executa testes
pnpm test:watch         # Testes em modo watch
pnpm test:coverage      # Testes com cobertura

# Linting
pnpm lint               # Verifica código com ESLint
```