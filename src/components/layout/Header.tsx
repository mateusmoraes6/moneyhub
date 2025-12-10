import React, { useState } from 'react';
import { Wallet, LogIn, Menu } from 'lucide-react';
import { useTransactions } from '../../context/TransactionsContext';
import AuthModal from '../auth/modals/AuthModal';

interface HeaderProps {
  onOpenSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const { isAuthenticated } = useTransactions();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => setIsAuthModalOpen(true);

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-20 bg-gray-900/50 backdrop-blur-md shadow-sm border-b border-gray-800 lg:hidden">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Mobile: Ícone de menu */}
          <button
            className="p-2 -ml-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Abrir menu"
            onClick={onOpenSidebar}
          >
            <Menu className="w-6 h-6 text-emerald-500" />
          </button>

          {/* Mobile: Logo + Nome */}
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 rounded-full p-1.5">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">MoneyHub</span>
          </div>

          {/* Mobile: Placeholder / Login Action */}
          <div>
            {!isAuthenticated && (
              <button
                onClick={handleLogin}
                className="p-2 text-emerald-500 hover:text-emerald-400"
              >
                <LogIn className="w-5 h-5" />
              </button>
            )}
            {/* If authenticated, logout is in sidebar, but we can keep a small indicator or nothing here */}
          </div>
        </div>
      </header>

      {/* Modal de autenticação */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type="login"
      />
    </>
  );
};

export default Header;