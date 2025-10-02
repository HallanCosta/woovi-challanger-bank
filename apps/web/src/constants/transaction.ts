import { TransactionStatus } from './transactionStatus';

export const TRANSACTION_STATUS_LABELS = {
  [TransactionStatus.COMPLETED]: 'Concluída',
  [TransactionStatus.PENDING]: 'Pendente',
  [TransactionStatus.FAILED]: 'Falhou',
} as const;

export type TransactionStatusKey = keyof typeof TRANSACTION_STATUS_LABELS;

export const LEDGER_STATUS_TO_TRANSACTION_STATUS: Record<string, TransactionStatusKey> = {
  COMPLETED: TransactionStatus.COMPLETED,
  SUCCESS: TransactionStatus.COMPLETED,
  PENDING: TransactionStatus.PENDING,
  PROCESSING: TransactionStatus.PENDING,
  FAILED: TransactionStatus.FAILED,
  ERROR: TransactionStatus.FAILED,
};

export const PSP_DISPLAY_NAME = 'Challanger Bank';
export const PSP_LEGAL_NAME = 'Bank Challanger LTDA';


