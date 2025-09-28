import mongoose from 'mongoose';
import { graphql } from 'graphql';
import { uuidv4 } from 'mongodb-memory-server-core/lib/util/utils';

import { schema } from '../schema/schema';
import { getContext } from '../server/getContext';

import { LedgerEntry } from '../modules/ledgerEntry/LedgerEntryModel';
import type { ILedgerEntry } from '../modules/ledgerEntry/LedgerEntryModel';
import { ledgerEntryEnum } from '../modules/ledgerEntry/ledgerEntryEnum';
import { pixTransactionEnum } from '../modules/pix/pixTransactionEnum';
import { setupDatabase } from './setup';
import { createAccount } from './setup/fixtures/createAccount';
import { PixTransactionStatus } from '../modules/pix/mutations/pixTransactionStatusEnum';
import { createPixTransaction } from './setup/fixtures/createPixTransaction';
import { createLedgerEntriesJob } from '../modules/ledgerEntry/jobs/createLedgerEntriesJob';
import { updateAccountBalances, hasSufficientBalance } from '../modules/account/accountService';
import { BULLMQ_JOBS } from '../modules/queue';

jest.mock('../modules/account/accountService');
const mockUpdateAccountBalances = updateAccountBalances as jest.MockedFunction<typeof updateAccountBalances>;
const mockHasSufficientBalance = hasSufficientBalance as jest.MockedFunction<typeof hasSufficientBalance>;

setupDatabase();

it('should list ledger entries filtered by account', async () => {
  mockUpdateAccountBalances.mockResolvedValue({
    modifiedCount: 2
  });
  mockHasSufficientBalance.mockResolvedValue(true);

  const account1 = await createAccount({});
  const account2 = await createAccount({});
  const value = 200;
  const idempotencyKey = uuidv4();

  const pixTransactionResult = await createPixTransaction({ 
    account1, 
    account2, 
    value, 
    idempotencyKey 
  });

  expect(pixTransactionResult.error).toBeNull();
  const pixTransactionId = pixTransactionResult.pixTransaction!._id.toString();

  const job = {
    id: 'job-filter-test',
    name: BULLMQ_JOBS.LEDGER_ENTRIES_CREATE,
    data: { pixTransactionId },
  };

  await createLedgerEntriesJob(job as any);

  const query = `
    query LedgerEntries($filters: LedgerEntryFilters) {
      ledgerEntries(filters: $filters) {
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
            createdAt
          }
        }
      }
    }
  `;

  const result = await graphql({
    schema,
    source: query,
    contextValue: getContext(),
    variableValues: {
      filters: { account: account1._id.toString() },
    },
  });

  expect(result.errors).toBeUndefined();
  const edges = (result as any).data?.ledgerEntries?.edges ?? [];
  expect(edges.length).toBe(1);
});

it('should validate transaction with insufficient balance', async () => {
  // Para este teste, vamos permitir que hasSufficientBalance funcione normalmente
  mockHasSufficientBalance.mockRestore();
  
  const account1 = await createAccount({});
  const account2 = await createAccount({});

  const idempotencyKey = uuidv4();

  const pixTransaction = await createPixTransaction({ account1, account2, idempotencyKey, value: 10000 });

  expect(pixTransaction.error).toBe(PixTransactionStatus.INSUFFICIENT_BALANCE);
  
  // Restaurar o mock para os próximos testes
  mockHasSufficientBalance.mockResolvedValue(true);
});

it('should process a ledger job and create ledger entries', async () => {
  mockUpdateAccountBalances.mockResolvedValue({
    modifiedCount: 2
  });
  mockHasSufficientBalance.mockResolvedValue(true);

  const account1 = await createAccount({ });
  const account2 = await createAccount({ });
  const value = 200;
  const idempotencyKey = uuidv4();

  const pixTransactionResult = await createPixTransaction({ 
    account1, 
    account2, 
    value, 
    idempotencyKey 
  });

  expect(pixTransactionResult.error).toBeNull();
  expect(pixTransactionResult.success).toBe(PixTransactionStatus.SUCCESS);
  expect(pixTransactionResult.pixTransaction).toBeDefined();

  const pixTransactionId = pixTransactionResult.pixTransaction!._id.toString();

  const job = {
    id: 'job-123',
    name: BULLMQ_JOBS.LEDGER_ENTRIES_CREATE,
    data: { pixTransactionId },
  };

  const result = await createLedgerEntriesJob(job as any);

  expect(result?.error).toBeUndefined();

  const ledgerEntries = await LedgerEntry.find({ pixTransaction: pixTransactionId });
  
  expect(ledgerEntries).toHaveLength(2);
  
  const types = ledgerEntries.map(entry => entry.type);
  expect(types).toEqual(expect.arrayContaining([ledgerEntryEnum.DEBIT, ledgerEntryEnum.CREDIT]));
  
  ledgerEntries.forEach(entry => {
    expect(entry.value).toBe(value);
    expect(entry.pixTransaction).toBe(pixTransactionId);
    expect(entry.idempotencyKey).toBe(idempotencyKey);
    expect(entry.status).toBe(pixTransactionEnum.CREATED);
  });

  expect(mockUpdateAccountBalances).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({
        value: value,
        operation: ledgerEntryEnum.DEBIT
      }),
      expect.objectContaining({
        value: value,
        operation: ledgerEntryEnum.CREDIT
      })
    ])
  );
});

it('should not create duplicate ledger entries for the same transaction', async () => {
  mockUpdateAccountBalances.mockResolvedValue({
    modifiedCount: 2
  });
  mockHasSufficientBalance.mockResolvedValue(true);

  const account1 = await createAccount({ });
  const account2 = await createAccount({ });
  const value = 200;
  const idempotencyKey = uuidv4();

  const pixTransactionResult = await createPixTransaction({ 
    account1, 
    account2, 
    value, 
    idempotencyKey 
  });

  expect(pixTransactionResult.error).toBeNull();
  expect(pixTransactionResult.pixTransaction).toBeDefined();
  const pixTransactionId = pixTransactionResult.pixTransaction!._id.toString();

  const job = {
    id: 'job-123',
    name: BULLMQ_JOBS.LEDGER_ENTRIES_CREATE,
    data: { pixTransactionId },
  };

  await createLedgerEntriesJob(job as any);

  const result = await createLedgerEntriesJob(job as any);

  expect(result?.error).toBe(PixTransactionStatus.ALREADY_PROCESSED);

  const ledgerEntries = await LedgerEntry.find({ pixTransaction: pixTransactionId });
  expect(ledgerEntries).toHaveLength(2);
});

it('should return error when PIX transaction is not found', async () => {
  const fakePixTransactionId = new mongoose.Types.ObjectId().toString();

  const job = {
    id: 'job-456',
    name: BULLMQ_JOBS.LEDGER_ENTRIES_CREATE,
    data: { pixTransactionId: fakePixTransactionId },
  };

  const result = await createLedgerEntriesJob(job as any);

  expect(result?.error).toBe(PixTransactionStatus.NOT_FOUND);

  const ledgerEntries = await LedgerEntry.find({ pixTransaction: fakePixTransactionId });
  expect(ledgerEntries).toHaveLength(0);
});


