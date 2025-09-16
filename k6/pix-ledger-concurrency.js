import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000, // Número de usuários virtuais simultâneos executando o teste
  duration: '220s', // Duração total do teste de carga
  thresholds: {
    http_req_failed: ['rate<0.10'], // Taxa de falha das requisições HTTP deve ser menor que 10% (relaxado para alta carga)
    http_req_duration: ['p(95)<5000'], // 95% das requisições devem ter duração menor que 5s (relaxado para alta carga)
    checks: ['rate>0.80'], // 80% dos checks devem passar
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
    throw new Error('Contas seed não encontradas. Rode: pnpm -w --filter @challanger-bank/server seeds:accounts');
  }

  console.log(`💰 Saldo inicial:
    Conta débito (${debitPixKey}): R$ ${(debitAccount.balance / 100).toFixed(2)}
    Conta crédito (${creditPixKey}): R$ ${(creditAccount.balance / 100).toFixed(2)}`);

  const debitParty = {
    account: debitAccount.id,
    pixKey: debitPixKey,
    type: 'PHYSICAL',
    psp: 'Bank Challanger LTDA',
  };

  const creditParty = {
    account: creditAccount.id,
    pixKey: creditPixKey,
    type: 'COMPANY', // Corrigido: partyEnum.LEGAL = 'COMPANY'
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

  // Verificar se temos uma resposta válida antes de tentar fazer parse JSON
  let responseBody = null;
  let hasValidResponse = false;
  
  try {
    if (res.body && res.body.length > 0) {
      responseBody = res.json();
      hasValidResponse = true;
    }
  } catch (e) {
    console.log(`❌ Erro ao fazer parse JSON da resposta: ${e.message}`);
  }
  
  // Log detalhado para debug
  if (!hasValidResponse || res.status !== 200 || (responseBody && responseBody.errors)) {
    console.log(`❌ Falha na requisição:
    Status: ${res.status}
    Body length: ${res.body ? res.body.length : 'null'}
    Errors: ${responseBody?.errors ? JSON.stringify(responseBody.errors, null, 2) : 'N/A'}
    Response: ${responseBody ? JSON.stringify(responseBody, null, 2) : 'Body is null/empty'}`);
  }

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


