import React from 'react';
import { GetServerSideProps } from 'next';
import { BalanceCard } from '../components/Auth/BalanceCard';
import { TransactionList } from '../components/Auth/TransactionList';
import { TransferModal, TransferData } from '../components/Auth/TransferModal';
import { DashboardHeader, QuickActions, LoadingScreen } from '../components/Dashboard';
import { useToast } from '../hooks/useToast';
import { useAuthData } from '../hooks/useAuthData';
import { useTransactions } from '../hooks/useTransactions';
import { useDashboardState } from '../hooks/useDashboardState';

const Dashboard = () => {
  const { showSuccess } = useToast();
  const { user, account, isLoading, logout } = useAuthData();
  const { balance, transactions, addTransaction } = useTransactions(account?.balance || 2500.75);
  const {
    isTransferModalOpen,
    isBalanceVisible,
    isTransactionListVisible,
    accountType,
    setIsTransferModalOpen,
    toggleBalanceVisibility,
    toggleTransactionList,
    toggleAccountType,
    getAccountTypeText
  } = useDashboardState();

  const handleTransfer = (transferData: TransferData) => {
    addTransaction(transferData);
    showSuccess(`Transferência de R$ ${transferData.value.toFixed(2)} realizada com sucesso!`);
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userEmail={user?.email || ''}
        accountType={accountType}
        onToggleAccountType={toggleAccountType}
        onLogout={handleLogout}
        getAccountTypeText={getAccountTypeText}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Gerencie suas finanças de forma simples e segura</p>
          </div>

          <BalanceCard
            balance={balance}
            isVisible={isBalanceVisible}
            onToggleVisibility={toggleBalanceVisibility}
          />

          <QuickActions
            isTransferModalOpen={isTransferModalOpen}
            isTransactionListVisible={isTransactionListVisible}
            onOpenTransferModal={() => setIsTransferModalOpen(true)}
            onToggleTransactionList={toggleTransactionList}
          />

          {isTransactionListVisible && (
            <TransactionList transactions={transactions} />
          )}
        </div>
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransfer={handleTransfer}
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
