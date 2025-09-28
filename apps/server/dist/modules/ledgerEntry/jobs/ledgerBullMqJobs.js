"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ledgerBullMqJobs = void 0;
const queue_1 = require("../../queue");
const createLedgerEntriesJob_1 = require("./createLedgerEntriesJob");
exports.ledgerBullMqJobs = {
    [queue_1.BULLMQ_JOBS.LEDGER_ENTRIES_CREATE]: createLedgerEntriesJob_1.createLedgerEntriesJob,
};
