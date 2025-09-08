import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useToast } from './useToast';
import { TABLES } from '../config/database';
import { useUser } from './useUser';
import { useLoginQuery } from '../components/queries/useLoginQuery';
import { useAccountQuery } from '../components/queries/useAccountQuery';
import { useRelayEnvironment } from 'react-relay';
import { fetchQuery } from 'react-relay';
import { AccountQuery } from '../components/queries/AccountQuery';

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
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const { showError, showSuccess } = useToast();
  const environment = useRelayEnvironment();
  
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

  // Buscar dados do GraphQL sempre
  const usersData = useLoginQuery();
  const accountsData = useAccountQuery();

  // O saldo agora é sempre buscado do GraphQL através do useUser
  // Não precisamos mais desta função duplicada

  // Função para atualizar saldo de forma suave
  const refreshBalance = useCallback(async () => {
    setIsRefreshingBalance(true);
    try {
      // Forçar refetch dos dados do GraphQL usando fetchQuery
      await fetchQuery(environment, AccountQuery, { filters: {} }, {
        fetchPolicy: 'network-only'
      }).toPromise();
      
      // Pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      showError('Erro ao atualizar saldo');
    } finally {
      setIsRefreshingBalance(false);
    }
  }, [showError]);

  // Verificar se usuário está logado
  useEffect(() => {
    if (!isDataLoading && !user && shouldRedirect) {
      router.push('/login');
    }
  }, [isDataLoading, user, shouldRedirect, router]);


  const saveToStorage = (user: any) => {
    try {
      localStorage.setItem(TABLES.USER, JSON.stringify(user));
      // Não salvar mais a conta no localStorage - sempre buscar do GraphQL
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
      // Não precisamos mais remover TABLES.ACCOUNT pois não salvamos mais
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

      // Salvar apenas o usuário no localStorage - conta será sempre buscada do GraphQL
      saveToStorage(user.node);
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
    accountBalance, // Sempre usar saldo do GraphQL através do useUser
    accountType,
    
    // Funções de atualização
    refreshBalance,
    isRefreshingBalance,
    
    // Logout
    logout,
    isLoggingOut
  };
};
