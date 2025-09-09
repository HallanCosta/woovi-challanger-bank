import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

type RecipientInfo = {
  id: string;
  pixKey: string;
  user: {
    name: string;
    email: string;
  };
  type: string;
};

interface ConfirmPixRecipientModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  valueDisplay: string;
  recipient: RecipientInfo | null;
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}****@${domain}`;
}

function maskPixKey(pixKey: string): string {
  if (!pixKey) return '';
  if (pixKey.length <= 4) return '****';
  const last = pixKey.slice(-4);
  return `****${last}`;
}

export const ConfirmPixRecipientModal: React.FC<ConfirmPixRecipientModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  valueDisplay,
  recipient,
}) => {
  if (!isOpen || !recipient) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Confirmar transferência PIX</CardTitle>
            <CardDescription>Revise os dados do destinatário</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Valor</span>
              <span className="text-base font-semibold">R$ {valueDisplay}</span>
            </div>

            <div className="h-px bg-gray-200" />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nome</span>
                <span className="text-sm font-medium text-gray-900 truncate max-w-[60%] text-right">
                  {recipient.user?.name || '---'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">E-mail</span>
                <span className="text-sm font-medium text-gray-900 truncate max-w-[60%] text-right">
                  {maskEmail(recipient.user?.email || '')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tipo de conta</span>
                <span className="text-sm font-medium text-gray-900">{recipient.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Chave PIX</span>
                <span className="text-sm font-medium text-gray-900">{maskPixKey(recipient.pixKey)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
              <Button type="button" onClick={onConfirm} className="flex-1">Confirmar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


