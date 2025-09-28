"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
async function connectDatabase() {
    mongoose_1.default.connection.on('error', (error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.log('Database connection disconnected');
    });
    mongoose_1.default.connection.on('connected', () => {
        console.log('Database connection established');
    });
    // eslint-disable-next-line
    mongoose_1.default.connection.on('close', () => console.log('Database connection closed.'));
    await mongoose_1.default.connect(config_1.config.MONGO_URI);
}
