"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixTransaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PartyModel_1 = require("../graphql/PartyModel");
const pixTransactionEnum_1 = require("./pixTransactionEnum");
const Schema = new mongoose_1.default.Schema({
    value: {
        type: Number,
        description: 'The value'
    },
    status: {
        type: String,
        enum: Object.values(pixTransactionEnum_1.pixTransactionEnum),
        default: pixTransactionEnum_1.pixTransactionEnum.CREATED,
        index: true,
    },
    debitParty: {
        type: PartyModel_1.PartySchema,
        description: 'The ledger account'
    },
    creditParty: {
        type: PartyModel_1.PartySchema,
        description: 'The ledger account'
    },
    description: {
        type: String,
        description: 'The description'
    },
    idempotencyKey: {
        type: String,
        required: true,
        unique: true,
        index: true,
        description: 'Unique key for idempotency control'
    }
}, {
    collection: 'PixTransaction',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
Schema.virtual('id').get(function () {
    return this._id.toHexString();
});
// Schema.index({ id: 1 }, { unique: true });
exports.PixTransaction = mongoose_1.default.model('PixTransaction', Schema);
