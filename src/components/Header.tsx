import React, { useState } from 'react';
import { Wallet, LogIn, LogOut } from 'lucide-react';
import { useTransactions } from '../context/TransactionsContext';
import { supabase } from '../supabaseClient';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const { isAuthenticated } = useTransactions();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-10 bg-gray-900 shadow-sm transition-colors duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-emerald-500" />
          <h1 className="text-xl font-semibold text-white">MoneyHub</h1>
        </div>

        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header;