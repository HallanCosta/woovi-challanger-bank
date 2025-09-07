import React from 'react';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';

interface DashboardHeaderProps {
  userEmail: string;
  accountType: 'PHYSICAL' | 'COMPANY';
  onToggleAccountType: () => void;
  onLogout: () => void;
  getAccountTypeText: (type: 'PHYSICAL' | 'COMPANY') => string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userEmail,
  accountType,
  onToggleAccountType,
  onLogout,
  getAccountTypeText
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{userEmail || 'Carregando...'}</p>
              <button 
                onClick={onToggleAccountType}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {getAccountTypeText(accountType)}
              </button>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};
