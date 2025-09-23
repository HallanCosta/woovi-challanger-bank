import { BULLMQ_JOBS } from '../../queue';
import { createLedgerEntriesJob } from './createLedgerEntriesJob';

export const ledgerBullMqJobs = {
  [BULLMQ_JOBS.LEDGER_ENTRIES_CREATE]: createLedgerEntriesJob,
};

export type LedgerBullMqJobsType = typeof ledgerBullMqJobs;
