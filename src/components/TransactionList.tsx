import React, { useRef, useEffect } from 'react';
import { useTransactions } from '../context/TransactionsContext';
import TransactionItem from './TransactionItem';

const TransactionList: React.FC = () => {
  const { transactions } = useTransactions();
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transactions.length > 0 && listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transactions.length]);

  if (transactions.length === 0) {
    return (
      <div className="w-full bg-gray-900 rounded-xl shadow-sm p-6 text-center transition-all duration-300">
        <p className="text-gray-400">
          Nenhuma transação registrada ainda. Adicione sua primeira transação acima!
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <h2 className="text-lg font-semibold text-white mb-4">Histórico de Transações</h2>
      
      <div className="space-y-3 overflow-hidden">
        {transactions.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
        <div ref={listEndRef} />
      </div>
    </section>
  );
};

export default TransactionList;