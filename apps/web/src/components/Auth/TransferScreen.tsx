import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button as MuiButton,
  Alert,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AccountBalance as AccountBalanceIcon,
  Send as SendIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface TransferScreenProps {
  accountNumber: string;
  onLogout: () => void;
  onBack: () => void;
  showShadcn?: boolean;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({
  accountNumber,
  onLogout,
  onBack,
  showShadcn = false,
}) => {
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientAccount || !amount) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simular transferência
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setRecipientAccount('');
      setAmount('');
      setDescription('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue === '') return '';
    
    const floatValue = parseFloat(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(floatValue);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCurrency(value);
    setAmount(formatted);
  };

  // Material UI Design
  if (!showShadcn) {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onBack}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Transferência
            </Typography>
            <IconButton color="inherit" onClick={onLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'success.main',
                  borderRadius: '50%',
                  p: 2,
                  mb: 2,
                  color: 'white',
                }}
              >
                <SendIcon sx={{ fontSize: 40 }} />
              </Box>

              <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                Transferência
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Conta: {accountNumber}
              </Typography>

              {success && (
                <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                  Transferência realizada com sucesso!
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleTransfer} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="recipientAccount"
                  label="Conta Destinatária"
                  name="recipientAccount"
                  autoComplete="off"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="amount"
                  label="Valor"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="R$ 0,00"
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  name="description"
                  label="Descrição (opcional)"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <MuiButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading || !recipientAccount || !amount}
                  sx={{
                    mt: 1,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Transferir'
                  )}
                </MuiButton>
              </Box>
            </Paper>
          </Box>
        </Container>
      </>
    );
  }

  // Shadcn Design
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowBackIcon className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-lg font-semibold">Transferência</h1>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <LogoutIcon className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <SendIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Transferência</CardTitle>
            <CardDescription>
              Conta: {accountNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">Transferência realizada com sucesso!</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipientAccount" className="text-sm font-medium">
                  Conta Destinatária
                </label>
                <Input
                  id="recipientAccount"
                  type="text"
                  placeholder="Digite o número da conta"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Valor
                </label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="R$ 0,00"
                  value={amount}
                  onChange={handleAmountChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descrição (opcional)
                </label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Digite uma descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !recipientAccount || !amount}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transferindo...</span>
                  </div>
                ) : (
                  'Transferir'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
