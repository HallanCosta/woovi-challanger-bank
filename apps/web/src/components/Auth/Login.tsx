import React, { useState, useCallback, useMemo } from 'react';

import { graphql, useFragment, useLazyLoadQuery } from 'react-relay';
import { Message_message$key } from '../../__generated__/Message_message.graphql';
import { LoginQuery } from '../../__generated__/LoginQuery.graphql';
import { useToast } from '../../hooks/useToast';

import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button as MuiButton,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Filter } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  isLoading = false,
  error,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showShadcn, setShowShadcn] = useState(false);
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
      query LoginQuery($filters: UserFilters) {
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


  console.log('Login data:', usersData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = usersData.users?.edges?.find(edge => edge?.node?.email === email);
    if (user && user.node?.password === password) {
      showSuccess('Login realizado com sucesso!');
      onLogin(email, password);
    } else {
      showError('Usuário não encontrado ou senha incorreta');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Shadcn Design
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
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

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
