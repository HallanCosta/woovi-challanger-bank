"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const partyEnum_1 = require("../graphql/partyEnum");
const Schema = new mongoose_1.default.Schema({
    pixKey: {
        type: String,
        description: 'The account number',
    },
    user: {
        type: String,
        description: 'The user id',
    },
    balance: {
        type: Number,
        description: 'The account balance',
    },
    type: {
        type: String,
        enum: Object.values(partyEnum_1.partyEnum),
        default: partyEnum_1.partyEnum.PHYSICAL,
        description: 'The account type (PHYSICAL or COMPANY)',
    },
    psp: {
        type: String,
        default: 'Bank Challanger LTDA',
        description: 'The PSP (Payment Service Provider)',
    },
}, {
    collection: 'Account',
    timestamps: true,
});
exports.Account = mongoose_1.default.model('Account', Schema);
