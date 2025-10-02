import mongoose from "mongoose";
import { partyEnum } from "./partyEnum";

export type IParty = {
  psp: string;
  account: string;
  type: partyEnum.PHYSICAL | partyEnum.LEGAL;
  pixKey: string;
  name: string;
};

export const PartySchema = new mongoose.Schema<IParty>(
	{
    psp: { 
      type: String, 
      description: 'The psp'
    },
    account: { 
      type: String, 
      description: 'The account id'
    },
    type: {
      type: String,
      enum: Object.values(partyEnum),
    },
		pixKey: { 
			type: String,
      description: 'The pix key'
		},
    name: {
      type: String,
      description: 'The user name'
    },
	},
	{ _id: false }
);