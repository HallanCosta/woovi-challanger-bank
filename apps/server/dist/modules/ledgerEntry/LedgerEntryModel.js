"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ledgerEntryEnum_1 = require("./ledgerEntryEnum");
const pixTransactionEnum_1 = require("../pix/pixTransactionEnum");
const PartyModel_1 = require("../graphql/PartyModel");
const Schema = new mongoose_1.default.Schema({
    value: {
        type: Number,
        description: 'The value'
    },
    type: {
        type: String,
        enum: [ledgerEntryEnum_1.ledgerEntryEnum.DEBIT, ledgerEntryEnum_1.ledgerEntryEnum.CREDIT],
        description: 'The type'
    },
    status: {
        type: String,
        enum: Object.values(pixTransactionEnum_1.pixTransactionEnum),
        default: pixTransactionEnum_1.pixTransactionEnum.CREATED,
        index: true,
    },
    ledgerAccount: {
        type: PartyModel_1.PartySchema,
        description: 'The ledger account'
    },
    description: {
        type: String,
        description: 'The description'
    },
    pixTransaction: {
        type: String,
        description: 'The pix transaction id'
    },
    idempotencyKey: {
        type: String,
        required: true,
        description: 'Unique key for idempotency control'
    },
}, {
    collection: 'LedgerEntry',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
Schema.virtual('id').get(function () {
    return this._id.toHexString();
});
// Índice composto para idempotência: garante que não haverá entradas duplicadas
// para a mesma chave de idempotência e operação (DEBIT/CREDIT)
Schema.index({ idempotencyKey: 1, type: 1 }, { unique: true });
// Manter índice existente para consultas por conta e transação PIX
Schema.index({ ledgerAccount: 1, pixTransaction: 1 });
Schema.pre("save", function (next) {
    if (!this.isNew) {
        next(new Error("LedgerEntry transactions cannot be changed"));
        return;
    }
    next();
});
exports.LedgerEntry = mongoose_1.default.model('LedgerEntry', Schema);
