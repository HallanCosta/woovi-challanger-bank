"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const partyEnum_1 = require("./partyEnum");
exports.PartySchema = new mongoose_1.default.Schema({
    psp: {
        type: String,
        description: 'The psp'
    },
    account: {
        type: String,
        description: 'The account id'
    },
    type: {
        type: String,
        enum: Object.values(partyEnum_1.partyEnum),
    },
    pixKey: {
        type: String,
        description: 'The pix key'
    },
}, { _id: false });
