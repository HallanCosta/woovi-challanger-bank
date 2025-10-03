import { useState, useEffect } from 'react';
import { TABLES } from '../config/database';
import { useAccountQuery } from '../components/queries/useAccountQuery';
import { MESSAGES } from '../constants/messages';

interface User {
  id: string;
  email: string;
  password?: string;
  name?: string;
}

interface Account {
  id: string;
  balance: string;
  pixKey?: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
  type: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const accountsData = useAccountQuery();

  useEffect(() => {
    const loadUserData = () => {
      const savedUser = localStorage.getItem(TABLES.USER);
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }

      setIsLoading(false);
    };

    loadUserData();
  }, []);

  const decodeUserId = (base64Id: string): string => {
    try {
      const decoded = atob(base64Id);
      return decoded.replace('User:', '');
    } catch (error) {
      console.error(MESSAGES.ERROR_UNKNOWN, error);
      return base64Id;
    }
  };

  const getCurrentAccount = (): Account | null => {
    if (!user?.id || !accountsData?.accounts?.edges) return null;
    
    const userAccount = accountsData.accounts.edges.find(edge => {
      const account = edge.node;
      return account.user.id === user.id;
    });
    
    return userAccount?.node || null;
  };

  const getUserName = (): string => {
    if (!user?.email) return 'Usuário';
    
    if (user.name) {
      return user.name;
    }
    
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  const getAccountBalance = (): number => {
    const account = getCurrentAccount();
    if (!account?.balance) return 0;
    return parseFloat(account.balance) || 0;
  };

  const getAccountType = (): 'PHYSICAL' | 'COMPANY' => {
    const account = getCurrentAccount();
    if (!account?.type) return 'PHYSICAL';
    return account.type === 'COMPANY' ? 'COMPANY' : 'PHYSICAL';
  };

  const getPixKey = (): string => {
    const account = getCurrentAccount();
    if (!account?.pixKey) return '';
    return account.pixKey;
  };

  return {
    user,
    account: getCurrentAccount(), 
    isLoading,
    userName: getUserName(),
    userEmail: user?.email || '',
    accountBalance: getAccountBalance(),
    accountType: getAccountType(),
    pixKey: getPixKey(),
    decodeUserId
  };
};
