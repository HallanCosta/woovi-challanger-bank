import React, { useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { LoginQuery } from '../__generated__/LoginQuery.graphql';
import { useToast } from '../hooks/useToast';
import { TABLES } from '../config/database';

import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  // Função segura para atualizar email
  const handleEmailChange = useCallback((value: string) => {
    try {
      setEmail(value);
    } catch (error) {
      console.error('Erro ao atualizar email:', error);
    }
  }, []);

  // Função segura para atualizar password
  const handlePasswordChange = useCallback((value: string) => {
    try {
      setPassword(value);
    } catch (error) {
      console.error('Erro ao atualizar password:', error);
    }
  }, []);

  const usersData = useLazyLoadQuery<LoginQuery>(
    graphql`
      query loginQuery($filters: UserFilters) {
        users(filters: $filters) {
          edges {
            node {
              id
              email
              password
            }
          }
        }
      }
    `,
    { filters: {} },
    { fetchPolicy: 'store-or-network' }
  );

  const accountsData = useLazyLoadQuery(
    graphql`
      query loginAccountQuery($filters: AccountFilters) {
        accounts(filters: $filters) {
          edges {
            node {
              id
              balance
              pixKey
              user
              type
            }
          }
        }
      }
    `,
    { filters: {} },
    { fetchPolicy: 'store-or-network' }
  );

  console.log('Login data:', usersData);
  console.log('Accounts data:', accountsData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = usersData.users?.edges?.find(edge => edge?.node?.email === email);
      if (user && user.node?.password === password) {
        // Decodificar o ID do usuário
        const decodedUserId = decodeUserId(user.node.id);
        
        // Buscar a conta do usuário
        const account = (accountsData as any).accounts?.edges?.find((edge: any) => 
          edge?.node?.user === decodedUserId
        );

        if (account) {
          // Salvar dados no localStorage
          saveToStorage(user.node, account.node);
          showSuccess('Login realizado com sucesso!');
          router.push('/dashboard');
        } else {
          showError('Conta não encontrada para este usuário');
        }
      } else {
        showError('Usuário não encontrado ou senha incorreta');
      }
    } catch (error) {
      showError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Função para decodificar ID base64 do usuário
  const decodeUserId = (base64Id: string): string => {
    try {
      const decoded = atob(base64Id);
      // Remove o prefixo "User:" e retorna apenas o ID
      return decoded.replace('User:', '');
    } catch (error) {
      console.error('Erro ao decodificar ID:', error);
      return base64Id;
    }
  };

  // Função para salvar dados no localStorage
  const saveToStorage = (user: any, account: any) => {
    try {
      localStorage.setItem(TABLES.USER, JSON.stringify(user));
      localStorage.setItem(TABLES.ACCOUNT, JSON.stringify(account));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <AccountCircleIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Challanger Bank</CardTitle>
          <CardDescription>
            Faça login na sua conta bancária
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <div className="relative">
                <AccountCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="text"
                  placeholder="Digite o e-mail"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <VisibilityOffIcon className="w-5 h-5" />
                  ) : (
                    <VisibilityIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Use qualquer email de teste para testar (ex: hallan1@test.com)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Login;
