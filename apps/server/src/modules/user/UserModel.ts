import type { Document } from 'mongoose';

export type IUser = {
	email: string;
	password: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;