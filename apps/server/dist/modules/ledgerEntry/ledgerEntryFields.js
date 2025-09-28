"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledgerEntryConnectionField = exports.ledgerEntryField = void 0;
const LedgerEntryType_1 = require("./LedgerEntryType");
const LedgerEntryLoader_1 = require("./LedgerEntryLoader");
const graphql_relay_1 = require("graphql-relay");
const graphql_1 = require("graphql");
const LedgerEntryModel_1 = require("./LedgerEntryModel");
const ledgerEntryField = (key) => ({
    [key]: {
        type: LedgerEntryType_1.LedgerEntryType,
        resolve: async (obj, _, context) => LedgerEntryLoader_1.LedgerEntryLoader.load(context, obj.account),
    },
});
exports.ledgerEntryField = ledgerEntryField;
const LedgerEntryFilters = new graphql_1.GraphQLInputObjectType({
    name: 'LedgerEntryFilters',
    description: 'Filters for the ledger entries',
    fields: () => ({
        account: { type: graphql_1.GraphQLString }
    })
});
const ledgerEntryConnectionField = (key) => ({
    [key]: {
        type: LedgerEntryType_1.LedgerEntryConnection.connectionType,
        args: {
            ...graphql_relay_1.connectionArgs,
            filters: {
                type: LedgerEntryFilters,
            }
        },
        resolve: async (_, args, context) => {
            const { filters } = args;
            const query = {};
            if (filters?.account) {
                query['ledgerAccount.account'] = filters.account;
            }
            if (Object.keys(query).length === 0) {
                return await LedgerEntryLoader_1.LedgerEntryLoader.loadAll(context, args);
            }
            const documents = await LedgerEntryModel_1.LedgerEntry.find(query).sort({ createdAt: -1 });
            return (0, graphql_relay_1.connectionFromArray)(documents, args);
        },
    },
});
exports.ledgerEntryConnectionField = ledgerEntryConnectionField;
