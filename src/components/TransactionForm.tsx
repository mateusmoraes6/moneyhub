import React, { useState } from 'react';
import { PlusCircle, LogIn } from 'lucide-react';
import { useTransactions } from '../context/TransactionsContext';
import { TransactionType } from '../types';

const TransactionForm: React.FC = () => {
  const { addTransaction, isAuthenticated } = useTransactions();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!description.trim()) {
      setError('Por favor, informe uma descrição');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Por favor, informe um valor válido maior que zero');
      return;
    }
    
    if (!date) {
      setError('Por favor, selecione uma data');
      return;
    }
    
    // Add transaction
    addTransaction({
      description: description.trim(),
      amount: amountValue,
      type,
      date: date, 
    });
    
    // Reset form
    setDescription('');
    setAmount('');
    setType('income');
    setDate(new Date().toISOString().split('T')[0]);
    setError(null);
  };

  // const handleSave = () => {
  //   const amountValue = parseFloat(amount);
  //   if (!description.trim() || isNaN(amountValue) || amountValue <= 0 || !date) {
  //     return;
  //   }

  //   addTransaction({
  //     description: description.trim(),
  //     amount: amountValue,
  //     type,
  //     date: new Date(date).toISOString(),
  //   });
  //   setError(null);
  // };

  if (!isAuthenticated) {
    return (
      <section className="w-full bg-gray-900 rounded-xl shadow-sm p-6 transition-all duration-300">
        <div className="text-center space-y-4">
          <LogIn className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-lg font-semibold text-white">Faça login para adicionar transações</h2>
          <p className="text-gray-400 text-sm">
            Você precisa estar autenticado para registrar suas transações
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-900 rounded-xl shadow-sm p-4 transition-all duration-300">
      <h2 className="text-lg font-semibold text-white mb-4">Nova Transação</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2 text-sm bg-red-900/30 text-red-300 rounded-lg">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Descrição
          </label>
          <input
            type="text"
            id="description"
            placeholder="Ex: Salário, Mercado, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Valor
          </label>
          <input
            type="number"
            id="amount"
            placeholder="0,00"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
            Data
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
            required
          />
        </div>
        
        <div>
          <span className="block text-sm font-medium text-gray-300 mb-2">Tipo</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-3 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                type === 'income'
                  ? 'bg-emerald-900/40 text-emerald-300 border-2 border-emerald-500'
                  : 'bg-gray-800 text-gray-300 border-2 border-transparent hover:bg-gray-700'
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-3 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                type === 'expense'
                  ? 'bg-red-900/40 text-red-300 border-2 border-red-500'
                  : 'bg-gray-800 text-gray-300 border-2 border-transparent hover:bg-gray-700'
              }`}
            >
              Despesa
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Adicionar Transação</span>
        </button>
      </form>
    </section>
  );
};

export default TransactionForm;