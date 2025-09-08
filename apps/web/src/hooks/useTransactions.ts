import { useState } from 'react';
import { Transaction } from '../components/Auth/TransactionList';
import { TransferData } from '../components/Auth/TransferModal';
import { useLedgerEntryQuery } from '../components/queries/useLedgerEntryQuery';

// Dados mockados das transações
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'CREDIT',
    value: 500.00,
    description: 'Transferência PIX recebida',
    sender: 'João Silva',
    date: '2024-01-15T10:30:00Z',
    status: 'COMPLETED',
    psp: 'Banco do Brasil',
  },
  {
    id: '2',
    type: 'DEBIT',
    value: 150.00,
    description: 'Transferência PIX enviada',
    recipient: 'Maria Santos',
    date: '2024-01-14T15:45:00Z',
    status: 'COMPLETED',
    psp: 'Nubank',
  },
  {
    id: '3',
    type: 'CREDIT',
    value: 1200.00,
    description: 'Depósito em conta',
    sender: 'Empresa ABC Ltda',
    date: '2024-01-13T09:15:00Z',
    status: 'COMPLETED',
    psp: 'Itaú',
  },
  {
    id: '4',
    type: 'DEBIT',
    value: 75.50,
    description: 'Transferência PIX enviada',
    recipient: 'Pedro Costa',
    date: '2024-01-12T14:20:00Z',
    status: 'PENDING',
    psp: 'Bradesco',
  },
  {
    id: '5',
    type: 'DEBIT',
    value: 300.00,
    description: 'Transferência PIX enviada',
    recipient: 'Ana Oliveira',
    date: '2024-01-11T11:30:00Z',
    status: 'FAILED',
    psp: 'Santander',
  },
];

export const useTransactions = (initialBalance: number = 2500.75) => {
  console.log('💳 useTransactions - Saldo inicial recebido:', initialBalance);
  const [balance, setBalance] = useState(initialBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  
  // Query para buscar ledger entries (transações) reais
  const ledgerEntriesData = useLedgerEntryQuery();

  const addTransaction = (transferData: TransferData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'DEBIT',
      value: transferData.value,
      description: `Transferência PIX para ${transferData.pixKey}`,
      recipient: transferData.pixKey,
      date: new Date().toISOString(),
      status: 'COMPLETED',
      psp: 'Challanger Bank',
    };

    setBalance(prev => prev - transferData.value);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return {
    balance,
    transactions,
    addTransaction,
    setBalance
  };
};
