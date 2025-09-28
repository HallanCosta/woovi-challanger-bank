"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBullMq = void 0;
const ledgerBullMqJobs_1 = require("../ledgerEntry/jobs/ledgerBullMqJobs");
const createWorker_1 = require("./createWorker");
const runBullMq = async () => {
    const queues = [
        {
            queueName: 'LEDGER',
            queueHandlers: ledgerBullMqJobs_1.ledgerBullMqJobs,
        }
    ];
    queues.forEach(({ queueName, queueHandlers }) => {
        (0, createWorker_1.createWorker)({ queueName, queueHandlers });
    });
};
exports.runBullMq = runBullMq;
