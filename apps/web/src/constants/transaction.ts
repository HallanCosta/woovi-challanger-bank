export const TRANSACTION_STATUS_LABELS = {
  COMPLETED: 'Concluída',
  PENDING: 'Pendente',
  FAILED: 'Falhou',
} as const;

export type TransactionStatusKey = keyof typeof TRANSACTION_STATUS_LABELS;

export const LEDGER_STATUS_TO_TRANSACTION_STATUS: Record<string, TransactionStatusKey> = {
  COMPLETED: 'COMPLETED',
  SUCCESS: 'COMPLETED',
  PENDING: 'PENDING',
  PROCESSING: 'PENDING',
  FAILED: 'FAILED',
  ERROR: 'FAILED',
};

export const DEFAULT_PIX_TRANSFER_DESCRIPTION = 'Transação PIX';
export const DEFAULT_PIX_LABEL = 'Transferência PIX';
export const UNKNOWN_USER_LABEL = 'Usuário Desconhecido';

export const PSP_DISPLAY_NAME = 'Challanger Bank';
export const PSP_LEGAL_NAME = 'Bank Challanger LTDA';


