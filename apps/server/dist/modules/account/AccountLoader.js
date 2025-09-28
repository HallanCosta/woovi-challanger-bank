"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountLoader = void 0;
const graphql_mongo_helpers_1 = require("@entria/graphql-mongo-helpers");
const loaderRegister_1 = require("../loader/loaderRegister");
const AccountModel_1 = require("./AccountModel");
const { Wrapper, getLoader, clearCache, load, loadAll } = (0, graphql_mongo_helpers_1.createLoader)({
    model: AccountModel_1.Account,
    loaderName: 'AccountLoader',
});
(0, loaderRegister_1.registerLoader)('AccountLoader', getLoader);
exports.AccountLoader = {
    Account: Wrapper,
    getLoader,
    clearCache,
    load,
    loadAll,
};
