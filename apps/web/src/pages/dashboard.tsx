import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { BalanceCard } from '../components/Auth/BalanceCard';
import { TransactionList } from '../components/Auth/TransactionList';
import { FavoritesList } from '../components/Auth/FavoritesList';
import { AddFavoriteModal } from '../components/Auth/AddFavoriteModal';
import { TransferModal, TransferData } from '../components/Auth/TransferModal';
import { DashboardHeader, QuickActions, LoadingScreen } from '../components/Dashboard';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { useDashboardState } from '../hooks/useDashboardState';
import { useFavorites } from '../hooks/useFavorites';

const Dashboard = () => {
  const { showSuccess } = useToast();
  const { 
    user, 
    account, 
    isDataLoading, 
    logout, 
    isLoggingOut, 
    userName, 
    userEmail, 
    accountBalance, 
    accountType: userAccountType,
    refreshBalance,
    isRefreshingBalance
  } = useAuth();
  const { balance, transactions, addTransaction, refreshTransactions, isRefreshingTransactions } = useTransactions(accountBalance);
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isAddFavoriteOpen, setIsAddFavoriteOpen] = useState(false);

  const {
    isTransferModalOpen,
    isBalanceVisible,
    isTransactionListVisible,
    isFavoritesVisible,
    accountType,
    setIsTransferModalOpen,
    toggleBalanceVisibility,
    toggleTransactionList,
    toggleFavoritesVisibility,
    toggleAccountType,
    getAccountTypeText,
    prefillPixKey,
    setPrefillPixKey,
  } = useDashboardState();

  const handleTransfer = (transferData: TransferData) => {
    addTransaction(transferData);
    showSuccess(`Transferência de R$ ${transferData.value.toFixed(2)} realizada com sucesso!`);
    // Atualizar saldo da conta após confirmar a transação
    try {
      refreshBalance();
    } catch {
      // noop
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isDataLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        accountType={userAccountType}
        onToggleAccountType={toggleAccountType}
        onLogout={handleLogout}
        getAccountTypeText={getAccountTypeText}
        isLoggingOut={isLoggingOut}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Gerencie suas finanças de forma simples e segura</p>
          </div>

          <BalanceCard
            balance={accountBalance}
            isVisible={isBalanceVisible}
            onToggleVisibility={toggleBalanceVisibility}
            onRefreshBalance={refreshBalance}
            isRefreshingBalance={isRefreshingBalance}
          />

          <QuickActions
            isTransferModalOpen={isTransferModalOpen}
            isTransactionListVisible={isTransactionListVisible}
            isFavoritesVisible={isFavoritesVisible}
            onOpenTransferModal={() => setIsTransferModalOpen(true)}
            onToggleTransactionList={toggleTransactionList}
            onToggleFavorites={toggleFavoritesVisibility}
          />

          {isFavoritesVisible && (
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsTransferModalOpen(false)}
                  className="hidden"
                  aria-hidden
                />
              </div>
              <FavoritesList
                favorites={favorites}
                onRemove={removeFavorite}
                onTransfer={(pixKey) => {
                  setPrefillPixKey(pixKey);
                  setIsTransferModalOpen(true);
                }}
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsAddFavoriteOpen(true)}
                  className="mt-3 inline-flex items-center justify-center h-9 rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95"
                >
                  Adicionar favorito
                </button>
              </div>
            </>
          )}

          {isTransactionListVisible && (
            <TransactionList 
              transactions={transactions}
              onRefresh={refreshTransactions}
              isRefreshing={isRefreshingTransactions}
            />
          )}
        </div>
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => { setIsTransferModalOpen(false); setPrefillPixKey(null); }}
        onTransfer={handleTransfer}
        initialPixKey={prefillPixKey || undefined}
      />

      <AddFavoriteModal
        isOpen={isAddFavoriteOpen}
        onClose={() => setIsAddFavoriteOpen(false)}
        onAdd={(fav) => addFavorite(fav)}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Dashboard;
