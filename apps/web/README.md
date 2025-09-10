## Frontend — Novidades e Como Usar

Este documento descreve as funcionalidades novas adicionadas recentemente ao frontend do Challanger Bank, com foco na experiência do Dashboard (Transações e Saldo).

### O que mudou

- **Botão de Atualizar Extrato (Transações)**
  - Agora a lista de transações possui um botão de atualização no cabeçalho.
  - O extrato é atualizado em background, mantendo os itens atuais visíveis enquanto os novos chegam (sem “piscar” a tela).
  - Um ícone de loading gira durante a atualização para indicar progresso.

- **Saldo atualizado automaticamente após transferência**
  - Ao confirmar uma transferência PIX, o saldo exibido no cartão de saldo é refetchado imediatamente.
  - O saldo é atualizado sem interromper a UI e sem “piscar”.

### Como usar

- **Atualizar extrato**: vá até a seção "Transações" no Dashboard e clique no ícone de atualizar (seta circular) no canto direito do título.
- **Fazer transferência**: use a ação de transferência rápida, preencha os dados e confirme. Após a confirmação, o saldo do cartão será atualizado automaticamente.

### Detalhes técnicos (para desenvolvedores)

- **Query de lançamentos (`useLedgerEntryQuery`)**
  - Passou a retornar `{ data, refresh, isRefreshing }`.
  - Implementado `fetchKey` e `fetchPolicy: 'store-and-network'` para manter dados do cache visíveis enquanto busca atualizações no servidor.
  - Arquivo: `apps/web/src/components/queries/useLedgerEntryQuery.ts`.

- **Hook de transações (`useTransactions`)**
  - Agora expõe `refreshTransactions` e `isRefreshingTransactions` vindos da query.
  - As transações locais continuam sendo mescladas às transações reais do servidor.
  - Arquivo: `apps/web/src/hooks/useTransactions.ts`.

- **Lista de transações (`TransactionList`)**
  - Adicionadas props `onRefresh` e `isRefreshing`.
  - Renderiza botão de atualizar com spinner no cabeçalho, sem bloquear a lista.
  - Arquivo: `apps/web/src/components/Auth/TransactionList.tsx`.

- **Dashboard (`pages/dashboard.tsx`)**
  - Passa `onRefresh` e `isRefreshing` para `TransactionList`.
  - Após confirmar uma transferência, chama `refreshBalance()` para refetchar o saldo.
  - Arquivo: `apps/web/src/pages/dashboard.tsx`.

- **Saldo (`BalanceCard`)**
  - Já exibia um botão de atualizar; a lógica de refetch do saldo usa `store-and-network` e mantém a UI estável.
  - Arquivo: `apps/web/src/components/Auth/BalanceCard.tsx`.

### UX e acessibilidade

- **Sem flickering**: as atualizações usam cache visível e busca em background.
- **Feedback claro**: spinner no botão de atualizar, estados desabilitados durante operação.

### Observações

- A chegada de novos itens depende da latência da rede/servidor. Durante o refresh, o conteúdo atual permanece visível.
- Caso uma transferência falhe, nenhum refetch de saldo é disparado.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn/foundations/about-nextjs) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_source=github.com&utm_medium=referral&utm_campaign=turborepo-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
