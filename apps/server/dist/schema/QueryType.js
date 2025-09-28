"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryType = void 0;
const graphql_1 = require("graphql");
const accountFields_1 = require("../modules/account/accountFields");
const ledgerEntryFields_1 = require("../modules/ledgerEntry/ledgerEntryFields");
const userFields_1 = require("../modules/user/userFields");
const pixTransactionFields_1 = require("../modules/pix/pixTransactionFields");
exports.QueryType = new graphql_1.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        ...(0, accountFields_1.accountConnectionField)('accounts'),
        ...(0, userFields_1.userConnectionField)('users'),
        ...(0, ledgerEntryFields_1.ledgerEntryConnectionField)('ledgerEntries'),
        ...(0, pixTransactionFields_1.pixTransactionConnectionField)('pixTransactions'),
    }),
});
