import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 500 },
    { duration: '2m', target: 1000 },
    { duration: '3m', target: 1000 },
    { duration: '1m', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000', 'p(99)<5000', 'max<10000'],
    checks: ['rate>0.90'],
    vus: ['value>=200'],
    iterations: ['count>5000'],
  },
};

const url = 'http://localhost:4000/graphql';

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

  return {
    debitParty: {
      account: debitAccount.id,
      pixKey: debitPixKey,
      type: 'PHYSICAL',
      psp: 'Bank Challanger LTDA',
    },
    creditParty: {
      account: creditAccount.id,
      pixKey: creditPixKey,
      type: 'COMPANY',
      psp: 'Bank Challanger LTDA',
    },
  };
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
        success
        error
      }
    }
  `;

  const variables = {
    input: {
      value: 100, // 100 = R$ 1,00
      status: "CREATED", // 🔹 obrigatório segundo o schema
      debitParty: data.debitParty,
      creditParty: data.creditParty,
      description: `k6 concurrent tx ${Date.now()}`,
      idempotencyKey: `k6-${__VU}-${__ITER}-${Date.now()}${Math.random().toString(36).substring(2, 15)}`,
    },
  };

  const res = http.post(
    url,
    JSON.stringify({ query: mutation, variables }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const ok = check(res, {
    'status é 200': (r) => r.status === 200,
    'sem erros GraphQL': (r) => !r.json().errors,
    'transação criada com sucesso': (r) => r.json().data?.CreatePixTransaction?.pixTransaction?.id,
  });

  if (ok) {
    console.log('✅ Transação bem-sucedida');
    sleep(0.1);
  } else {
    console.error('❌ Erro na transação:', res.body);
    sleep(0.5);
  }
}

export function teardown() {
  console.log('🏁 Teste K6 finalizado');
}
