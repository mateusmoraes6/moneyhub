import React from 'react';
import { Wallet, X, LogOut, LayoutDashboard, CreditCard, Building2, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isAuthenticated?: boolean;
    onLogout?: () => void;
    variant?: 'mobile' | 'desktop';
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen = false,
    onClose = () => { },
    isAuthenticated = true,
    onLogout = () => { },
    variant = 'mobile'
}) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Visão Geral', icon: LayoutDashboard },
        { path: '/bank-accounts', label: 'Contas Bancárias', icon: Building2 },
        { path: '/wallet', label: 'Cartões de Crédito', icon: CreditCard },
        { path: '/future-transactions', label: 'Lançamentos Futuros', icon: Calendar },
    ];

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-gray-900 text-gray-300">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-emerald-500 rounded-xl p-2.5 shadow-lg shadow-emerald-500/20">
                    <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xl font-bold tracking-tight">MoneyHub</span>
                {variant === 'mobile' && (
                    <button
                        className="ml-auto p-1 hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={onClose}
                        aria-label="Fechar menu"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
                    Menu Principal
                </div>
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={variant === 'mobile' ? onClose : undefined}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${active
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 translate-x-1'
                                : 'hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}


            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                {isAuthenticated && (
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-300 group"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium">Sair da Conta</span>
                    </button>
                )}
            </div>
        </div>
    );

    if (variant === 'desktop') {
        return (
            <aside className="h-full w-72 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
                <SidebarContent />
            </aside>
        );
    }

    return (
        <div
            className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            aria-hidden={!isOpen}
        >
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
                aria-label="Fechar menu"
            />
            {/* Sidebar Mobile */}
            <aside
                className={`fixed left-0 top-0 h-full w-72 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full w-full bg-gray-900 border-r border-gray-800">
                    <SidebarContent />
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;