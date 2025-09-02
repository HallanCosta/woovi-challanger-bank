import mongoose from 'mongoose';
import { GraphQLString, GraphQLNonNull, GraphQLFloat, GraphQLInputObjectType } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

import { PartyInputType } from '../../graphql/PartyType';

import { IParty, LedgerEntry } from '../../ledgerEntry/LedgerEntryModel';
import { ledgerEntryEnum } from '../../ledgerEntry/ledgerEntryEnum';

import { pixTransactionField } from '../pixTransactionFields';
import { pixTransactionEnum } from '../pixTransactionEnum';
import { IPixTransactionStatus } from '../PixTransactionModal';

export type CreatePixTransactionInput = {
  value: number;
  status: IPixTransactionStatus;
  partyDebit: IParty;
  partyCredit: IParty;
  description: string;
};

const mutation = mutationWithClientMutationId({
  name: 'CreatePixTransaction',
  inputFields: {
    value: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    partyDebit: {
      type: new GraphQLNonNull(PartyInputType),
    },
    partyCredit: {
      type: new GraphQLNonNull(PartyInputType),
    },
    description: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (args: CreatePixTransactionInput) => {
    const transactionId = new mongoose.Types.ObjectId();

    const [ledgerEntryDebit, ledgerEntryCredit] = await LedgerEntry.insertMany([
      {
        value: args.value,
        type: ledgerEntryEnum.DEBIT,
        status: pixTransactionEnum.CREATED,
        ledgerAccount: args.partyDebit,
        description: args.description,
        pixTransaction: transactionId.toString(),
      },
      {
        value: args.value,
        type: ledgerEntryEnum.CREDIT,
        status: pixTransactionEnum.CREATED,
        ledgerAccount: args.partyCredit,
        description: args.description,
        pixTransaction: transactionId.toString(),
      }
    ]);

    // redisPubSub.publish(PUB_SUB_EVENTS.PIX_TRANSACTION.ADDED, {
    //   pixTransaction: pixTransaction._id.toString(),
    // });

    return {
      pixTransaction: transactionId.toString(),
    };
  },
  outputFields: {
    ...pixTransactionField('pixTransaction'),
  },
});

export const CreatePixTransactionMutation = {
  ...mutation,
};
