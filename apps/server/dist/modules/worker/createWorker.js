"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = void 0;
const config_1 = require("../../config");
const ioredis_1 = __importDefault(require("ioredis"));
const bullmq_1 = require("bullmq");
const connection = new ioredis_1.default(config_1.config.REDIS_HOST, {
    maxRetriesPerRequest: null,
});
const createWorker = ({ queueName, queueHandlers }) => {
    const worker = new bullmq_1.Worker(queueName, async (job) => {
        const handler = queueHandlers[job.name];
        if (!handler) {
            throw new Error(`Handler not found for job: ${job.name}`);
        }
        await handler(job);
    }, {
        connection,
        // concurrency: 5,
    });
    return worker;
};
exports.createWorker = createWorker;
