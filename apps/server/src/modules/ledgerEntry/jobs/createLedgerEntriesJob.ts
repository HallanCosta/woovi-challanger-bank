import { Job } from "bullmq";
import { fromGlobalId } from 'graphql-relay';
import { LedgerEntry, ILedgerEntry } from "../LedgerEntryModel";
import { PixTransaction } from "../../pix/PixTransactionModel";
import { ledgerEntryEnum } from "../ledgerEntryEnum";
import { pixTransactionEnum } from "../../pix/pixTransactionEnum";
import { UpdateAccountBalanceProps } from "../../account/accountService";
import { updateAccountBalances } from "../../account/accountService";
import { PixTransactionStatus } from "../../pix/mutations/pixTransactionStatusEnum";

export const createLedgerEntriesJob = async (job: Job) => {
  const { pixTransactionId } = job.data;
    
    // console.log(`🔄 Processando job ledger: ${job.id} - PIX: ${pixTransactionId}`);

    // 1. Verificar se já existem entradas para esta idempotencyKey
    const existingEntries = await LedgerEntry.find({
      pixTransaction: pixTransactionId
    });

    if (existingEntries.length > 0) {
      console.log(`⚠️  Entradas do ledger já existem para PIX: ${pixTransactionId}`);
      return {
        error: PixTransactionStatus.ALREADY_PROCESSED,
      }; // Job já foi processado
    }

    const pixTransaction = await PixTransaction.findOne({
      _id: pixTransactionId
    });

    if (!pixTransaction) {
      console.log(`❌ PIX transaction not found: ${pixTransactionId}`);
      return {
        error: PixTransactionStatus.NOT_FOUND,
      };
    }

    // 2. Criar as duas entradas contábeis (DEBIT e CREDIT)
    const ledgerEntries: Partial<ILedgerEntry>[] = [
      {
        value: pixTransaction.value,
        type: ledgerEntryEnum.DEBIT,
        status: pixTransactionEnum.CREATED,
        ledgerAccount: {
          account: pixTransaction.debitParty.account,
          psp: pixTransaction.debitParty.psp,
          type: pixTransaction.debitParty.type,
          pixKey: pixTransaction.debitParty.pixKey,
          name: pixTransaction.creditParty.name
        },
        description: pixTransaction.description,
        pixTransaction: pixTransactionId,
        idempotencyKey: pixTransaction.idempotencyKey,
      },
      {
        value: pixTransaction.value,
        type: ledgerEntryEnum.CREDIT,
        status: pixTransactionEnum.CREATED,
        ledgerAccount: {
          account: pixTransaction.creditParty.account,
          psp: pixTransaction.creditParty.psp, 
          type: pixTransaction.creditParty.type,
          pixKey: pixTransaction.creditParty.pixKey,
          name: pixTransaction.debitParty.name
        },
        description: pixTransaction.description,
        pixTransaction: pixTransactionId,
        idempotencyKey: pixTransaction.idempotencyKey,
      }
    ];

    const createdEntries = await LedgerEntry.insertMany(ledgerEntries);
    console.log(`✅ Criadas ${createdEntries.length} entradas no ledger`);

    // 3. Atualizar saldos das contas usando sua função updateAccountBalances
    const debitAccountId = fromGlobalId(pixTransaction.debitParty.account).id;
    const creditAccountId = fromGlobalId(pixTransaction.creditParty.account).id;
    
    const balanceUpdates: UpdateAccountBalanceProps[] = [
      {
        accountId: debitAccountId,
        value: pixTransaction.value,
        operation: ledgerEntryEnum.DEBIT
      },
      {
        accountId: creditAccountId,
        value: pixTransaction.value,
        operation: ledgerEntryEnum.CREDIT
      }
    ];

    const bulkResult = await updateAccountBalances(balanceUpdates);
    console.log(`✅ Saldos atualizados - Modificados: ${bulkResult.modifiedCount}`);

    if (bulkResult.modifiedCount !== 2) {
      return {
        error: 'Falha ao atualizar saldos das contas',
      };
    }

    console.log(`✅ Job ledger processado com sucesso: ${job.id}`);
};