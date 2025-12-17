import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '../../../context/TransactionsContext';
import { formatCurrency } from '../../../utils/formatters';

const FinancialSummary: React.FC<{ totalBalance: number }> = ({ totalBalance }) => {
  const { summary, loading } = useTransactions();

  // Calculate monthly result (flow)
  const monthlyResult = summary.income - summary.expenses;
  const isPositiveWindow = monthlyResult >= 0;

  if (loading) {
    return (
      <section className="w-full h-full bg-gray-900 rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300 border border-gray-800 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-800 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-gray-800 rounded"></div>
          <div className="h-16 bg-gray-800 rounded"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full bg-gray-900 rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300 border border-gray-800 flex flex-col justify-between relative overflow-hidden group">
      {/* Dynamic Background */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all duration-1000 opacity-20 group-hover:opacity-30 ${totalBalance >= 0 ? 'bg-emerald-600' : 'bg-red-600'}`}></div>

      <div className="relative z-10 space-y-5">
        {/* Total Net Worth Section */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-gray-800/80 text-gray-400 border border-gray-700/50">
              <Wallet className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-medium text-gray-400">Patrimônio Total</h2>
          </div>

          <div className="flex items-baseline gap-2">
            <div className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight drop-shadow-sm ${totalBalance >= 0
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500'
              }`}>
              {formatCurrency(totalBalance)}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Saldo acumulado em todas as contas</p>
        </div>

        {/* Monthly Flow Section (Income vs Expenses) */}
        <div className="grid grid-cols-2 gap-4 relative mt-2">
          {/* Divider */}
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-gray-700/50 to-transparent"></div>

          {/* Income */}
          <div className="group/income hover:bg-emerald-900/5 p-2 -ml-2 rounded-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-1.5 opacity-80 group-hover/income:opacity-100 transition-opacity">
              <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Receitas</span>
            </div>
            <div className="text-lg font-semibold text-emerald-400 group-hover/income:scale-105 transition-transform origin-left">
              {formatCurrency(summary.income)}
            </div>
          </div>

          {/* Expenses */}
          <div className="group/expense hover:bg-red-900/5 p-2 rounded-xl transition-all duration-300 pl-6">
            <div className="flex items-center gap-2 mb-1.5 opacity-80 group-hover/expense:opacity-100 transition-opacity">
              <ArrowDownCircle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Despesas</span>
            </div>
            <div className="text-lg font-semibold text-red-400 group-hover/expense:scale-105 transition-transform origin-left">
              {formatCurrency(summary.expenses)}
            </div>
          </div>
        </div>

        {/* Monthly Balance Indicator */}
        <div className={`mt-1 py-2 px-3 rounded-lg border flex items-center justify-between text-sm transition-colors duration-300 ${isPositiveWindow
            ? 'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10'
            : 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10'
          }`}>
          <span className="opacity-70 text-gray-300 text-xs uppercase tracking-wider font-medium">Balanço do Mês</span>
          <span className={`font-semibold flex items-center gap-1.5 ${isPositiveWindow ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositiveWindow ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {formatCurrency(monthlyResult)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default FinancialSummary;