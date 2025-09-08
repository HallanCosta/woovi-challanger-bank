import { useState, useEffect } from 'react';
import { TABLES } from '../config/database';
import { useAccountQuery } from '../components/queries/useAccountQuery';

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
  user: string;
  type: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Buscar dados da conta sempre do GraphQL
  const accountsData = useAccountQuery();

  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem(TABLES.USER);
        console.log('savedUser', savedUser);
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
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

  // Buscar conta do usuário logado do GraphQL
  const getCurrentAccount = (): Account | null => {
    if (!user?.id || !accountsData?.accounts?.edges) return null;
    
    const decodedUserId = decodeUserId(user.id);
    const userAccount = accountsData.accounts.edges.find(edge => {
      const account = edge.node;
      return account.user === decodedUserId;
    });
    
    return userAccount?.node || null;
  };

  const getUserName = (): string => {
    if (!user?.email) return 'Usuário';
    
    // Usar o nome que vem do GraphQL
    if (user.name) {
      return user.name;
    }
    
    // Fallback: extrair nome do email (parte antes do @)
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
    account: getCurrentAccount(), // Sempre buscar do GraphQL
    isLoading,
    userName: getUserName(),
    userEmail: user?.email || '',
    accountBalance: getAccountBalance(),
    accountType: getAccountType(),
    pixKey: getPixKey(),
    decodeUserId
  };
};
