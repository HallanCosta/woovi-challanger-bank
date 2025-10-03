import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Heart, User2, Mail } from 'lucide-react';
import { useRelayEnvironment } from 'react-relay';
import { fetchQuery } from 'relay-runtime';
import { AccountQuery } from '../queries/AccountQuery';
import { useUser } from '../../hooks/useUser';
import { maskEmail } from '../../lib/utils';
import { MESSAGES } from '../../constants/messages';

interface AddFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (favorite: { pixKey: string; userName: string; userEmail?: string; accountType?: string; accountId?: string; nickname?: string }) => boolean;
  initialPixKey?: string;
}

export const AddFavoriteModal: React.FC<AddFavoriteModalProps> = ({ isOpen, onClose, onAdd, initialPixKey }) => {
  const [pixKey, setPixKey] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ pixKey: boolean }>({ pixKey: false });
  const [shake, setShake] = useState<{ pixKey: boolean }>({ pixKey: false });
  const [lastSearchedPixKey, setLastSearchedPixKey] = useState<string | null>(null);

  const relayEnvironment = useRelayEnvironment();
  const { pixKey: myPixKey } = useUser();

  const resetRecipientFields = useCallback(() => {
    setName('');
    setNickname('');
    setEmail('');
    setAccountType('');
    setAccountId('');
  }, []);

  const resetFormState = useCallback(() => {
    setPixKey('');
    resetRecipientFields();
    setError('');
    setFormErrors({ pixKey: false });
    setShake({ pixKey: false });
    setLastSearchedPixKey(null);
  }, [resetRecipientFields]);

  const setPixFieldError = useCallback((message: string, shouldShake: boolean = true) => {
    setFormErrors({ pixKey: true });
    setError(message);
    if (shouldShake) {
      setShake({ pixKey: true });
      setTimeout(() => setShake({ pixKey: false }), 320);
    }
  }, []);

  const fetchRecipientByPixKey = useCallback(async (key: string) => {
    const data: any = await fetchQuery(relayEnvironment, AccountQuery as any, {
      filters: { pixKey: key },
    }).toPromise();
    return data?.accounts?.edges?.[0]?.node || null;
  }, [relayEnvironment]);

  useEffect(() => {
    if (!isOpen) {
      resetFormState();
      return;
    }
    if (initialPixKey) setPixKey(initialPixKey);
  }, [isOpen, initialPixKey, resetFormState]);

  const isValid = useMemo(() => {
    // Só habilita se a última busca bem-sucedida for da MESMA chave digitada e tivermos accountId
    const key = pixKey.trim();
    return key.length > 0 && accountId.trim().length > 0 && lastSearchedPixKey === key && !error;
  }, [pixKey, accountId, lastSearchedPixKey, error]);

  const searchRecipient = async () => {
    const key = pixKey.trim();
    
    if (!key) {
      setPixFieldError(MESSAGES.VALIDATION_PIX_KEY_REQUIRED);
      return;
    }

    setError('');
    
    if (myPixKey && key === myPixKey) {
      setPixFieldError(MESSAGES.VALIDATION_PIX_KEY_SELF_FAVORITE, false);
      return;
    }
    
    setIsSearching(true);

    try {
      const node = await fetchRecipientByPixKey(key);
      if (!node) {
        setPixFieldError(MESSAGES.VALIDATION_PIX_KEY_NOT_FOUND);
        resetRecipientFields();
        setLastSearchedPixKey(null);
        return;
      }
      setName(node.user?.name);
      setNickname(node.user?.name);
      setEmail(node.user?.email);
      setAccountType(node.type);
      setAccountId(node.id);
      setFormErrors({ pixKey: false });
      setShake({ pixKey: false });
      setLastSearchedPixKey(key);
    } catch (e) {
      setPixFieldError(MESSAGES.ERROR_RECIPIENT_SEARCH, false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = async () => {
    const key = pixKey.trim();
    if (!key) {
      setPixFieldError(MESSAGES.VALIDATION_PIX_KEY_REQUIRED);
      return;
    }
    if (myPixKey && key === myPixKey) {
      setPixFieldError(MESSAGES.VALIDATION_PIX_KEY_SELF_FAVORITE, false);
      return;
    }
    try {
      const node = await fetchRecipientByPixKey(key);
      if (!node) {
        setPixFieldError(MESSAGES.VALIDATION_PIX_KEY_NOT_FOUND);
        resetRecipientFields();
        setLastSearchedPixKey(null);
        return;
      }
      const added = onAdd({
        pixKey: key,
        userName: (node.user?.name || '').trim(),
        userEmail: (node.user?.email || '').trim() || undefined,
        accountType: node.type || '',
        accountId: node.id || '',
        nickname: nickname.trim() || undefined,
      });
      if (!added) {
        setPixFieldError(MESSAGES.VALIDATION_PIX_KEY_ALREADY_SAVED, false);
        return;
      }
      resetFormState();
      onClose();
    } catch (e) {
      setPixFieldError(MESSAGES.ERROR_PIX_VALIDATION, false);
    }
  };

  const handleCancel = () => {
    resetFormState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              {MESSAGES.TITLE_NEW_FAVORITE}
            </CardTitle>
            <CardDescription className="mt-2">{MESSAGES.DESCRIPTION_SAVE_FAVORITE}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{MESSAGES.LABEL_PIX_KEY}</label>
            <Input
              placeholder={MESSAGES.PLACEHOLDER_PIX_KEY}
              value={pixKey}
              onChange={(e) => {
                setPixKey(e.target.value);
                setError('');
                setFormErrors({ pixKey: false });
                setShake({ pixKey: false });
                resetRecipientFields();
                setLastSearchedPixKey(null);
              }}
              aria-invalid={formErrors.pixKey}
              className={`${formErrors.pixKey ? 'border-red-500 focus-visible:ring-red-500' : ''} ${shake.pixKey ? 'animate-ui-shake' : ''}`}
            />
            {(formErrors.pixKey || error) && (
              <p className="mt-1 text-sm text-red-600">{error || MESSAGES.VALIDATION_PIX_KEY_REQUIRED}</p>
            )}
            <div className="flex gap-2 mt-2">
              <Button type="button" variant="outline" onClick={searchRecipient} disabled={isSearching}>{MESSAGES.BUTTON_SEARCH}</Button>

              <Button type="button" variant="ghost" onClick={() => { resetFormState(); }}>{MESSAGES.BUTTON_CLEAR}</Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{MESSAGES.LABEL_RECIPIENT_NAME}</label>
            <div className="relative">
              <User2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" placeholder={MESSAGES.PLACEHOLDER_RECIPIENT_NAME} value={name} disabled readOnly />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{MESSAGES.LABEL_EMAIL}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" placeholder={MESSAGES.PLACEHOLDER_EMAIL} value={maskEmail(email)} disabled readOnly />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{MESSAGES.LABEL_NICKNAME}</label>
            <Input placeholder={MESSAGES.PLACEHOLDER_NICKNAME} value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>

          {/* Erros de PIX aparecem abaixo do campo de chave PIX */}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>{MESSAGES.BUTTON_CANCEL}</Button>
            <Button type="button" className={`flex-1 bg-gradient-to-b from-rose-500 to-pink-600 text-white hover:opacity-95 ${!isValid ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={handleAdd} disabled={!isValid}>{MESSAGES.BUTTON_SAVE}</Button>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
};


