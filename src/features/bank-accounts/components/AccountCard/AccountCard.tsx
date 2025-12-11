import React, { useState } from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Account } from '../../types/account';
import AccountChart from '../AccountChart/AccountChart';
import { useCurrencyFormat } from '../../hooks/useCurrencyFormat';
import EditAccountModal from '../../modals/EditAccountModal';
import BankIcon from '../../../../components/common/BankIcon';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onViewDetails: (account: Account) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const { formatCurrency } = useCurrencyFormat();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(account);
  };

  const handleSaveEdit = (updatedAccount: Account) => {
    onEdit(updatedAccount);
    setIsEditModalOpen(false);
  };

  // Determine trend (mock logic if not available, or check history)
  // Assuming history is sorted by date
  const hasHistory = account.historico_saldo && account.historico_saldo.length > 1;
  const lastValue = hasHistory ? account.historico_saldo[account.historico_saldo.length - 1].valor : 0;
  const prevValue = hasHistory ? account.historico_saldo[account.historico_saldo.length - 2].valor : 0;
  const isPositive = lastValue >= prevValue;

  return (
    <>
      <div
        onClick={() => onViewDetails(account)}
        className="group relative bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800 hover:border-emerald-500/30 transition-all duration-300 w-full overflow-hidden hover:shadow-xl hover:shadow-emerald-900/10 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="p-6 relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-800 rounded-xl shadow-inner border border-gray-700 group-hover:border-gray-600 transition-colors">
                <BankIcon
                  iconUrl={account.icone_url}
                  bankName={account.nome_banco}
                  size="md"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100 leading-tight">{account.nome_banco}</h3>
                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Conta Corrente</p>
              </div>
            </div>

            {/* Actions (opacity 0 normally, 1 on hover) */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-x-4 group-hover:translate-x-0">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Balance */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-1 font-medium">Saldo Atual</p>
            <div className="flex items-baseline gap-3">
              <span className={`text-2xl font-bold ${account.saldo >= 0 ? 'text-white' : 'text-red-400'}`}>
                {formatCurrency(account.saldo)}
              </span>
              {hasHistory && (
                <div className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {/* Mock percentage or real calculation could go here */}
                </div>
              )}
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex-1 min-h-[50px] -mx-6 -mb-6 mt-auto">
            {account.historico_saldo && account.historico_saldo.length > 0 ? (
              <div className="h-24 opacity-60 group-hover:opacity-80 transition-opacity">
                <AccountChart historico={account.historico_saldo} variant="simple" height={96} />
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center bg-gray-800/30">
                <span className="text-xs text-gray-500">Sem histórico</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Highlight Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500/20 rounded-2xl pointer-events-none transition-colors duration-300" />
      </div>

      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        account={account}
      />
    </>
  );
};

export default AccountCard;
