import { useState, useMemo } from 'react';
import { ledgerEntryEnum } from '../constants/ledgerEntryEnum';
import { LedgerEntryNode } from '../components/Auth/TransactionList';
import { TransferData } from '../components/Auth/TransferModal';
import { useLedgerEntryQuery } from '../components/queries/useLedgerEntryQuery';
import { useUser } from './useUser';
import { PSP_DISPLAY_NAME } from '../constants/transaction';

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
      setLocalTransactions([]);
    }
  });
  
  const ledgerTransactions = useMemo(() => {
    if (!ledgerEntriesData?.ledgerEntries?.edges) {
      return [];
    }
    return ledgerEntriesData.ledgerEntries.edges.map((edge: any) => edge.node);
  }, [ledgerEntriesData]);
  
  const [localTransactions, setLocalTransactions] = useState<LedgerEntryNode[]>([]);

  const addTransaction = (transferData: TransferData) => {
    const displayName = transferData.recipientName || transferData.pixKey;
    const newTransaction: LedgerEntryNode = {
      id: Date.now().toString(),
      type: ledgerEntryEnum.DEBIT,
      value: transferData.value * 100, // Converter para centavos
      description: `Transferência PIX para ${displayName}`,
      createdAt: new Date().toISOString(),
      ledgerAccount: {
        name: displayName,
        psp: PSP_DISPLAY_NAME,
      },
    };

    setBalance(prev => prev - transferData.value);
    setLocalTransactions(prev => [newTransaction, ...prev]);
  };

  const allTransactions = useMemo(() => {
    return [...localTransactions, ...ledgerTransactions];
  }, [ledgerTransactions, localTransactions]);

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
