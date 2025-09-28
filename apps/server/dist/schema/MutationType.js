"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationType = void 0;
const graphql_1 = require("graphql");
const accountMutations_1 = require("../modules/account/mutations/accountMutations");
const pixTransactionMutations_1 = require("../modules/pix/mutations/pixTransactionMutations");
exports.MutationType = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        ...accountMutations_1.accountMutations,
        ...pixTransactionMutations_1.pixTransactionMutations,
    }),
});
