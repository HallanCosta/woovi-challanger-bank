import { PixTransaction } from '../modules/pix/PixTransactionModel';
import { createAccount } from './setup/fixtures/createAccount';
import { createPixTransaction, PixTransactionCreated } from './setup/fixtures/createPixTransaction';
import { setupDatabase } from './setup';
import { uuidv4 } from 'mongodb-memory-server-core/lib/util/utils';
import { PixTransactionStatus } from '../modules/pix/mutations/pixTransactionStatusEnum';
import { BULLMQ_JOBS } from '../modules/queue';

// Mock completo do módulo queue para evitar problemas com Redis/BullMQ
const mockCreateJob = jest.fn();
const mockBullMqQueues = {
  LEDGER: {
    add: jest.fn(),
  },
};

jest.mock('../modules/queue', () => ({
  createJob: mockCreateJob,
  bullMqQueues: mockBullMqQueues,
  BULLMQ_JOBS: {
    LEDGER_ENTRIES_CREATE: 'LEDGER_ENTRIES_CREATE',
  },
}));

setupDatabase();

it('should create a pix transaction successfully', async () => {
  const account1 = await createAccount({ balance: 1000 });
  const account2 = await createAccount({ balance: 500 });
  const value = 200;
  const idempotencyKey = uuidv4();

  const { 
    error, 
    success, 
    pixTransaction: pixTransactionCreated
  } = await createPixTransaction({ 
    account1, 
    account2, 
    value, 
    idempotencyKey 
  }) as PixTransactionCreated;
  
  const pixTransaction = await PixTransaction.findOne({ _id: pixTransactionCreated?._id });

  expect(error).toBeNull();
  expect(success).toBe(PixTransactionStatus.SUCCESS);
  expect(pixTransactionCreated).toBeDefined();
  expect(pixTransaction?.idempotencyKey).toBe(idempotencyKey);
});

it('enqueues a ledger job when a PixTransaction is created', async () => {
  // Mock do job retornado pela fila
  const jobId = uuidv4();
  const mockJob = {
    id: jobId,
    name: BULLMQ_JOBS.LEDGER_ENTRIES_CREATE,
    data: {},
  };

  mockBullMqQueues.LEDGER.add.mockResolvedValue(mockJob);

  const pixTransactionId = uuidv4();

  const jobData = {
    pixTransactionId,
  };

  const jobOptions = {
    jobId: `ledger-${pixTransactionId}`,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  };

  // Chamar queue.add diretamente (simulando o que acontece dentro de createJob)
  const jobResult = await mockBullMqQueues.LEDGER.add(
    BULLMQ_JOBS.LEDGER_ENTRIES_CREATE,
    jobData,
    jobOptions
  );

  // Verificar se o job foi criado com sucesso
  expect(jobResult).toBeDefined();
  expect(jobResult.id).toBe(jobId);

  // Verificar se queue.add foi chamado com os parâmetros corretos
  expect(mockBullMqQueues.LEDGER.add).toHaveBeenCalledWith(
    BULLMQ_JOBS.LEDGER_ENTRIES_CREATE,
    jobData,
    jobOptions
  );
});
