import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Wallet, TrendingUp, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

interface BalanceCardProps {
  balance: number;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onRefreshBalance?: () => void;
  isRefreshingBalance?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  isVisible,
  onToggleVisibility,
  onRefreshBalance,
  isRefreshingBalance = false,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getBalanceDisplay = () => {
    if (isVisible) {
      return formatCurrency(balance / 100);
    }
    return '••••••';
  };

  return (
    <Card className="bg-gradient-to-b from-[#0043ff] to-blue-700 text-white dark:from-[#0043ff] dark:to-indigo-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <CardTitle className="text-lg">Saldo Disponível</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {onRefreshBalance && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefreshBalance}
                disabled={isRefreshingBalance}
                className="text-white hover:bg-white/20"
                title="Atualizar saldo"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVisibility}
              className="text-white hover:bg-white/20"
            >
              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
       
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold">{getBalanceDisplay()}</p>
            <p className="text-blue-100 text-sm mt-1">
              {isVisible ? 'Disponível para uso' : 'Clique no olho para visualizar'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-blue-100">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Conta ativa e funcionando</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
