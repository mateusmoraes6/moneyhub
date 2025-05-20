import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useTransactions } from '../context/TransactionsContext';
import { formatCurrency } from '../utils/formatters';

const FinancialSummary: React.FC = () => {
  const { summary, loading } = useTransactions();
  
  // Determine if we should show a motivational message
  const getMotivationalMessage = () => {
    if (summary.balance > 0) {
      return "Ótimo trabalho! Seus ganhos estão superando seus gastos.";
    } else if (summary.balance === 0) {
      return "Suas finanças estão equilibradas.";
    } else {
      return "Atenção! Seus gastos estão superando seus ganhos.";
    }
  };

  if (loading) {
    return (
      <section className="w-full dark:bg-gray-900 rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300">
        <div className="animate-pulse space-y-6">
          <div className="text-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="w-full dark:bg-gray-900 rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300">
      <div className="space-y-6">
        {/* Balance */}
        <div className="text-center">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Saldo Atual</h2>
          <div className={`text-3xl md:text-4xl font-bold transition-colors duration-300 ${
            summary.balance > 0 
              ? 'text-emerald-500' 
              : summary.balance < 0 
                ? 'text-red-500' 
                : 'text-gray-700 dark:text-gray-300'
          }`}>
            {formatCurrency(summary.balance)}
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Income & Expenses */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Receitas</span>
              <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(summary.income)}
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Despesas</span>
              <ArrowDownCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-xl font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(summary.expenses)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialSummary;