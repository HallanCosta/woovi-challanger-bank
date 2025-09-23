import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { config } from '../../config';

export const defaultJobOptions = {
  removeOnComplete: true,
  removeOnFail: 100,
  timeout: 1000 * 60 * 60, // 1 hour
};

export const settings = {
  lockDuration: 60 * 1000,
  stalledInterval: 60 * 1000,
  maxStalledCount: 2,
};

const queueNames = [
  'LEDGER',
];

type BullMqQueues = {
  LEDGER: Queue;
};

const connection = new Redis(config.REDIS_HOST, {
  maxRetriesPerRequest: null,
});

const createQueue = ({ name }: { name: string }): Queue => {
  return new Queue(name, {
    connection,
    defaultJobOptions
  });
};

const getQueues = (): BullMqQueues => {
  return queueNames.reduce(
    (queues, name) => ({
      ...queues,
      [name]: createQueue({ name }),
    }),
    {} as BullMqQueues,
  );
};

export const bullMqQueues = getQueues();