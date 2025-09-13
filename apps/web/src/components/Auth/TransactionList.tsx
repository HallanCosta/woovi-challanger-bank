import React from 'react';
import { ledgerEntryEnum } from '../../constants/ledgerEntryEnum';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, ReceiptText, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { TRANSACTION_STATUS_LABELS } from '../../constants/transaction';

export interface Transaction {
  id: string;
  type: ledgerEntryEnum;
  value: number;
  description: string;
  recipient?: string;
  sender?: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  psp?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onRefresh, isRefreshing }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: Transaction['status']) => TRANSACTION_STATUS_LABELS[status];

  const getTypeIcon = (type: Transaction['type']) => {
    return type === ledgerEntryEnum.CREDIT ? (
      <ArrowDownLeft className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-500" />
    );
  };

  const getTypeColor = (type: Transaction['type']) => {
    return type === ledgerEntryEnum.CREDIT ? 'text-green-600' : 'text-red-600';
  };

  if (transactions.length === 0) {
    return (
      <Card>
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
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full">
                  {getTypeIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.type === ledgerEntryEnum.CREDIT 
                      ? `De: ${transaction.sender || 'Transferência PIX'}`
                      : `Para: ${transaction.recipient || 'Transferência PIX'}`
                    }
                  </p>
                  {transaction.psp && (
                    <p className="text-xs text-muted-foreground">
                      Banco: {transaction.psp}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${getTypeColor(transaction.type)}`}>
                  {transaction.type === ledgerEntryEnum.CREDIT ? '+' : '-'}{formatCurrency(transaction.value)}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  {getStatusIcon(transaction.status)}
                  <span className="text-xs text-muted-foreground">
                    {getStatusText(transaction.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
