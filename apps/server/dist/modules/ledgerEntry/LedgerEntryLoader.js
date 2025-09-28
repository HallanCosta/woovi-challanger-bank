"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntryLoader = void 0;
const graphql_mongo_helpers_1 = require("@entria/graphql-mongo-helpers");
const loaderRegister_1 = require("../loader/loaderRegister");
const LedgerEntryModel_1 = require("./LedgerEntryModel");
const { Wrapper, getLoader, clearCache, load, loadAll } = (0, graphql_mongo_helpers_1.createLoader)({
    model: LedgerEntryModel_1.LedgerEntry,
    loaderName: 'LedgerEntryLoader',
});
(0, loaderRegister_1.registerLoader)('LedgerEntryLoader', getLoader);
exports.LedgerEntryLoader = {
    LedgerEntry: Wrapper,
    getLoader,
    clearCache,
    load,
    loadAll,
};
