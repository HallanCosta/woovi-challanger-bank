import mongoose from "mongoose";
import { PixTransaction } from "../../../modules/pix/PixTransactionModel";
import { pixTransactionEnum } from "../../../modules/pix/pixTransactionEnum";
import { PixTransactionStatus } from "../../../modules/pix/mutations/pixTransactionStatusEnum";
import { hasSufficientBalance } from "../../../modules/account/accountService";

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

  const hasBalance = await hasSufficientBalance(payload.account1.id, payload.value);

  if (!hasBalance) {
    return {
      error: PixTransactionStatus.INSUFFICIENT_BALANCE,
    }
  }

  const transactionId = new mongoose.Types.ObjectId().toString();

  const pixTransaction = await new PixTransaction({
    id: transactionId,
    value: 1000,
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