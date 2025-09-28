import { useState } from 'react';

export const useDashboardState = () => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isTransactionListVisible, setIsTransactionListVisible] = useState(true);
  const [accountType, setAccountType] = useState<'PHYSICAL' | 'COMPANY'>('PHYSICAL');
  const [isFavoritesVisible, setIsFavoritesVisible] = useState(false);
  const [prefillPixKey, setPrefillPixKey] = useState<string | null>(null);

  const toggleTransferModal = () => setIsTransferModalOpen(!isTransferModalOpen);
  const toggleBalanceVisibility = () => setIsBalanceVisible(!isBalanceVisible);
  const toggleTransactionList = () => setIsTransactionListVisible(!isTransactionListVisible);
  const toggleAccountType = () => setAccountType(prev => prev === 'PHYSICAL' ? 'COMPANY' : 'PHYSICAL');
  const toggleFavoritesVisibility = () => setIsFavoritesVisible(!isFavoritesVisible);

  const getAccountTypeText = (type: 'PHYSICAL' | 'COMPANY') => {
    return type === 'PHYSICAL' ? 'Pessoa Física' : 'Conta Empresa';
  };

  return {
    // Estados
    isTransferModalOpen,
    isBalanceVisible,
    isTransactionListVisible,
    isFavoritesVisible,
    accountType,
    prefillPixKey,
    
    // Setters
    setIsTransferModalOpen,
    setIsBalanceVisible,
    setIsTransactionListVisible,
    setIsFavoritesVisible,
    setAccountType,
    setPrefillPixKey,
    
    // Toggles
    toggleTransferModal,
    toggleBalanceVisibility,
    toggleTransactionList,
    toggleFavoritesVisibility,
    toggleAccountType,
    
    // Helpers
    getAccountTypeText
  };
};
