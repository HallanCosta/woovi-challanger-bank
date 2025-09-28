"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixTransactionEnum = void 0;
var pixTransactionEnum;
(function (pixTransactionEnum) {
    pixTransactionEnum["CREATED"] = "CREATED";
    pixTransactionEnum["SENT"] = "SENT";
    pixTransactionEnum["CONFIRMED"] = "CONFIRMED";
    pixTransactionEnum["SETTLED"] = "SETTLED";
    pixTransactionEnum["REFUNDED"] = "REFUNDED";
    pixTransactionEnum["FAILED"] = "FAILED";
})(pixTransactionEnum || (exports.pixTransactionEnum = pixTransactionEnum = {}));
