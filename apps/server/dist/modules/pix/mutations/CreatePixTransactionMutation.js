"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePixTransactionMutation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const graphql_1 = require("graphql");
const graphql_relay_1 = require("graphql-relay");
// import { redisPubSub } from '../../pubSub/redisPubSub';
// import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';
const PartyType_1 = require("../../graphql/PartyType");
const fieldString_1 = require("../../graphql/fieldString");
const accountService_1 = require("../../account/accountService");
const PixTransactionModel_1 = require("../PixTransactionModel");
const pixTransactionFields_1 = require("../pixTransactionFields");
const pixTransactionStatusEnum_1 = require("./pixTransactionStatusEnum");
const queue_1 = require("../../queue");
const mutation = (0, graphql_relay_1.mutationWithClientMutationId)({
    name: 'CreatePixTransaction',
    inputFields: {
        value: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat),
        },
        status: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
        debitParty: {
            type: new graphql_1.GraphQLNonNull(PartyType_1.PartyInputType),
        },
        creditParty: {
            type: new graphql_1.GraphQLNonNull(PartyType_1.PartyInputType),
        },
        description: {
            type: graphql_1.GraphQLString,
        },
        idempotencyKey: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
    },
    mutateAndGetPayload: async (args) => {
        console.log('🚀 Iniciando transação PIX');
        console.log('Flow 1');
        // Verificar se já existe uma transação com a mesma idempotencyKey
        const existingTransaction = await PixTransactionModel_1.PixTransaction.findOne({ idempotencyKey: args.idempotencyKey });
        if (existingTransaction) {
            return {
                id: existingTransaction.id,
                error: 'Transação PIX já foi processada anteriormente!',
            };
        }
        // Validações iniciais (mínimo de 1 centavo)
        if (args.value < 1) {
            return {
                error: pixTransactionStatusEnum_1.PixTransactionStatus.INVALID_TRANSACTION_VALUE,
            };
        }
        console.log('Flow 2');
        // Validar se a conta de débito tem saldo suficiente
        const debitAccountId = (0, graphql_relay_1.fromGlobalId)(args.debitParty.account).id;
        const transactionId = new mongoose_1.default.Types.ObjectId().toString();
        console.log('✅ Validando saldo da conta de débito');
        const hasBalance = await (0, accountService_1.hasSufficientBalance)(debitAccountId, args.value);
        if (!hasBalance) {
            return {
                error: pixTransactionStatusEnum_1.PixTransactionStatus.INSUFFICIENT_BALANCE,
            };
        }
        console.log('Flow 3');
        // Criar e salvar a transação PIX
        const pixTransaction = await PixTransactionModel_1.PixTransaction.create({
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
                error: pixTransactionStatusEnum_1.PixTransactionStatus.FAILED_TO_CREATE_PIX_TRANSACTION,
            };
        }
        console.log('Flow 3.1');
        const job = await (0, queue_1.createJob)({
            queue: queue_1.bullMqQueues.LEDGER,
            jobName: queue_1.BULLMQ_JOBS.LEDGER_ENTRIES_CREATE,
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
                error: pixTransactionStatusEnum_1.PixTransactionStatus.FAILED_TO_CREATE_JOB,
            };
        }
        console.log(`Flow 3.2`);
        return {
            id: transactionId,
            success: pixTransactionStatusEnum_1.PixTransactionStatus.SUCCESS,
        };
    },
    outputFields: {
        ...(0, pixTransactionFields_1.pixTransactionField)('pixTransaction'),
        ...(0, fieldString_1.fieldString)('success'),
        ...(0, fieldString_1.fieldString)('error'),
    },
});
exports.CreatePixTransactionMutation = {
    ...mutation,
};
