import mongoose, { Model, Document } from "mongoose";

import { IParty } from "../graphql/PartyModel";
import { PartySchema } from "../graphql/PartyModel";
import { pixTransactionEnum } from "./pixTransactionEnum";

export type IPixTransactionStatus = 
	| pixTransactionEnum.CREATED 
	| pixTransactionEnum.SENT 
	| pixTransactionEnum.CONFIRMED 
	| pixTransactionEnum.SETTLED 
	| pixTransactionEnum.REFUNDED 
	| pixTransactionEnum.FAILED;

export type IPixTransaction = {
  value: number;
  status: IPixTransactionStatus;
  debitParty: IParty;
  creditParty: IParty;
  description: string;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
} & Document;

const Schema = new mongoose.Schema<IPixTransaction>(
	{
    value: { 
      type: Number, 
      description: 'The value'
    },
    status: {
			type: String,
			enum: Object.values(pixTransactionEnum),
			default: pixTransactionEnum.CREATED,
			index: true,
		},
		debitParty: { 
			type: PartySchema, 
      description: 'The ledger account'
		},
		creditParty: { 
			type: PartySchema, 
      description: 'The ledger account'
		},
    description: { 
      type: String, 
      description: 'The description'
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      description: 'Unique key for idempotency control'
    }
  },
	{
		collection: 'PixTransaction',
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

Schema.virtual('id').get(function() {
	return this._id.toHexString();
});

// Schema.index({ id: 1 }, { unique: true });

export const PixTransaction: Model<IPixTransaction> = mongoose.model('PixTransaction', Schema);