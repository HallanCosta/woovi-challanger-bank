import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TABLES } from '../config/database';

interface User {
  email: string;
  [key: string]: any;
}

interface Account {
  type: 'PHYSICAL' | 'COMPANY';
  balance: number;
  [key: string]: any;
}

export const useAuthData = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = () => {
      try {
        const savedUser = localStorage.getItem(TABLES.USER);
        const savedAccount = localStorage.getItem(TABLES.ACCOUNT);
        
        if (savedUser && savedAccount) {
          const userData = JSON.parse(savedUser);
          const accountData = JSON.parse(savedAccount);
          
          setUser(userData);
          setAccount(accountData);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, [router]);

  const logout = () => {
    localStorage.removeItem(TABLES.USER);
    localStorage.removeItem(TABLES.ACCOUNT);
    router.push('/login');
  };

  return {
    user,
    account,
    isLoading,
    logout
  };
};
