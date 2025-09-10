import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Send, History } from 'lucide-react';
import { PixIcon } from '../icons/PixIcon';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  isTransferModalOpen: boolean;
  isTransactionListVisible: boolean;
  onOpenTransferModal: () => void;
  onToggleTransactionList: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  isTransferModalOpen,
  isTransactionListVisible,
  onOpenTransferModal,
  onToggleTransactionList
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Ações Rápidas
        </CardTitle>
        <CardDescription>
          Operações mais utilizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant={isTransferModalOpen ? "default" : "outline"}
            onClick={onOpenTransferModal}
            className={cn(
              "h-20 flex flex-col items-center justify-center gap-2",
              isTransferModalOpen &&
                "bg-gradient-to-b from-[#0043ff] to-blue-700 dark:from-[#0043ff] dark:to-indigo-800 text-white hover:opacity-95"
            )}
          >
            <PixIcon className="w-6 h-6" />
            <span>Transferir PIX</span>
          </Button>
          
          <Button
            variant={isTransactionListVisible ? "default" : "outline"}
            onClick={onToggleTransactionList}
            className={cn(
              "h-20 flex flex-col items-center justify-center gap-2",
              isTransactionListVisible &&
                "bg-gradient-to-b from-[#0043ff] to-blue-700 dark:from-[#0043ff] dark:to-indigo-800 text-white hover:opacity-95"
            )}
          >
            <History className="w-6 h-6" />
            <span>{isTransactionListVisible ? "Ocultar Histórico" : "Ver Histórico"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
