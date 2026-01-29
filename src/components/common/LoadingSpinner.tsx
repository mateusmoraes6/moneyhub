import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                <p className="text-gray-400 text-sm font-medium animate-pulse">Carregando...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
