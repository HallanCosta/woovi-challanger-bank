import { pixTransactionEnum } from "./pixTransactionEnum";

import { IParty } from "../ledgerEntry/LedgerEntryModel";

export type IPixTransactionStatus = 
	| pixTransactionEnum.CREATED 
	| pixTransactionEnum.SENT 
	| pixTransactionEnum.CONFIRMED 
	| pixTransactionEnum.SETTLED 
	| pixTransactionEnum.REFUNDED 
	| pixTransactionEnum.FAILED;

// export type IPixTransaction = {
//   value: number;
//   status: IPixTransactionStatus;
//   partyDebit: IParty;
//   partyCredit: IParty;
//   description: string;
//   createdAt: Date;
//   updatedAt: Date;
// };