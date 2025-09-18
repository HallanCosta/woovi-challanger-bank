import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // sobe até 100 VUs
    { duration: '30s', target: 300 },   // sobe até 300
    { duration: '1m', target: 500 },    // atinge 500
    { duration: '2m', target: 500 },    // mantém 500 estáveis
    { duration: '30s', target: 0 },     // desce para 0
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],                // <1% de falha
    http_req_duration: [
      'p(95)<1000',   // 95% das requisições abaixo de 1s
      'p(99)<2000',   // 99% abaixo de 2s
      'max<5000',     // nunca passar de 5s
    ],
    checks: ['rate>0.98'],                         // pelo menos 98% dos checks ok
    vus: ['value>=500'],                           // garantir pico planejado
    iterations: ['count>10000'],                   // garantir carga mínima
  },
};

const url = 'http://localhost:4000/graphql';

// PixKeys definidas em apps/server/scripts/accountsSeed.ts
const debitPixKey = '95b7f30c-2fad-43cd-85d1-f5615cf28a39';
const creditPixKey = '08771dd3-32c0-4fe7-8725-6175ab14c7ee';

export function setup() {
  const query = `
    query Accounts($pixKey: String) {
      accounts(filters: { pixKey: $pixKey }) {
        edges { node { id pixKey balance } }
      }
    }
  `;

  const headers = { 'Content-Type': 'application/json' };

  const debitRes = http.post(url, JSON.stringify({ query, variables: { pixKey: debitPixKey } }), { headers });
  const creditRes = http.post(url, JSON.stringify({ query, variables: { pixKey: creditPixKey } }), { headers });

  const debitAccount = debitRes.json().data?.accounts?.edges?.[0]?.node;
  const creditAccount = creditRes.json().data?.accounts?.edges?.[0]?.node;

  if (!debitAccount?.id || !creditAccount?.id) {
    throw new Error('Contas seed não encontradas. Rode: pnpm seeds:accounts');
  }

  console.log(`
    💰 Saldo inicial:
    Conta débito (${debitPixKey}): R$ ${(debitAccount.balance / 100).toFixed(2)}
    Conta crédito (${creditPixKey}): R$ ${(creditAccount.balance / 100).toFixed(2)}`
  );

  const debitParty = {
    account: debitAccount.id,
    pixKey: debitPixKey,
    type: 'PHYSICAL',
    psp: 'Bank Challanger LTDA',
  };

  const creditParty = {
    account: creditAccount.id,
    pixKey: creditPixKey,
    type: 'COMPANY',
    psp: 'Bank Challanger LTDA',
  };

  return { debitParty, creditParty };
}

export default function (data) {
  const mutation = `
    mutation CreatePixTransaction($input: CreatePixTransactionInput!) {
      CreatePixTransaction(input: $input) {
        pixTransaction {
          id
          value
          status
          debitParty { account pixKey }
          creditParty { account pixKey }
        }
      }
    }
  `;

  const variables = {
    input: {
      value: 100, // 100 centavos = R$ 1,00 (valor menor para evitar esgotar saldo)
      status: 'CREATED',
      debitParty: data.debitParty,
      creditParty: data.creditParty,
      description: 'k6 concurrent tx',
    },
  };

  const res = http.post(
    url,
    JSON.stringify({ query: mutation, variables }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'status é 200': (r) => r.status === 200,
    'resposta não está vazia': (r) => r.body && r.body.length > 0,
    'sem erros GraphQL': (r) => {
      try {
        if (!r.body || r.body.length === 0) return false;
        const json = r.json();
        return !json.errors;
      } catch (e) {
        return false;
      }
    },
    'transação criada com sucesso': (r) => {
      try {
        if (!r.body || r.body.length === 0) return false;
        const json = r.json();
        return json.data?.CreatePixTransaction?.pixTransaction?.id;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
}


