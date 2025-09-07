import { useState } from 'react';

export const useDashboardState = () => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isTransactionListVisible, setIsTransactionListVisible] = useState(true);
  const [accountType, setAccountType] = useState<'PHYSICAL' | 'COMPANY'>('PHYSICAL');

  const toggleTransferModal = () => setIsTransferModalOpen(!isTransferModalOpen);
  const toggleBalanceVisibility = () => setIsBalanceVisible(!isBalanceVisible);
  const toggleTransactionList = () => setIsTransactionListVisible(!isTransactionListVisible);
  const toggleAccountType = () => setAccountType(prev => prev === 'PHYSICAL' ? 'COMPANY' : 'PHYSICAL');

  const getAccountTypeText = (type: 'PHYSICAL' | 'COMPANY') => {
    return type === 'PHYSICAL' ? 'Pessoa Física' : 'Conta Empresa';
  };

  return {
    // Estados
    isTransferModalOpen,
    isBalanceVisible,
    isTransactionListVisible,
    accountType,
    
    // Setters
    setIsTransferModalOpen,
    setIsBalanceVisible,
    setIsTransactionListVisible,
    setAccountType,
    
    // Toggles
    toggleTransferModal,
    toggleBalanceVisibility,
    toggleTransactionList,
    toggleAccountType,
    
    // Helpers
    getAccountTypeText
  };
};
