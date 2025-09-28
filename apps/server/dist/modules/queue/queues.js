"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullMqQueues = exports.settings = exports.defaultJobOptions = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../../config");
exports.defaultJobOptions = {
    removeOnComplete: true,
    removeOnFail: 100,
    timeout: 1000 * 60 * 60, // 1 hour
};
exports.settings = {
    lockDuration: 60 * 1000,
    stalledInterval: 60 * 1000,
    maxStalledCount: 2,
};
const queueNames = [
    'LEDGER',
];
const connection = new ioredis_1.default(config_1.config.REDIS_HOST, {
    maxRetriesPerRequest: null,
});
const createQueue = ({ name }) => {
    return new bullmq_1.Queue(name, {
        connection,
        defaultJobOptions: exports.defaultJobOptions
    });
};
const getQueues = () => {
    return queueNames.reduce((queues, name) => ({
        ...queues,
        [name]: createQueue({ name }),
    }), {});
};
exports.bullMqQueues = getQueues();
