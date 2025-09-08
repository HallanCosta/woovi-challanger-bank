import { useState, useEffect } from 'react';
import { TABLES } from '../config/database';

interface User {
  id: string;
  email: string;
  password?: string;
}

interface Account {
  id: string;
  balance: string;
  pixKey?: string;
  user: string;
  type: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem(TABLES.USER);
        const savedAccount = localStorage.getItem(TABLES.ACCOUNT);
        console.log('savedUser', savedUser);
        console.log('savedAccount', savedAccount);
        
        if (savedUser && savedAccount) {
          const userData = JSON.parse(savedUser);
          const accountData = JSON.parse(savedAccount);
          
          setUser(userData);
          setAccount(accountData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const decodeUserId = (base64Id: string): string => {
    try {
      const decoded = atob(base64Id);
      return decoded.replace('User:', '');
    } catch (error) {
      console.error('Erro ao decodificar ID:', error);
      return base64Id;
    }
  };

  const getUserName = (): string => {
    if (!user?.email) return 'Usuário';
    
    // Extrair nome do email (parte antes do @)
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  const getAccountBalance = (): number => {
    console.log('account', account);
    if (!account?.balance) return 0;
    return parseFloat(account.balance) || 0;
  };

  const getAccountType = (): 'PHYSICAL' | 'COMPANY' => {
    if (!account?.type) return 'PHYSICAL';
    return account.type === 'COMPANY' ? 'COMPANY' : 'PHYSICAL';
  };

  const getPixKey = (): string => {
    if (!account?.pixKey) return '';
    return account.pixKey;
  };

  return {
    user,
    account,
    isLoading,
    userName: getUserName(),
    userEmail: user?.email || '',
    accountBalance: getAccountBalance(),
    accountType: getAccountType(),
    pixKey: getPixKey(),
    decodeUserId
  };
};
