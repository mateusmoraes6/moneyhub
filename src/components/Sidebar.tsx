import React from 'react';
import { Wallet, X, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    onLogin: () => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    isAuthenticated,
    onLogin,
    onLogout,
}) => {
    return (
        <div
            className={`fixed inset-0 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            aria-hidden={!isOpen}
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
                aria-label="Fechar menu"
            />
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full w-64 bg-gray-900 shadow-lg flex flex-col justify-between transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                role="navigation"
                aria-label="Menu lateral"
            >
                <button
                    className="absolute top-4 right-4"
                    onClick={onClose}
                    aria-label="Fechar menu"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
                <div>
                    <div className="flex flex-col items-center mt-12">
                        <div className="bg-emerald-500 rounded-full p-3 mb-2">
                            <Wallet className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-white text-lg font-bold mb-8">MoneyHub</span>
                        <Link
                            to="/"
                            className="w-full text-left px-6 py-3 text-emerald-400 hover:text-emerald-300 font-medium transition block"
                            onClick={onClose}
                        >
                            Visão Geral
                        </Link>
                        <Link
                            to="/wallet"
                            className="w-full text-left px-6 py-3 text-emerald-400 hover:text-emerald-300 font-medium transition block"
                            onClick={onClose}
                        >
                            Cartões de Crédito
                        </Link>
                        <Link
                            to="/bank-accounts"
                            className="w-full text-left px-6 py-3 text-emerald-400 hover:text-emerald-300 font-medium transition block"
                            onClick={onClose}
                        >
                            Contas Bancárias
                        </Link>
                    </div>
                </div>
                <div className="mb-8 px-6">
                    {isAuthenticated ? (
                        <button
                            onClick={onLogout}
                            className="flex items-center space-x-2 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                        </button>
                    ) : (
                        <button
                            onClick={onLogin}
                            className="flex items-center space-x-2 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Entrar</span>
                        </button>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;