import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Wallet, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';

interface BalanceCardProps {
  balance: number;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  isVisible,
  onToggleVisibility,
}) => {
  console.log('💰 Balance:', balance);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getBalanceDisplay = () => {
    if (isVisible) {
      return formatCurrency(balance);
    }
    return '••••••';
  };

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <CardTitle className="text-lg">Saldo Disponível</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="text-white hover:bg-white/20"
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
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
