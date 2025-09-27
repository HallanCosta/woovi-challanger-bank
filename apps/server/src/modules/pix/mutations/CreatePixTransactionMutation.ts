import mongoose from 'mongoose';
import { GraphQLString, GraphQLNonNull, GraphQLFloat } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

// import { redisPubSub } from '../../pubSub/redisPubSub';
// import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

import { PartyInputType } from '../../graphql/PartyType';
import { fieldString } from '../../graphql/fieldString';

import { hasSufficientBalance } from '../../account/accountService';

import { IParty } from '../../graphql/PartyModel';
import { IPixTransactionStatus, PixTransaction } from '../PixTransactionModel';
import { pixTransactionField } from '../pixTransactionFields';

import { PixTransactionStatus } from './pixTransactionStatusEnum';
import { bullMqQueues, BULLMQ_JOBS, createJob } from '../../queue';

export type CreatePixTransactionInput = {
  value: number;
  status: IPixTransactionStatus;
  debitParty: IParty;
  creditParty: IParty;
  description: string;
  idempotencyKey: string;
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
    debitParty: {
      type: new GraphQLNonNull(PartyInputType),
    },
    creditParty: {
      type: new GraphQLNonNull(PartyInputType),
    },
    description: {
      type: GraphQLString,
    },
    idempotencyKey: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args: CreatePixTransactionInput) => {
    console.log('🚀 Iniciando transação PIX');
    console.log('Flow 1');

    // Verificar se já existe uma transação com a mesma idempotencyKey
    const existingTransaction = await PixTransaction.findOne({ idempotencyKey: args.idempotencyKey });
    if (existingTransaction) {
      return {
        id: existingTransaction.id,
        error: 'Transação PIX já foi processada anteriormente!',
      };
    }

    // Validações iniciais (mínimo de 1 centavo)
    if (args.value < 1) {
      return {
        error: PixTransactionStatus.INVALID_TRANSACTION_VALUE,
      };
    }

    console.log('Flow 2');

    // Validar se a conta de débito tem saldo suficiente
    const debitAccountId = fromGlobalId(args.debitParty.account).id;
    const transactionId = new mongoose.Types.ObjectId().toString();

    console.log('✅ Validando saldo da conta de débito');
    const hasBalance = await hasSufficientBalance(debitAccountId, args.value);
    if (!hasBalance) {
      return {
        error: PixTransactionStatus.INSUFFICIENT_BALANCE,
      };
    }

    console.log('Flow 3');

    // Criar e salvar a transação PIX
    const pixTransaction = await PixTransaction.create({
      id: transactionId,
      value: args.value,
      status: args.status,
      debitParty: args.debitParty,
      creditParty: args.creditParty,
      description: args.description,
      idempotencyKey: args.idempotencyKey,
    });

    if (!pixTransaction) {
      return {
        error: PixTransactionStatus.FAILED_TO_CREATE_PIX_TRANSACTION,
      };
    }

    console.log('Flow 3.1');
    
    const job = await createJob({
      queue: bullMqQueues.LEDGER,
      jobName: BULLMQ_JOBS.LEDGER_ENTRIES_CREATE,
      jobData: {
        pixTransactionId: pixTransaction.id,
      },
      options: {
        jobId: `ledger-${pixTransaction.id}`,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });

    if (!job) {
      return {
        error: PixTransactionStatus.FAILED_TO_CREATE_JOB,
      };
    }

    console.log(`Flow 3.2`);

    return {
      id: transactionId,
      success: PixTransactionStatus.SUCCESS,
    };
  },
  outputFields: {
    ...pixTransactionField('pixTransaction'),
    ...fieldString('success'),
    ...fieldString('error'),
  },
});

export const CreatePixTransactionMutation = {
  ...mutation,
};
