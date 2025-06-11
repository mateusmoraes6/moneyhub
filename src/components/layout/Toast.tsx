import React, { useEffect } from 'react';
import { useTransactions } from '../../context/TransactionsContext';
import { CheckCircle } from 'lucide-react';

const Toast: React.FC = () => {
  const { lastAction, setLastAction } = useTransactions();
  
  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => {
        setLastAction(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [lastAction, setLastAction]);
  
  if (!lastAction) return null;
  
  return (
    <div className="fixed bottom-4 right-4 max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-3 animate-slideIn flex items-center space-x-3 border-l-4 border-green-500 transition-all duration-300">
      <CheckCircle className="w-5 h-5 text-green-500" />
      <p className="text-sm text-gray-700 dark:text-gray-300">{lastAction}</p>
    </div>
  );
};

export default Toast;