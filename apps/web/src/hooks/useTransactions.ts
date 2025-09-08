import { useState, useMemo } from 'react';
import { Transaction } from '../components/Auth/TransactionList';
import { TransferData } from '../components/Auth/TransferModal';
import { useLedgerEntryQuery } from '../components/queries/useLedgerEntryQuery';
import { useLoginQuery } from '../components/queries/useLoginQuery';
import { useUser } from './useUser';

// Função para obter nome do usuário (agora vem do GraphQL)
const getUserNameById = (userId: string, usersData: any): string => {
  if (!usersData?.users?.edges) return 'Usuário Desconhecido';
  
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
  
  return user?.node?.name || 'Usuário Desconhecido';
};

// Função para transformar ledgerEntries em transações
const transformLedgerEntriesToTransactions = (ledgerEntriesData: any, usersData: any): Transaction[] => {
  if (!ledgerEntriesData?.ledgerEntries?.edges) {
    return [];
  }

  return ledgerEntriesData.ledgerEntries.edges.map((edge: any) => {
    const node = edge.node;
    const ledgerAccount = node.ledgerAccount;
    
    // Determinar o tipo da transação baseado no valor e tipo do ledger
    const isCredit = node.value > 0;
    const transactionType: 'CREDIT' | 'DEBIT' = isCredit ? 'CREDIT' : 'DEBIT';
    
    // Criar descrição baseada no tipo e dados disponíveis
    let description = node.description || 'Transação PIX';
    let sender = '';
    let recipient = '';
    
    // Buscar nome do usuário baseado no account ID
    const accountId = ledgerAccount?.account;
    const userName = accountId ? getUserNameById(accountId, usersData) : 'Usuário Desconhecido';
    
    if (isCredit) {
      sender = userName || ledgerAccount?.pixKey || 'Transferência PIX';
    } else {
      recipient = userName || ledgerAccount?.pixKey || 'Transferência PIX';
    }
    
    // Mapear status do ledger para status da transação
    const mapStatus = (ledgerStatus: string): 'COMPLETED' | 'PENDING' | 'FAILED' => {
      switch (ledgerStatus?.toUpperCase()) {
        case 'COMPLETED':
        case 'SUCCESS':
          return 'COMPLETED';
        case 'PENDING':
        case 'PROCESSING':
          return 'PENDING';
        case 'FAILED':
        case 'ERROR':
          return 'FAILED';
        default:
          return 'COMPLETED'; // Default para transações antigas
      }
    };
    
    return {
      id: node.id,
      type: transactionType,
      value: Math.abs(node.value),
      description,
      sender: isCredit ? sender : undefined,
      recipient: !isCredit ? recipient : undefined,
      date: node.createdAt || new Date().toISOString(),
      status: mapStatus(node.status),
      psp: ledgerAccount?.psp || 'Challanger Bank',
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
  const ledgerEntriesData = useLedgerEntryQuery({
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

  // Combinar transações reais com transações adicionadas localmente
  const allTransactions = useMemo(() => {
    return [...realTransactions, ...transactions];
  }, [realTransactions, transactions]);

  return {
    balance,
    transactions: allTransactions,
    addTransaction,
    setBalance
  };
};
