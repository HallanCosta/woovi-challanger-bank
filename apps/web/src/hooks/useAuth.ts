import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from './useToast';
import { TABLES } from '../config/database';
import { useUser } from './useUser';
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
  const { showError, showSuccess } = useToast();
  
  // Usar o hook useUser para gerenciar dados do usuário
  const {
    user,
    account,
    isLoading: isDataLoading,
    userName,
    userEmail,
    accountBalance,
    accountType,
    decodeUserId
  } = useUser();

  // Buscar dados do GraphQL apenas para o processo de login
  const usersData = useLoginQuery();
  const accountsData = useAccountQuery();

  // Verificar se usuário está logado
  useEffect(() => {
    if (!isDataLoading && !user && shouldRedirect) {
      router.push('/login');
    }
  }, [isDataLoading, user, shouldRedirect, router]);


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
      const foundAccount = (accountsData as any).accounts?.edges?.find((edge: any) => 
        edge?.node?.user === decodedUserId
      );

      if (!foundAccount) {
        showError('Conta não encontrada para este usuário');
        return;
      }

      saveToStorage(user.node, foundAccount.node);
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
    userName,
    userEmail,
    accountBalance,
    accountType,
    
    // Logout
    logout,
    isLoggingOut
  };
};
