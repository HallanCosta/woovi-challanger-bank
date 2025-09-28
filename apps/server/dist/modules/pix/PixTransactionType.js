"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixTransactionConnection = exports.PixTransactionType = void 0;
const graphql_1 = require("graphql");
const graphql_relay_1 = require("graphql-relay");
const typeRegister_1 = require("../node/typeRegister");
const PartyType_1 = require("../graphql/PartyType");
const PixTransactionLoader_1 = require("./PixTransactionLoader");
const PixTransactionType = new graphql_1.GraphQLObjectType({
    name: 'PixTransaction',
    description: 'Represents a pix transaction',
    fields: () => ({
        id: (0, graphql_relay_1.globalIdField)('PixTransaction'),
        value: {
            type: graphql_1.GraphQLInt,
            description: 'The value integer',
            resolve: (pixTransaction) => pixTransaction.value,
        },
        status: {
            type: graphql_1.GraphQLString,
            resolve: (pixTransaction) => pixTransaction.status,
        },
        debitParty: {
            type: PartyType_1.PartyType,
            resolve: (pixTransaction) => pixTransaction.debitParty,
        },
        creditParty: {
            type: PartyType_1.PartyType,
            resolve: (pixTransaction) => pixTransaction.creditParty,
        },
        description: {
            type: graphql_1.GraphQLString,
            resolve: (pixTransaction) => pixTransaction.description,
        },
        idempotencyKey: {
            type: graphql_1.GraphQLString,
            resolve: (pixTransaction) => pixTransaction.idempotencyKey,
        },
        createdAt: {
            type: graphql_1.GraphQLString,
            resolve: (pixTransaction) => pixTransaction.createdAt.toISOString(),
        },
        updatedAt: {
            type: graphql_1.GraphQLString,
            resolve: (pixTransaction) => pixTransaction.updatedAt.toISOString(),
        },
    }),
    interfaces: () => [typeRegister_1.nodeInterface],
});
exports.PixTransactionType = PixTransactionType;
const PixTransactionConnection = (0, graphql_relay_1.connectionDefinitions)({
    name: 'PixTransaction',
    nodeType: PixTransactionType,
});
exports.PixTransactionConnection = PixTransactionConnection;
// @ts-ignore
(0, typeRegister_1.registerTypeLoader)(PixTransactionType, PixTransactionLoader_1.PixTransactionLoader.load);
