import { useState, useMemo } from 'react';
import { ledgerEntryEnum } from '../constants/ledgerEntryEnum';
import { Transaction } from '../components/Auth/TransactionList';
import { TransferData } from '../components/Auth/TransferModal';
import { useLedgerEntryQuery } from '../components/queries/useLedgerEntryQuery';
import { useLoginQuery } from '../components/queries/useLoginQuery';
import { useUser } from './useUser';
import { DEFAULT_PIX_LABEL, DEFAULT_PIX_TRANSFER_DESCRIPTION, LEDGER_STATUS_TO_TRANSACTION_STATUS, PSP_DISPLAY_NAME, UNKNOWN_USER_LABEL } from '../constants/transaction';

// Função para obter nome do usuário (agora vem do GraphQL)
const getUserNameById = (userId: string, usersData: any): string => {
  if (!usersData?.users?.edges) return UNKNOWN_USER_LABEL;
  
  const user = usersData.users.edges.find((edge: any) => {
    // Decodificar o ID do usuário para comparar
    try {
      const decoded = atob(edge.node.id);
      const decodedUserId = decoded.replace('User:', '');
      return decodedUserId === userId;
    } catch {
      return false;
    }
  });
  
  return user?.node?.name || UNKNOWN_USER_LABEL;
};

// Função para transformar ledgerEntries em transações
const transformLedgerEntriesToTransactions = (ledgerEntriesData: any, usersData: any): Transaction[] => {
  if (!ledgerEntriesData?.ledgerEntries?.edges) {
    return [];
  }

  return ledgerEntriesData.ledgerEntries.edges.map((edge: any) => {
    const node = edge.node;
    const ledgerAccount = node.ledgerAccount;
    
    // Determinar o tipo da transação baseado no tipo do ledger (CREDIT/DEBIT)
    const transactionType: 'CREDIT' | 'DEBIT' = (node.type === ledgerEntryEnum.CREDIT) ? ledgerEntryEnum.CREDIT : ledgerEntryEnum.DEBIT;
    
    // Criar descrição baseada no tipo e dados disponíveis
    let description = node.description || DEFAULT_PIX_TRANSFER_DESCRIPTION;
    let sender = '';
    let recipient = '';
    
    // Buscar nome do usuário baseado no account ID
    const accountId = ledgerAccount?.account;
    const userName = accountId ? getUserNameById(accountId, usersData) : UNKNOWN_USER_LABEL;
    
    if (transactionType === 'CREDIT') {
      sender = userName || ledgerAccount?.pixKey || DEFAULT_PIX_LABEL;
    } else {
      recipient = userName || ledgerAccount?.pixKey || DEFAULT_PIX_LABEL;
    }
    
    // Mapear status do ledger para status da transação
    const mapStatus = (ledgerStatus: string): 'COMPLETED' | 'PENDING' | 'FAILED' => {
      const key = (ledgerStatus || '').toUpperCase();
      return LEDGER_STATUS_TO_TRANSACTION_STATUS[key] || 'COMPLETED';
    };
    
    return {
      id: node.id,
      type: transactionType,
      value: Math.abs(node.value),
      description,
      sender: transactionType === 'CREDIT' ? sender : undefined,
      recipient: transactionType === 'DEBIT' ? recipient : undefined,
      date: node.createdAt || new Date().toISOString(),
      status: mapStatus(node.status),
      psp: ledgerAccount?.psp || PSP_DISPLAY_NAME,
    };
  });
};

export const useTransactions = (initialBalance: number = 2500.75) => {
  console.log('💳 useTransactions - Saldo inicial recebido:', initialBalance);
  const [balance, setBalance] = useState(initialBalance);
  
  // Obter dados do usuário para filtrar por conta
  const { account } = useUser();
  
  // Query para buscar dados dos usuários (para obter nomes)
  const usersData = useLoginQuery();
  
  // Query para buscar ledger entries (transações) reais com filtro por conta
  const {
    data: ledgerEntriesData,
    refresh: refreshTransactions,
    isRefreshing: isRefreshingTransactions,
  } = useLedgerEntryQuery({
    filters: account?.id ? { account: account.id } : undefined
  });
  
  // Transformar dados do ledgerEntries em transações
  const realTransactions = useMemo(() => {
    console.log('📊 useTransactions - Dados do ledgerEntries:', ledgerEntriesData);
    const transformed = transformLedgerEntriesToTransactions(ledgerEntriesData, usersData);
    console.log('📊 useTransactions - Transações transformadas:', transformed);
    return transformed;
  }, [ledgerEntriesData, usersData]);
  
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
      status: 'COMPLETED',
      psp: PSP_DISPLAY_NAME,
    };

    setBalance(prev => prev - transferData.value);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Combinar transações reais com transações adicionadas localmente
  const allTransactions = useMemo(() => {
    // Exibir as transações adicionadas localmente primeiro (mais recentes no topo)
    return [...transactions, ...realTransactions];
  }, [realTransactions, transactions]);

  return {
    balance,
    transactions: allTransactions,
    addTransaction,
    setBalance,
    refreshTransactions,
    isRefreshingTransactions,
  };
};
