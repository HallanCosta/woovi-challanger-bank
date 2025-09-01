import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

import { ledgerEntryEnum } from './ledgerEntryEnum';

export type ILedgerEntry = {
	account: string;
	value: number;
  type: ledgerEntryEnum.DEBIT | ledgerEntryEnum.CREDIT;
	description: string;
	pixTransaction: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

const Schema = new mongoose.Schema<ILedgerEntry>(
	{
    account: { 
      type: String, 
      description: 'The account id'
    },
    value: { 
      type: Number, 
      description: 'The value'
    },
    type: { 
      type: String,
      enum: [ledgerEntryEnum.DEBIT, ledgerEntryEnum.CREDIT],
      description: 'The type'
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
