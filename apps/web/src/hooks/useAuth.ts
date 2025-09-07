import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from './useToast';
import { TABLES } from '../config/database';
import { useLoginQuery } from '../components/queries/useLoginQuery';
import { useAccountQuery } from '../components/queries/useAccountQuery';

interface User {
  email: string;
  [key: string]: any;
}

interface Account {
  type: 'PHYSICAL' | 'COMPANY';
  balance: number;
  [key: string]: any;
}

export const useAuth = (shouldRedirect: boolean = true) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  // Carregar dados do localStorage
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
          if (shouldRedirect) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        if (shouldRedirect) {
          router.push('/login');
        }
      } finally {
        setIsDataLoading(false);
      }
    };

    loadAuthData();
  }, [router]);

  const usersData = useLoginQuery();
  const accountsData = useAccountQuery();

  const decodeUserId = (base64Id: string): string => {
    try {
      const decoded = atob(base64Id);
      return decoded.replace('User:', '');
    } catch (error) {
      console.error('Erro ao decodificar ID:', error);
      return base64Id;
    }
  };

  const saveToStorage = (user: any, account: any) => {
    try {
      localStorage.setItem(TABLES.USER, JSON.stringify(user));
      localStorage.setItem(TABLES.ACCOUNT, JSON.stringify(account));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Simular um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      localStorage.removeItem(TABLES.USER);
      localStorage.removeItem(TABLES.ACCOUNT);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const user = usersData.users?.edges?.find(edge => edge?.node?.email === email);
      
      if (!user || user.node?.password !== password) {
        showError('Usuário não encontrado ou senha incorreta');
        return;
      }

      const decodedUserId = decodeUserId(user.node.id);
      const account = (accountsData as any).accounts?.edges?.find((edge: any) => 
        edge?.node?.user === decodedUserId
      );

      if (!account) {
        showError('Conta não encontrada para este usuário');
        return;
      }

      saveToStorage(user.node, account.node);
      showSuccess('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      showError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Login
    login,
    isLoading,
    
    // Dados do usuário
    user,
    account,
    isDataLoading,
    
    // Logout
    logout,
    isLoggingOut
  };
};
