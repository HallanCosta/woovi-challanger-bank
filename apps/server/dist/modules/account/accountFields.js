"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountConnectionField = exports.accountField = void 0;
const AccountType_1 = require("./AccountType");
const AccountLoader_1 = require("./AccountLoader");
const graphql_relay_1 = require("graphql-relay");
const graphql_1 = require("graphql");
const accountField = (key) => ({
    [key]: {
        type: AccountType_1.AccountType,
        resolve: async (obj, _, context) => AccountLoader_1.AccountLoader.load(context, obj.account),
    },
});
exports.accountField = accountField;
const AccountFilters = new graphql_1.GraphQLInputObjectType({
    name: 'AccountFilters',
    description: 'Filters for the accounts',
    fields: () => ({
        user: { type: graphql_1.GraphQLString },
        pixKey: { type: graphql_1.GraphQLString }
    })
});
const accountConnectionField = (key) => ({
    [key]: {
        type: AccountType_1.AccountConnection.connectionType,
        args: {
            ...graphql_relay_1.connectionArgs,
            filters: {
                type: AccountFilters,
            }
        },
        resolve: async (_, args, context) => {
            return await AccountLoader_1.AccountLoader.loadAll(context, args);
        },
    },
});
exports.accountConnectionField = accountConnectionField;
