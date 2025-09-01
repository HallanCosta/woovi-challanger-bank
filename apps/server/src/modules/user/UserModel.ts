import type { Document } from 'mongoose';

export type IUser = {
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
} & Document;