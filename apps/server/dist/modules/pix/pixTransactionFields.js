"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixTransactionConnectionField = exports.pixTransactionField = void 0;
const PixTransactionType_1 = require("./PixTransactionType");
// import { PixTransactionLoader } from './PixTransactionLoader';
const graphql_relay_1 = require("graphql-relay");
const graphql_1 = require("graphql");
const PixTransactionLoader_1 = require("./PixTransactionLoader");
const pixTransactionField = (key) => ({
    [key]: {
        type: PixTransactionType_1.PixTransactionType,
        resolve: async (obj, _, context) => PixTransactionLoader_1.PixTransactionLoader.load(context, obj.id),
    },
});
exports.pixTransactionField = pixTransactionField;
const PixTransactionFilters = new graphql_1.GraphQLInputObjectType({
    name: 'PixTransactionFilters',
    description: 'Filters for the pix transactions',
    fields: () => ({
        user: { type: graphql_1.GraphQLString }
    })
});
const pixTransactionConnectionField = (key) => ({
    [key]: {
        type: PixTransactionType_1.PixTransactionConnection.connectionType,
        args: {
            ...graphql_relay_1.connectionArgs,
            filters: {
                type: PixTransactionFilters,
            }
        },
        resolve: async (_, args, context) => {
            return await PixTransactionLoader_1.PixTransactionLoader.loadAll(context, args);
        },
    },
});
exports.pixTransactionConnectionField = pixTransactionConnectionField;
