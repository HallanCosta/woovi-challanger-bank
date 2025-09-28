"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixTransactionLoader = void 0;
const graphql_mongo_helpers_1 = require("@entria/graphql-mongo-helpers");
const loaderRegister_1 = require("../loader/loaderRegister");
const PixTransactionModel_1 = require("./PixTransactionModel");
const { Wrapper, getLoader, clearCache, load, loadAll } = (0, graphql_mongo_helpers_1.createLoader)({
    model: PixTransactionModel_1.PixTransaction,
    loaderName: 'PixTransactionLoader',
});
(0, loaderRegister_1.registerLoader)('PixTransactionLoader', getLoader);
exports.PixTransactionLoader = {
    PixTransaction: Wrapper,
    getLoader,
    clearCache,
    load,
    loadAll,
};
