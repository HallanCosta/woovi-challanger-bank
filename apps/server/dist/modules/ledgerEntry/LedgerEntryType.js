"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntryConnection = exports.LedgerEntryType = void 0;
const graphql_1 = require("graphql");
const graphql_relay_1 = require("graphql-relay");
const typeRegister_1 = require("../node/typeRegister");
const typeRegister_2 = require("../node/typeRegister");
const LedgerEntryLoader_1 = require("./LedgerEntryLoader");
const PartyType_1 = require("../graphql/PartyType");
const LedgerEntryType = new graphql_1.GraphQLObjectType({
    name: 'LedgerEntry',
    description: 'Represents a ledger entry',
    fields: () => ({
        id: (0, graphql_relay_1.globalIdField)('LedgerEntry'),
        value: {
            type: graphql_1.GraphQLInt,
            description: 'The value integer',
            resolve: (ledgerEntry) => ledgerEntry.value,
        },
        type: {
            type: graphql_1.GraphQLString,
            resolve: (ledgerEntry) => ledgerEntry.type,
        },
        status: {
            type: graphql_1.GraphQLString,
            resolve: (ledgerEntry) => ledgerEntry.status,
        },
        ledgerAccount: {
            type: PartyType_1.PartyType,
            resolve: (ledgerEntry) => ledgerEntry.ledgerAccount,
        },
        description: {
            type: graphql_1.GraphQLString,
            resolve: (ledgerEntry) => ledgerEntry.description,
        },
        pixTransaction: {
            type: graphql_1.GraphQLString,
            resolve: (ledgerEntry) => ledgerEntry.pixTransaction,
        },
        idempotencyKey: {
            type: graphql_1.GraphQLString,
            resolve: (ledgerEntry) => ledgerEntry.idempotencyKey,
        },
        createdAt: {
            type: graphql_1.GraphQLString,
            resolve: (ledgerEntry) => ledgerEntry.createdAt.toISOString(),
        },
    }),
    interfaces: () => [typeRegister_1.nodeInterface],
});
exports.LedgerEntryType = LedgerEntryType;
const LedgerEntryConnection = (0, graphql_relay_1.connectionDefinitions)({
    name: 'LedgerEntry',
    nodeType: LedgerEntryType,
});
exports.LedgerEntryConnection = LedgerEntryConnection;
// @ts-ignore
(0, typeRegister_2.registerTypeLoader)(LedgerEntryType, LedgerEntryLoader_1.LedgerEntryLoader.load);
