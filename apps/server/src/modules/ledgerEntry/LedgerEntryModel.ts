import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

import { ledgerEntryEnum } from './ledgerEntryEnum';
import { pixTransactionEnum } from '../pix/pixTransactionEnum';
import { IPixTransactionStatus } from '../pix/PixTransactionModel';
import { IParty, PartySchema } from '../graphql/PartyModel';

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
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

Schema.virtual('id').get(function() {
	return this._id.toHexString();
});

Schema.index({ ledgerAccount: 1, pixTransaction: 1 }, { unique: true });

Schema.pre("save", function (next) {
  if (!this.isNew) {
    next(new Error("LedgerEntry transactions cannot be changed"));
    return;
  }
  next();
});

export const LedgerEntry: Model<ILedgerEntry> = mongoose.model('LedgerEntry', Schema);