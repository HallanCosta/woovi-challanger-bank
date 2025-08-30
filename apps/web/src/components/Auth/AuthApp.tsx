import React, { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { TransferScreen } from './TransferScreen';

type AuthState = 'login' | 'transfer';

export const AuthApp: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [accountNumber, setAccountNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (account: string, password: string) => {
    setIsLoading(true);
    setError('');

    // Simular validação de login
    setTimeout(() => {
      setIsLoading(false);
      
      // Para demonstração, aceita qualquer conta
      if (account && password) {
        setAccountNumber(account);
        setAuthState('transfer');
      } else {
        setError('Credenciais inválidas');
      }
    }, 1500);
  };

  const handleLogout = () => {
    setAuthState('login');
    setAccountNumber('');
    setError('');
  };

  const handleBack = () => {
    setAuthState('login');
    setAccountNumber('');
    setError('');
  };

  if (authState === 'transfer') {
    return (
      <TransferScreen
        accountNumber={accountNumber}
        onLogout={handleLogout}
        onBack={handleBack}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
};
