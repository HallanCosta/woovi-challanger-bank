import mongoose from "mongoose";
import { Account } from "../../../modules/account/AccountModel";
import { partyEnum } from "../../../modules/ledgerEntry/partyEnum";
import { toGlobalId } from "graphql-relay";

export async function createAccount({
  ...payload
}) {
  const account = await Account.countDocuments();
  
  return await new Account({
    pixKey: `account${account + 1}@test.com`,
    user: toGlobalId('User', new mongoose.Types.ObjectId().toString()),
    balance: 2500,
    type: partyEnum.PHYSICAL,
    psp: 'Bank Challanger LTDA',
    ...payload,
  }).save();
}