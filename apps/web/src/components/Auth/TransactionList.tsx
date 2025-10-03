import React, { useEffect, useRef, useCallback, memo } from 'react';
import { ledgerEntryEnum } from '../../constants/ledgerEntryEnum';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, ReceiptText, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { TRANSACTION_STATUS_LABELS } from '../../constants/transaction';
import { TransactionStatus } from '../../constants/transactionStatus';
import { formatCurrency, formatDate } from '../../lib/utils';

// Interface única para transações (baseada no ledger entry)
export interface LedgerEntryNode {
  id: string;
  value: number;
  type: ledgerEntryEnum;
  description: string;
  createdAt: string;
  ledgerAccount?: {
    psp?: string;
    account?: string;
    type?: string;
    pixKey?: string;
    name?: string;
  };
  pixTransaction?: any;
}

interface TransactionListProps {
  transactions: LedgerEntryNode[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onLoadMore?: () => void;
  hasNext?: boolean;
  isLoadingNext?: boolean;
}

const TransactionListComponent: React.FC<TransactionListProps> = ({ 
  transactions, 
  onRefresh, 
  isRefreshing,
  onLoadMore,
  hasNext,
  isLoadingNext
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Configurar Intersection Observer para detectar quando o usuário chega ao final da lista
  useEffect(() => {
    if (!onLoadMore || !hasNext) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingNext) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onLoadMore, hasNext, isLoadingNext]);

  const handleLoadMore = useCallback(() => {
    if (onLoadMore && hasNext && !isLoadingNext) {
      onLoadMore();
    }
  }, [onLoadMore, hasNext, isLoadingNext]);

  // Funções auxiliares para trabalhar com LedgerEntryNode
  const getTransactionValue = (item: LedgerEntryNode) => {
    return Math.abs(item.value) / 100; // Converter de centavos para reais
  };

  const getTransactionPerson = (item: LedgerEntryNode) => {
    if (item.type === ledgerEntryEnum.CREDIT) {
      return `De: ${item.ledgerAccount?.name}`;
    }

    if (item.type === ledgerEntryEnum.DEBIT) {
      return `Para: ${item.ledgerAccount?.name}`;
    }
  };

  const getTypeIcon = (type: ledgerEntryEnum) => {
    return type === ledgerEntryEnum.CREDIT ? (
      <ArrowDownLeft className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-500" />
    );
  };

  const getTypeColor = (type: ledgerEntryEnum) => {
    return type === ledgerEntryEnum.CREDIT ? 'text-green-600' : 'text-red-600';
  };

  const TransactionListCardHeader = () => {
    return (
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Transações</CardTitle>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Atualizar extrato"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
        <CardDescription>Histórico de suas transações</CardDescription>
      </CardHeader>
    );
  };

  if (isRefreshing) {
    return (
      <Card>
        <TransactionListCardHeader />
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Buscando novas transações...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ); 
  } 

  if (!isRefreshing && transactions.length === 0) {
    return (
      <Card>
        <TransactionListCardHeader />
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No momento não tem histórico de transações</p>
            <p className="text-sm">Suas transações aparecerão aqui quando realizadas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-white" />
            <CardTitle className="flex items-center gap-2">
              Transações
            </CardTitle>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Atualizar extrato"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
        <CardDescription>Histórico de suas transações</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const value = getTransactionValue(transaction);
            
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Transferência PIX</p>
                    <p className="text-xs text-muted-foreground">
                      {getTransactionPerson(transaction)}
                    </p>
                    {transaction.ledgerAccount?.psp && (
                      <p className="text-xs text-muted-foreground">
                        Banco: {transaction.ledgerAccount.psp}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === ledgerEntryEnum.CREDIT ? '+' : '-'}{formatCurrency(value)}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {/* Status pode ser adicionado futuramente se necessário */}
                  </div>
                </div>
              </div>
            );
          })}
          
          {hasNext && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              {isLoadingNext ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Carregando mais transações...</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  className="text-sm"
                >
                  Carregar mais transações
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const TransactionList = memo(
  TransactionListComponent,
  (prev, next) =>
    prev.isRefreshing === next.isRefreshing &&
    prev.isLoadingNext === next.isLoadingNext &&
    prev.hasNext === next.hasNext &&
    prev.transactions === next.transactions // só compara referência
);

