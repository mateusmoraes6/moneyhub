import React, { useState } from 'react';
import { Wallet, LogIn, LogOut, Menu } from 'lucide-react';
import { useTransactions } from '../context/TransactionsContext';
import { supabase } from '../supabaseClient';
import AuthModal from './AuthModal';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { isAuthenticated } = useTransactions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleLogin = () => setIsAuthModalOpen(true);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-20 bg-gray-900/50 backdrop-blur-md shadow-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Mobile: Ícone de menu */}
          <button
            className="md:hidden p-2"
            aria-label="Abrir menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-emerald-500" />
          </button>

          {/* Desktop: Logo + Nome */}
          <div className="hidden md:flex items-center space-x-4"></div>
          {/* Esquerda: Logo + Nome */}
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 rounded-full p-2">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            {/* <h1 className="text-xl font-semibold text-white">MoneyHub</h1> */}
          </div>

          {/* Centro: Navegação */}
          <div className="hidden md:flex flex-1 justify-center">
            <Link
              to="/wallet"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              Carteiras
            </Link>
          </div>

          {/* Direita: Login/Logout */}
          <div className="hidden md:block">
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
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Mobile */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isAuthenticated={isAuthenticated}
        onLogin={() => {
          setIsSidebarOpen(false);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

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