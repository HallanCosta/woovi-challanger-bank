import { ledgerBullMqJobs } from '../ledgerEntry/jobs/ledgerBullMqJobs';
import { createWorker } from './createWorker';

export const runBullMq = async () => {
  const queues = [
    {
      queueName: 'LEDGER',
      queueHandlers: ledgerBullMqJobs,
    }
  ];
  
  queues.forEach(({ queueName, queueHandlers }) => {
    createWorker({ queueName, queueHandlers });
  });
};