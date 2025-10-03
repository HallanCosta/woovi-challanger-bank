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
import { useCreatePixTransactionMutation } from '../mutations';
import { v4 as uuidv4 } from 'uuid';
import { maskEmail, formatCurrencyInput } from '../../lib/utils';
import { MESSAGES } from '../../constants/messages';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (transferData: TransferData) => void;
  initialPixKey?: string;
}

export interface TransferData {
  value: number;
  pixKey: string;
  recipientName?: string;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  initialPixKey,
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
  const { pixKey: myPixKey, account, accountType } = useUser();
  const { createPixTransaction, isInFlight } = useCreatePixTransactionMutation();

  const pixKeyErrorMessage = useMemo(() => {
    if (!formErrors.pixKey) return '';
    if (isSelfPixKey) {
      return MESSAGES.VALIDATION_PIX_KEY_SELF_TRANSFER;
    }
    if (pixKeyNotFound) {
      return MESSAGES.VALIDATION_PIX_KEY_NOT_REGISTERED;
    }
    return MESSAGES.VALIDATION_PIX_KEY_INVALID;
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

  useEffect(() => {
    if (!isOpen) return;
    if (initialPixKey && initialPixKey.trim()) {
      setFormData(prev => ({ ...prev, pixKey: initialPixKey.trim() }));
      setFormErrors(prev => ({ ...prev, pixKey: false }));
      setPixKeyNotFound(false);
      setIsSelfPixKey(false);
    }
  }, [initialPixKey, isOpen]);

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

    if (myPixKey && formData.pixKey.trim() === myPixKey) {
      setIsSelfPixKey(true);
      setPixKeyNotFound(false);
      setFormErrors({ value: false, pixKey: true });
      setShake({ value: false, pixKey: true });
      setTimeout(() => setShake({ value: false, pixKey: false }), 320);
      return;
    }

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

  const handleCreatePixTransaction = () => {
    const cents = Math.round(formData.value * 100);
    const idempotencyKey = `pix:${uuidv4()}`;

    createPixTransaction(
      {
        value: cents,
        status: 'CREATED',
        description: MESSAGES.DESCRIPTION_TRANSFER(recipientData?.user?.name || ''),
        idempotencyKey,
        debitParty: {
          account: account?.id,
          psp: 'Bank Challanger LTDA',
          type: account?.type,
          pixKey: myPixKey,
          name: account?.user?.name,
        } as any,
        creditParty: {
          account: recipientData?.id,
          psp: 'Bank Challanger LTDA',
          type: recipientData?.type,
          pixKey: recipientData?.pixKey,
          name: recipientData?.user?.name,
        } as any,
      },
      {
        onCompleted: () => {
          onTransfer({
            ...formData,
            recipientName: recipientData?.user?.name,
          });
          onClose();
          resetForm();
        },
        onError: () => {
          setFormErrors({ value: false, pixKey: true });
        },
      }
    );
  };

  const handleMoneyInputChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '');
    const cents = digitsOnly ? parseInt(digitsOnly, 10) : 0;
    const numericValue = cents / 100;
    const formatted = formatCurrencyInput(numericValue);

    setFormData(prev => ({ ...prev, value: numericValue }));

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
              {step === 'form' ? MESSAGES.TITLE_NEW_TRANSFER : MESSAGES.TITLE_CONFIRM_TRANSFER}
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
                <label className="text-sm font-medium mb-2 block">{MESSAGES.LABEL_VALUE}</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder={MESSAGES.PLACEHOLDER_VALUE}
                  value={valueDisplay}
                  onChange={(e) => handleMoneyInputChange(e.target.value)}
                  aria-invalid={formErrors.value}
                  className={`${formErrors.value ? 'border-red-500 focus-visible:ring-red-500' : ''} ${shake.value ? 'animate-shake' : ''}`}
                  required
                />
                {formErrors.value && (
                  <p className="mt-1 text-sm text-red-600">{MESSAGES.VALIDATION_VALUE_TOO_LOW}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{MESSAGES.LABEL_PIX_KEY}</label>
                <div className="relative">
                  {/* <CreditCard className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /> */}
                  <Input
                    placeholder={MESSAGES.PLACEHOLDER_PIX_KEY}
                    value={formData.pixKey}
                    onChange={(e) => handleInputChange('pixKey', e.target.value)}
                    aria-invalid={formErrors.pixKey}
                    className={`${formErrors.pixKey ? 'border-red-500 focus-visible:ring-red-500' : ''} ${shake.pixKey ? 'animate-shake' : ''}`}
                    required
                  />
                  {formErrors.pixKey && (
                    <p className="mt-1 text-sm text-red-600">{pixKeyErrorMessage}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  {MESSAGES.BUTTON_CANCEL}
                </Button>
                <Button type="submit" className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  {MESSAGES.BUTTON_TRANSFER}
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
                <span className="text-sm text-muted-foreground">Valor</span>
                <span className="text-base font-semibold">R$ {valueDisplay}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nome</span>
                  <span className="text-sm font-medium text-foreground truncate max-w-[60%] text-right">
                    {recipientData?.user?.name || '---'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">E-mail</span>
                  <span className="text-sm font-medium text-foreground truncate max-w-[60%] text-right">
                    {maskEmail(recipientData?.user?.email)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo de conta</span>
                  <span className="text-sm font-medium text-foreground">{recipientData?.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Chave PIX</span>
                  <span className="text-sm font-medium text-foreground">{recipientData?.pixKey}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep('form')} className="flex-1">
                  {MESSAGES.BUTTON_BACK}
                </Button>
                <Button
                  type="button"
                  disabled={isInFlight}
                  onClick={handleCreatePixTransaction}
                  className="flex-1"
                >
                  {isInFlight ? MESSAGES.LOADING_SENDING : MESSAGES.BUTTON_CONFIRM}
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
