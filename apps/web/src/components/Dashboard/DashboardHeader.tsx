import React from 'react';
import { Button } from '../ui/button';
import { LogOut, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  accountType: 'PHYSICAL' | 'COMPANY';
  onToggleAccountType: () => void;
  onLogout: () => void;
  getAccountTypeText: (type: 'PHYSICAL' | 'COMPANY') => string;
  isLoggingOut: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  userEmail,
  accountType,
  onToggleAccountType,
  onLogout,
  getAccountTypeText,
  isLoggingOut
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{userName || 'Usuário'}</p>
              <p className="text-xs text-muted-foreground">{userEmail || 'Carregando...'}</p>
              <button 
                onClick={onToggleAccountType}
                className="text-xs text-primary hover:underline underline-offset-4 transition-colors"
              >
                {getAccountTypeText(accountType)}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Alternar tema"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
              {isLoggingOut ? 'Deslogando...' : 'Sair'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
