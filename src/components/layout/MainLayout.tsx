import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTransactions } from '../../context/TransactionsContext';
import { supabase } from '../../supabaseClient';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { isAuthenticated } = useTransactions();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden text-gray-100">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block h-full">
                <Sidebar
                    variant="desktop"
                    isAuthenticated={isAuthenticated}
                    onLogout={handleLogout}
                />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <Header onOpenSidebar={() => setIsMobileSidebarOpen(true)} />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto w-full">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <Sidebar
                variant="mobile"
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
            />
        </div>
    );
};

export default MainLayout;
