import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/useToast';
import { X, Send, CreditCard } from 'lucide-react';
import { PixIcon } from '../icons';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (transferData: TransferData) => void;
}

export interface TransferData {
  value: number;
  pixKey: string;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
}) => {
  const [formData, setFormData] = useState<TransferData>({
    value: 0,
    pixKey: '',
  });
  const { showSuccess, showError } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.value || formData.value <= 0) {
      showError('Valor deve ser maior que zero');
      return;
    }
    
    if (!formData.pixKey) {
      showError('Chave PIX é obrigatória');
      return;
    }

    onTransfer(formData);
    showSuccess('Transferência realizada com sucesso!');
    onClose();
    
    // Reset form
    setFormData({
      value: 0,
      pixKey: '',
    });
  };

  const handleInputChange = (field: keyof TransferData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PixIcon />
              Nova Transferência
            </CardTitle>
            <CardDescription>
              Faça uma transferência PIX
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Valor (R$)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.value || ''}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Chave PIX</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="CPF, email, telefone ou chave aleatória"
                  value={formData.pixKey}
                  onChange={(e) => handleInputChange('pixKey', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Transferir
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
