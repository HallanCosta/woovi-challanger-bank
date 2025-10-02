import { useState, useMemo } from 'react';
import { ledgerEntryEnum } from '../constants/ledgerEntryEnum';
import { Transaction } from '../components/Auth/TransactionList';
import { TransferData } from '../components/Auth/TransferModal';
import { useLedgerEntryQuery } from '../components/queries/useLedgerEntryQuery';
import { useUser } from './useUser';
import { LEDGER_STATUS_TO_TRANSACTION_STATUS, PSP_DISPLAY_NAME } from '../constants/transaction';
import { TransactionStatus } from '../constants/transactionStatus';

const transformLedgerEntriesToTransactions = (ledgerEntriesData: any): Transaction[] => {
  if (!ledgerEntriesData?.ledgerEntries?.edges) {
    return [];
  }

  return ledgerEntriesData.ledgerEntries.edges.map((edge: any) => {
    const node = edge.node;
    const ledgerAccount = node.ledgerAccount;

    const transactionType = node.type === ledgerEntryEnum.CREDIT ? ledgerEntryEnum.CREDIT : ledgerEntryEnum.DEBIT;
    
    const description = node.description;
    
    const sender = transactionType === ledgerEntryEnum.CREDIT ? ledgerAccount?.name : undefined;
    const recipient = transactionType === ledgerEntryEnum.DEBIT ? ledgerAccount?.name : undefined;
    
    return {
      id: node.id,
      type: transactionType,
      value: Math.abs(node.value) / 100,
      description,
      sender,
      recipient,
      date: node.createdAt,
      status: LEDGER_STATUS_TO_TRANSACTION_STATUS[node.status],
      psp: ledgerAccount?.psp,
    };
  });
};

export const useTransactions = (initialBalance: number = 2500.75) => {
  const [balance, setBalance] = useState(initialBalance);
  
  const { account } = useUser();
  
  const {
    data: ledgerEntriesData,
    refresh: refreshTransactions,
    isRefreshing: isRefreshingTransactions,
    loadMore,
    hasNext,
    isLoadingNext,
  } = useLedgerEntryQuery({
    filters: account?.id ? { account: account.id } : undefined,
    onRefresh: () => {
      // Limpar transações locais quando fizer refresh
      setTransactions([]);
    }
  });
  
  const realTransactions = useMemo(() => {
    const transformed = transformLedgerEntriesToTransactions(ledgerEntriesData);
    return transformed;
  }, [ledgerEntriesData]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transferData: TransferData) => {
    const displayName = transferData.recipientName || transferData.pixKey;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: ledgerEntryEnum.DEBIT,
      value: transferData.value,
      description: `Transferência PIX para ${displayName}`,
      recipient: displayName,
      date: new Date().toISOString(),
      status: TransactionStatus.COMPLETED,
      psp: PSP_DISPLAY_NAME,
    };

    setBalance(prev => prev - transferData.value);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const allTransactions = useMemo(() => {
    return [...transactions, ...realTransactions];
  }, [realTransactions, transactions]);

  return {
    balance,
    transactions: allTransactions,
    addTransaction,
    setBalance,
    refreshTransactions,
    isRefreshingTransactions,
    loadMore,
    hasNext,
    isLoadingNext,
  };
};
