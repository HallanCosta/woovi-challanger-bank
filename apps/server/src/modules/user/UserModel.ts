import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

const Schema = new mongoose.Schema<IUser>(
	{
		email: {
			type: String,
			description: 'The user email',
		},
	},
	{
		collection: 'User',
		timestamps: true,
	}
);

export type IUser = {
	email: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;

export const User: Model<IUser> = mongoose.model('User', Schema);
