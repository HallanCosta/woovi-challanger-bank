import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';
import { partyEnum } from '../ledgerEntry/partyEnum';

export type IAccount = {
	pixKey: string;
	user: string;
	balance: number;
	type: partyEnum.LEGAL | partyEnum.PHYSICAL;
	psp: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

const Schema = new mongoose.Schema<IAccount>(
	{
		pixKey: {
			type: String,
			description: 'The account number',
		},
    user: {
      type: String,
      description: 'The user id',
    },
    balance: {
      type: Number,
      description: 'The account balance',
    },
    type: {
      type: String,
      enum: Object.values(partyEnum),
      default: partyEnum.PHYSICAL,
      description: 'The account type (PHYSICAL or COMPANY)',
    },
    psp: {
      type: String,
      default: 'Bank Challanger LTDA',
      description: 'The PSP (Payment Service Provider)',
    },
	},
	{
		collection: 'Account',
		timestamps: true,
	}
);

export const Account: Model<IAccount> = mongoose.model('Account', Schema);
