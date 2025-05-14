import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Trash2, Edit, Check, X, MoreVertical } from 'lucide-react';
import { Transaction } from '../types';
import { useTransactions } from '../context/TransactionsContext';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { deleteTransaction, editTransaction } = useTransactions();
  const { id, description, amount, type, date } = transaction;

  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedAmount, setEditedAmount] = useState(amount.toString());
  const [editedType, setEditedType] = useState(type);
  const [editedDate, setEditedDate] = useState(date.split('T')[0]);
  const [showActions, setShowActions] = useState(false);

  const handleSave = () => {
    const amountValue = parseFloat(editedAmount);
    if (!editedDescription.trim() || isNaN(amountValue) || amountValue <= 0 || !editedDate) {
      return;
    }

    editTransaction(id, {
      description: editedDescription.trim(),
      amount: amountValue,
      type: editedType,
      date: editedDate,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(description);
    setEditedAmount(amount.toString());
    setEditedType(type);
    setEditedDate(date.split('T')[0]);
    setIsEditing(false);
  };

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  if (isEditing) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700 transition-all duration-300 animate-fadeIn">
        <div className="space-y-3">
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
            placeholder="Descrição"
          />
          <input
            type="number"
            value={editedAmount}
            onChange={(e) => setEditedAmount(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
            min="0.01"
            step="0.01"
          />
          <input
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setEditedType('income')}
              className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                editedType === 'income'
                  ? 'bg-emerald-900/40 text-emerald-300 border-2 border-emerald-500'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              Receita
            </button>
            <button
              onClick={() => setEditedType('expense')}
              className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                editedType === 'expense'
                  ? 'bg-red-900/40 text-red-300 border-2 border-red-500'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              Despesa
            </button>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-800"
              aria-label="Cancelar edição"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              className="p-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30"
              aria-label="Salvar edição"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700 transition-all duration-300 animate-fadeIn">
      {/* Layout para desktop (md e acima) */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            type === 'income' 
              ? 'bg-emerald-900/30' 
              : 'bg-red-900/30'
          }`}>
            {type === 'income' ? (
              <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
            ) : (
              <ArrowDownCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-white">{description}</h3>
            <p className="text-xs text-gray-400">{formatDate(date)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`font-semibold ${
            type === 'income' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {type === 'income' ? '+' : '-'} {formatCurrency(amount)}
          </span>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300"
              aria-label="Editar transação"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTransaction(id)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300"
              aria-label="Remover transação"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Layout otimizado para mobile */}
      <div className="md:hidden">
        {/* Cabeçalho com descrição e menu de ações */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className={`flex-shrink-0 p-2 rounded-full ${
              type === 'income' 
                ? 'bg-emerald-900/30' 
                : 'bg-red-900/30'
            }`}>
              {type === 'income' ? (
                <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{description}</h3>
            </div>
          </div>
          
          <div className="relative ml-2">
            <button 
              onClick={toggleActions}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-300"
              aria-label="Mais opções"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10 w-36">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowActions(false);
                  }}
                  className="flex w-full items-center space-x-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    deleteTransaction(id);
                    setShowActions(false);
                  }}
                  className="flex w-full items-center space-x-2 px-4 py-3 text-sm text-red-400 hover:bg-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Rodapé com data e valor */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
          <p className="text-xs text-gray-400">{formatDate(date)}</p>
          <span className={`font-semibold ${
            type === 'income' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {type === 'income' ? '+' : '-'} {formatCurrency(amount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;