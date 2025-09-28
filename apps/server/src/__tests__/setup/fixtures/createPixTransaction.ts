import mongoose from "mongoose";
import { IPixTransaction, PixTransaction } from "../../../modules/pix/PixTransactionModel";
import { pixTransactionEnum } from "../../../modules/pix/pixTransactionEnum";
import { PixTransactionStatus } from "../../../modules/pix/mutations/pixTransactionStatusEnum";
import { hasSufficientBalance } from "../../../modules/account/accountService";
import { BULLMQ_JOBS, bullMqQueues, createJob } from "../../../modules/queue";

export type PixTransactionCreated = {
  error: string | null;
  success: string;
  pixTransaction: IPixTransaction;
};

/**
 * Cria uma transação PIX
 * @param payload {account1, account2, value, idempotencyKey} - Dados da transação
 * @returns Transação PIX
 */
export async function createPixTransaction({
  ...payload
}) {
  const debitParty = {
    account: payload.account1.id,
    psp: payload.account1.psp,
    type: payload.account1.type,
    pixKey: payload.account1.pixKey,
  };

  const creditParty = {
    account: payload.account2.id,
    psp: payload.account2.psp,
    type: payload.account2.type,
    pixKey: payload.account2.pixKey,
  };

  const hasBalance = await hasSufficientBalance(payload.account1._id.toString(), payload.value);

  if (!hasBalance) {
    return {
      error: PixTransactionStatus.INSUFFICIENT_BALANCE,
    }
  }

  const transactionId = new mongoose.Types.ObjectId().toString();

  const pixTransaction = await new PixTransaction({
    id: transactionId,
    value: payload.value,
    status: pixTransactionEnum.CREATED,
    debitParty,
    creditParty,
    description: 'Test transaction',
    idempotencyKey: payload.idempotencyKey,
    ...payload,
  }).save()

  if (!pixTransaction) {
    return {
      error: PixTransactionStatus.FAILED_TO_CREATE_PIX_TRANSACTION,
    }
  }

  return {
    error: null,
    success: PixTransactionStatus.SUCCESS,
    pixTransaction,
  };
}