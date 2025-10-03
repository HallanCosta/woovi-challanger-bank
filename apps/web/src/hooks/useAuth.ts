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
import { MESSAGES } from '../constants/messages';

export const useAuth = (shouldRedirect: boolean = true) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const { showError, showSuccess } = useToast();
  const environment = useRelayEnvironment();
  
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

  const usersData = useLoginQuery();
  const accountsData = useAccountQuery();

  const refreshBalance = useCallback(async () => {
    setIsRefreshingBalance(true);
    try {
      await fetchQuery(environment, AccountQuery, { filters: {} }, {
        fetchPolicy: 'network-only'
      }).toPromise();
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      showError(MESSAGES.ERROR_BALANCE_UPDATE);
    } finally {
      setIsRefreshingBalance(false);
    }
  }, [showError]);

  useEffect(() => {
    if (!isDataLoading && !user && shouldRedirect) {
      router.push('/login');
    }
  }, [isDataLoading, user, shouldRedirect, router]);


  const saveToStorage = (user: any) => {
    localStorage.setItem(TABLES.USER, JSON.stringify(user));
  };

  const logout = async () => {
    setIsLoggingOut(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    localStorage.removeItem(TABLES.USER);
    
    router.push('/login');
    setIsLoggingOut(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const user = usersData.users?.edges?.find(edge => edge?.node?.email === email);
      
      if (!user || user.node?.password !== password) {
        showError(MESSAGES.ERROR_USER_NOT_FOUND);
        return;
      }

      const foundAccount = (accountsData as any).accounts?.edges?.find((edge: any) => 
        edge?.node?.user?.id === user.node.id
      );

      if (!foundAccount) {
        showError(MESSAGES.ERROR_ACCOUNT_NOT_FOUND);
        return;
      }

      saveToStorage(user.node);
      showSuccess(MESSAGES.SUCCESS_LOGIN);
      router.push('/dashboard');
    } catch (error) {
      showError(MESSAGES.ERROR_LOGIN_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    
    user,
    account,
    isDataLoading,
    userName,
    userEmail,
    accountBalance, 
    accountType,
    
    refreshBalance,
    isRefreshingBalance,
    
    logout,
    isLoggingOut
  };
};
