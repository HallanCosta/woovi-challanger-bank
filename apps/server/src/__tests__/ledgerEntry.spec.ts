import mongoose from 'mongoose';
import { graphql } from 'graphql';

import { schema } from '../schema/schema';
import { getContext } from '../server/getContext';

import { Account } from '../modules/account/AccountModel';
import { LedgerEntry } from '../modules/ledgerEntry/LedgerEntryModel';
import type { ILedgerEntry } from '../modules/ledgerEntry/LedgerEntryModel';
import { ledgerEntryEnum } from '../modules/ledgerEntry/ledgerEntryEnum';
import { partyEnum } from '../modules/graphql/partyEnum';
import { pixTransactionEnum } from '../modules/pix/pixTransactionEnum';
import { toGlobalId } from 'graphql-relay';
import { setupDatabase } from './setup';
import { createAccount } from './setup/fixtures/createAccount';

setupDatabase();

const countLedgerEntryOperation = 1;

async function createLedgerEntries({ account1, account2, countLedgerEntryOperation }) {
  const entries: Partial<ILedgerEntry>[] = [];

  for (let i = 0; i < countLedgerEntryOperation; i++) {
    const pixTransactionId = new mongoose.Types.ObjectId().toString();

    entries.push({
      value: 100,
      type: ledgerEntryEnum.CREDIT,
      status: pixTransactionEnum.CREATED,
      ledgerAccount: {
        psp: account1.psp,
        account: account1._id.toString(),
        type: account1.type,
        pixKey: account1.pixKey,
      },
      description: `Description pix transaction #${i+1}`,
      pixTransaction: pixTransactionId,
    });
    
    entries.push({
      value: 100,
      type: ledgerEntryEnum.DEBIT,
      status: pixTransactionEnum.CREATED,
      ledgerAccount: {
        psp: account2.psp,
        account: account2._id.toString(),
        type: account2.type,
        pixKey: account2.pixKey,
      },
      description: `Description pix transaction #${i+1}`,
      pixTransaction: pixTransactionId,
    });
  }
  
  const ledgerEntries = await LedgerEntry.insertMany(entries);

  return ledgerEntries;
}

it('should be able to create 2 ledger entry operations', async () => {
  const account1 = await createAccount({});
  const account2 = await createAccount({});

  const ledgerEntries = await createLedgerEntries({ account1, account2, countLedgerEntryOperation });
  expect(ledgerEntries.length).toBe(countLedgerEntryOperation * 2);
});

it('should list ledger entries filtered by account', async () => {
  const account1 = await createAccount({});
  const account2 = await createAccount({});

  await createLedgerEntries({ account1, account2, countLedgerEntryOperation });

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
  expect(edges.length).toBe(countLedgerEntryOperation);
});



