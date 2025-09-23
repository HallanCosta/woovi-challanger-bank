import { config } from "../../config";
import Redis from 'ioredis';
import { Worker } from 'bullmq';
import { LedgerBullMqJobsType } from "../ledgerEntry/jobs/ledgerBullMqJobs";

type CreateWorkerData = { 
  queueName: string, 
  queueHandlers: LedgerBullMqJobsType
}

const connection = new Redis(config.REDIS_HOST, {
  maxRetriesPerRequest: null,
});

export const createWorker = ({ queueName, queueHandlers }: CreateWorkerData) => {  
  const worker = new Worker(
  queueName, 
  async(job) => {      
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