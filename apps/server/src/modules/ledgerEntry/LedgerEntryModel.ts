import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

import { ledgerEntryEnum } from './ledgerEntryEnum';
import { partyEnum } from './partyEnum';
import { pixTransactionEnum } from '../pix/pixTransactionEnum';
import { IPixTransactionStatus } from '../pix/PixTransactionModal';

export type IParty = {
  psp: string;
  account: string;
  name: string;
  document: string;
  type: partyEnum.PHYSICAL | partyEnum.LEGAL;
  pixKey: string;
};

export type ILedgerEntry = {
	value: number;
  type: ledgerEntryEnum.DEBIT | ledgerEntryEnum.CREDIT;
  status: IPixTransactionStatus;
	ledgerAccount: IParty;
	description: string;
	pixTransaction: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

const PartySchema = new mongoose.Schema<IParty>(
	{
    psp: { 
      type: String, 
      description: 'The psp'
    },
    account: { 
      type: String, 
      description: 'The account id'
    },
		name: { 
			type: String, 
      description: 'The party name'
		},
    type: {
      type: String,
      enum: Object.values(partyEnum),
    },
		document: { 
			type: String, 
      description: 'The party document'
		},
		pixKey: { 
			type: String,
      description: 'The pix key'
		},
	},
	{ _id: false }
);

const Schema = new mongoose.Schema<ILedgerEntry>(
	{
    value: { 
      type: Number, 
      description: 'The value'
    },
    type: { 
      type: String,
      enum: [ledgerEntryEnum.DEBIT, ledgerEntryEnum.CREDIT],
      description: 'The type'
    },
    status: {
			type: String,
			enum: Object.values(pixTransactionEnum),
			default: pixTransactionEnum.CREATED,
			index: true,
		},
		ledgerAccount: { 
			type: PartySchema, 
      description: 'The ledger account'
		},
    description: { 
      type: String, 
      description: 'The description'
    },
    pixTransaction: { 
      type: String, 
      description: 'The pix transaction id'
    },
  },
	{
		collection: 'LedgerEntry',
		timestamps: true,
	}
);

Schema.index({ account: 1, pixTransaction: 1 }, { unique: true });

// Schema.pre("save", function (next) {
//   if (!this.isNew) {
//     return next(new Error("LedgerEntry transactions cannot be changed"));
//   }
//   next();
// });

export const LedgerEntry: Model<ILedgerEntry> = mongoose.model('LedgerEntry', Schema);
