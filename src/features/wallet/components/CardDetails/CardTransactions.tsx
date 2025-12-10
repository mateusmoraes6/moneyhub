import React, { useState, useMemo } from 'react';
import { useTransactions } from '../../../../context/TransactionsContext';
import { useAccounts } from '../../../../context/AccountsContext';
import TransactionItem from '../../../../components/dashboard/transactions/TransactionItem';
import { X, Calendar, PieChart, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

interface CardTransactionsProps {
  cardId: number;
  onClose: () => void;
}

const CardTransactions: React.FC<CardTransactionsProps> = ({ cardId, onClose }) => {
  const { transactions } = useTransactions();
  const { cards } = useAccounts();
  const card = cards.find(c => c.id === cardId);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7); // YYYY-MM
  });

  const cardTransactions = useMemo(() => {
    return transactions
      .filter(t => t.card_id === cardId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, cardId]);

  const filteredTransactions = useMemo(() => {
    return cardTransactions.filter(t => t.date.startsWith(selectedMonth));
  }, [cardTransactions, selectedMonth]);

  const totalMonth = filteredTransactions.reduce((acc, t) => acc + Number(t.amount), 0);

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2, 1);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    setSelectedMonth(date.toISOString().slice(0, 7));
  };

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-800">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              <CreditCard className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{card.bank_name}</h2>
              <p className="text-sm text-gray-400">Gerenciar faturas e transações</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar / Stats (Desktop) */}
          <div className="hidden md:flex flex-col w-64 bg-gray-900/50 border-r border-gray-800 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Limite Total</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(card.limit)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Disponível</h3>
              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(card.available_limit)}</p>
            </div>
            <div className="pt-6 border-t border-gray-800">
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <PieChart className="w-4 h-4" />
                  <span className="text-sm font-medium">Uso do Limite</span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(((card.limit - card.available_limit) / card.limit) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>0%</span>
                  <span>{Math.round(((card.limit - card.available_limit) / card.limit) * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
            {/* Month Selector */}
            <div className="flex items-center justify-between p-4 bg-gray-900/50 border-b border-gray-800 sticky top-0 backdrop-blur-md">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-lg font-medium text-white capitalize flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  {monthLabel}
                </span>
                <span className="text-xs text-gray-400">
                  Total: <span className="text-gray-200">{formatCurrency(totalMonth)}</span>
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Transactions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <div className="bg-gray-900 p-4 rounded-full">
                    <CreditCard className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Nenhuma transação neste mês</p>
                </div>
              ) : (
                filteredTransactions.map(transaction => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900 flex justify-end gap-3">
          {/* Future Feature: Pay Invoice */}
          {/* <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
             Pagar Fatura
           </button> */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors border border-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardTransactions;
