import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Trash2, Edit, MoreVertical, Building2, CreditCard } from 'lucide-react';
import { Transaction } from '../../../types';
import { useTransactions } from '../../../context/TransactionsContext';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { useAccounts } from '../../../context/AccountsContext';
import BankIcon from '../../common/BankIcon';
import TransactionEditModal from './TransactionEditModal';

interface TransactionItemProps {
  transaction: Transaction;
  showBankOrCardIcon?: boolean; // NOVA PROP
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, showBankOrCardIcon }) => {
  const { deleteTransaction, editTransaction } = useTransactions();
  const { id, description, amount, type, date } = transaction;
  const { getAccountById } = useAccounts();
  const account = transaction.account_id ? getAccountById(transaction.account_id) : undefined;
  const normalizeBankName = (name: string) =>
    name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s/g, "");
  const iconUrl = account ? `/icons/${normalizeBankName(account.bank_name)}.svg` : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const handleEditSave = (updated: Partial<Transaction>) => {
    editTransaction(id, {
      ...transaction,
      ...updated,
      category_id: transaction.category_id,
      payment_method: transaction.payment_method,
      status: transaction.status,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TransactionEditModal
        transaction={transaction}
        onSave={handleEditSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700 transition-all duration-300 animate-fadeIn">
      {/* Layout para desktop (md e acima) */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${type === 'income'
              ? 'bg-emerald-900/30'
              : 'bg-red-900/30'
            }`}>
            {showBankOrCardIcon ? (
              transaction.card_id ? (
                <CreditCard className={`w-5 h-5 ${type === 'income' ? 'text-emerald-500' : 'text-red-500'}`} />
              ) : (
                <Building2 className={`w-5 h-5 ${type === 'income' ? 'text-emerald-500' : 'text-red-500'}`} />
              )
            ) : (
              type === 'income' ? (
                <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
              )
            )}
          </div>
          {iconUrl && (
            <BankIcon iconUrl={iconUrl} bankName={account?.bank_name || ''} size="sm" />
          )}

          <div>
            <h3 className="font-medium text-white">{description}</h3>
            <p className="text-xs text-gray-400">{formatDate(date)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className={`font-semibold ${type === 'income' ? 'text-emerald-400' : 'text-red-400'
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
            <div className={`flex-shrink-0 p-2 rounded-full ${type === 'income'
                ? 'bg-emerald-900/30'
                : 'bg-red-900/30'
              }`}>
              {showBankOrCardIcon ? (
                transaction.card_id ? (
                  <CreditCard className={`w-5 h-5 ${type === 'income' ? 'text-emerald-500' : 'text-red-500'}`} />
                ) : (
                  <Building2 className={`w-5 h-5 ${type === 'income' ? 'text-emerald-500' : 'text-red-500'}`} />
                )
              ) : (
                type === 'income' ? (
                  <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5 text-red-500" />
                )
              )}
            </div>
            {iconUrl && (
              <BankIcon iconUrl={iconUrl} bankName={account?.bank_name || ''} size="sm" />
            )}

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
          <span className={`font-semibold ${type === 'income' ? 'text-emerald-400' : 'text-red-400'
            }`}>
            {type === 'income' ? '+' : '-'} {formatCurrency(amount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;