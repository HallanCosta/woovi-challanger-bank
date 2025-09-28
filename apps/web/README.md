# Frontend - Woovi Challenger Bank

Interface moderna e responsiva construída com React.js, TypeScript e Shadcn, oferecendo uma experiência bancária completa com PIX, gestão de contas e transações em tempo real.

## 🏗️ Arquitetura

### Stack Tecnológica
- **Framework**: React.js com TypeScript
- **Styling**: Tailwind CSS + Shadcn
- **API Client**: Relay GraphQL
- **Testing**: Jest + React Testing Library

### Estrutura do Projeto
```
src/
├── components/           # Componentes React
│   ├── Auth/            # Componentes autenticados
│   ├── Dashboard/       # Componentes do dashboard
│   ├── ui/              # Componentes base
│   ├── queries/         # Queries GraphQL
│   └── mutations/       # Mutations GraphQL
├── hooks/               # Custom hooks
├── pages/               # Páginas Next.js
├── relay/               # Configuração Relay
├── styles/              # Estilos globais
└── theme/               # Sistema de temas
```

## 🚀 Funcionalidades

### 🔐 Autenticação
- **Login Seguro**: Formulário com validação
- **Gerenciamento de Sessão**: localStorage com verificação automática
- **Redirecionamento**: Fluxo automático baseado no estado de auth
- **Proteção de Rotas**: Middleware de autenticação

### 💳 Dashboard Bancário
- **Cartão de Saldo**: Visualização do saldo com toggle de visibilidade
- **Extrato em Tempo Real**: Lista de transações com atualização automática
- **Transferências PIX**: Modal para envio de PIX
- **Favoritos**: Lista de contatos para transferências rápidas
- **Ações Rápidas**: Botões de acesso direto às funcionalidades

### 💸 Sistema PIX
- **Transferência**: Modal intuitivo para envio de PIX
- **Validação**: Validação em tempo real de chaves PIX
- **Histórico**: Lista completa de transações PIX
- **Status**: Indicadores visuais de status das transações
- **Feedback**: Confirmações e notificações de sucesso/erro

### 📊 Gestão de Transações
- **Extrato Detalhado**: Histórico completo com filtros
- **Atualização Manual**: Botão de refresh do extrato
- **Categorização**: Diferentes tipos de transação (crédito/débito)
- **Timestamps**: Datas e horários das transações

## 🎣 Custom Hooks

### `useAuth`
- Gerenciamento de autenticação
- Estado do usuário e conta
- Funções de login/logout
- Refresh de dados

### `useTransactions`
- Estado das transações
- Adição de transações locais
- Refresh do extrato
- Merge com dados do servidor

### `useDashboardState`
- Estado do dashboard
- Toggles de visibilidade
- Modal states
- Preenchimento de dados

### `useFavorites`
- Lista de favoritos
- Adição/remoção de favoritos
- Persistência local

### `useToast`
- Sistema de notificações
- Toast de sucesso/erro
- Auto-dismiss

## 🎨 Sistema de Design

### Tema
- **Cores**: Paleta consistente com modo escuro/claro
- **Tipografia**: Hierarquia clara de textos
- **Espaçamento**: Sistema de grid responsivo
- **Componentes**: Biblioteca reutilizável

## 🧪 Testes

### Configuração
- **Framework**: Jest + React Testing Library
- **Environment**: jsdom para testes de componentes
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

### Funcionaldiades
- [x] Login / Logout
- [x] Transferir PIX
- [x] Favoritar chave PIX
- [x] Histórico de transferências
- [x] Atualizar saldo da conta
