import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { X, Send, CreditCard } from 'lucide-react';
import { PixIcon } from '../icons';
import { useRelayEnvironment } from 'react-relay';
import { fetchQuery } from 'relay-runtime';
import { AccountQuery } from '../queries/AccountQuery';
import { useUser } from '../../hooks/useUser';

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
  const [valueDisplay, setValueDisplay] = useState<string>('0,00');
  const [formErrors, setFormErrors] = useState<{ value: boolean; pixKey: boolean }>({
    value: false,
    pixKey: false,
  });
  const [pixKeyNotFound, setPixKeyNotFound] = useState<boolean>(false);
  const [isSelfPixKey, setIsSelfPixKey] = useState<boolean>(false);
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [recipientData, setRecipientData] = useState<any | null>(null);
  const [shake, setShake] = useState<{ value: boolean; pixKey: boolean }>({ value: false, pixKey: false });

  const relayEnvironment = useRelayEnvironment();
  const { pixKey: myPixKey } = useUser();

  const pixKeyErrorMessage = useMemo(() => {
    if (!formErrors.pixKey) return '';
    if (isSelfPixKey) {
      return 'Você está tentando transferir para a sua própria conta (chave PIX)';
    }
    if (pixKeyNotFound) {
      return 'A chave PIX informada não está cadastrada em nenhuma instituição de pagamento';
    }
    return 'Chave PIX é obrigatória';
  }, [formErrors.pixKey, isSelfPixKey, pixKeyNotFound]);

  const resetForm = () => {
    setFormData({ value: 0, pixKey: '' });
    setValueDisplay('0,00');
    setFormErrors({ value: false, pixKey: false });
    setRecipientData(null);
    setPixKeyNotFound(false);
    setIsSelfPixKey(false);
    setStep('form');
    setShake({ value: false, pixKey: false });
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValueInvalid = !formData.value || formData.value < 0.01;
    const isPixKeyInvalid = !formData.pixKey || !formData.pixKey.trim();

    setFormErrors({ value: isValueInvalid, pixKey: isPixKeyInvalid });

    if (isValueInvalid || isPixKeyInvalid) {
      setShake({ value: isValueInvalid, pixKey: isPixKeyInvalid });
      setTimeout(() => setShake({ value: false, pixKey: false }), 320);
      return;
    }

    // Bloquear transferência para a própria chave PIX
    if (myPixKey && formData.pixKey.trim() === myPixKey) {
      setIsSelfPixKey(true);
      setPixKeyNotFound(false);
      setFormErrors({ value: false, pixKey: true });
      setShake({ value: false, pixKey: true });
      setTimeout(() => setShake({ value: false, pixKey: false }), 320);
      return;
    }

    // Buscar conta por chave PIX
    try {
      setPixKeyNotFound(false);
      setIsSelfPixKey(false);
      const data: any = await fetchQuery(relayEnvironment, AccountQuery as any, {
        filters: { pixKey: formData.pixKey.trim() },
      }).toPromise();

      const edges = data?.accounts?.edges || [];
      if (!edges.length) {
        setFormErrors({ value: false, pixKey: true });
        setPixKeyNotFound(true);
        setShake({ value: false, pixKey: true });
        setTimeout(() => setShake({ value: false, pixKey: false }), 320);
        return;
      }

      const recipient = edges[0].node;
      setRecipientData(recipient);
      setStep('confirm');
    } catch (error) {
      setFormErrors({ value: false, pixKey: true });
      setPixKeyNotFound(true);
      return;
    }
  };

  const handleInputChange = (field: keyof TransferData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpa erro do campo se voltar a ficar válido
    if (field === 'value' && typeof value === 'number') {
      if (value >= 0.01) {
        setFormErrors(prev => ({ ...prev, value: false }));
        setShake(prev => ({ ...prev, value: false }));
      }
    }
    if (field === 'pixKey' && typeof value === 'string') {
      if (value.trim().length > 0) {
        setFormErrors(prev => ({ ...prev, pixKey: false }));
        setPixKeyNotFound(false);
        setIsSelfPixKey(false);
        setShake(prev => ({ ...prev, pixKey: false }));
      }
    }
  };

  // Tratamento de input monetário (BRL) digitando só números
  const handleMoneyInputChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '');
    const cents = digitsOnly ? parseInt(digitsOnly, 10) : 0;
    const numericValue = cents / 100;
    setFormData(prev => ({ ...prev, value: numericValue }));
    // Formatar para pt-BR sem prefixo R$
    const formatted = numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValueDisplay(formatted);
    if (numericValue >= 0.01) {
      setFormErrors(prev => ({ ...prev, value: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PixIcon />
              {step === 'form' ? 'Nova Transferência' : 'Confirmar transferência PIX'}
            </CardTitle>
          </div>
          {/* <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button> */}
        </CardHeader>
        
        <CardContent className="relative">
          {/* Passo 1: Formulário */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`space-y-4 transition-all duration-300 ease-out ${
              step === 'form'
                ? 'opacity-100 translate-y-0 relative pointer-events-auto'
                : 'opacity-0 -translate-y-2 absolute inset-0 pointer-events-none'
            }`}
          >
              <div>
                <label className="text-sm font-medium mb-2 block">Valor (R$)</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  value={valueDisplay}
                  onChange={(e) => handleMoneyInputChange(e.target.value)}
                  aria-invalid={formErrors.value}
                  className={`${formErrors.value ? 'border-red-500 focus-visible:ring-red-500' : ''} ${shake.value ? 'animate-shake' : ''}`}
                  required
                />
                {formErrors.value && (
                  <p className="mt-1 text-sm text-red-600">O valor do PIX não pode ser menor que R$ 0,01</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Chave PIX</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="CPF, email, telefone ou chave aleatória"
                    value={formData.pixKey}
                    onChange={(e) => handleInputChange('pixKey', e.target.value)}
                    aria-invalid={formErrors.pixKey}
                    className={`pl-10 ${formErrors.pixKey ? 'border-red-500 focus-visible:ring-red-500' : ''} ${shake.pixKey ? 'animate-shake' : ''}`}
                    required
                  />
                  {formErrors.pixKey && (
                    <p className="mt-1 text-sm text-red-600">{pixKeyErrorMessage}</p>
                  )}
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

          {/* Passo 2: Confirmação */}
          <div
            className={`space-y-3 transition-all duration-300 ease-out ${
              step === 'confirm'
                ? 'opacity-100 translate-y-0 relative pointer-events-auto'
                : 'opacity-0 translate-y-2 absolute inset-0 pointer-events-none'
            }`}
          >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Valor</span>
                <span className="text-base font-semibold">R$ {valueDisplay}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nome</span>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[60%] text-right">
                    {recipientData?.user?.name || '---'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">E-mail</span>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[60%] text-right">
                    {(recipientData?.user?.email || '').replace(/(^..).*(@.*$)/, '$1****$2')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tipo de conta</span>
                  <span className="text-sm font-medium text-gray-900">{recipientData?.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Chave PIX</span>
                  <span className="text-sm font-medium text-gray-900">{'****' + (recipientData?.pixKey || '').slice(-4)}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep('form')} className="flex-1">
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onTransfer(formData);
                    onClose();
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Confirmar
                </Button>
              </div>
          </div>
        </CardContent>
      </Card>
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
        .animate-shake { animation: shake 0.28s ease-in-out; will-change: transform; }
      `}</style>
    </div>
    
  );
};
