import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

export type IAccount = {
	pixKey: string;
	user: string;
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
	},
	{
		collection: 'Account',
		timestamps: true,
	}
);

export const Account: Model<IAccount> = mongoose.model('Account', Schema);
