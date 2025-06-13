import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { BankAccountDetails } from '../../data/mockAccounts';
import AccountChart from '../AccountChart/AccountChart';
import { useCurrencyFormat } from '../../hooks/useCurrencyFormat';
import EditAccountModal from '../../modals/EditAccountModal';
import BankIcon from '../../../../components/common/BankIcon';

interface AccountCardProps {
  account: BankAccountDetails;                    // Dados da conta
  onEdit: (account: BankAccountDetails) => void;  // Função para editar
  onDelete: (account: BankAccountDetails) => void;// Função para deletar
  onViewDetails: (account: BankAccountDetails) => void; // Função para ver detalhes
}

// Criamos o componente
const AccountCard: React.FC<AccountCardProps> = ({ 
  account, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const { formatCurrency } = useCurrencyFormat();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne que o evento se propague
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedAccount: BankAccountDetails) => {
    onEdit(updatedAccount);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
        {/* Cabeçalho do card */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <BankIcon
              iconUrl={account.icone_url}
              bankName={account.nome_banco}
              size="lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{account.nome_banco}</h3>
            </div>
          </div>
          {/* Botões de ação */}
          <div className="flex flex-col items-center space-y-2">
            <button 
              onClick={handleEdit}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDelete(account)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo do card */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          {/* Saldo */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm text-gray-400">Saldo atual</p>
              <p className={`text-2xl font-bold ${account.saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(account.saldo)}
              </p>
            </div>
          </div>

          <AccountChart historico={account.historico_saldo} />

          {/* Botão ver detalhes */}
          <div className="mt-4 flex items-center justify-center text-sm">
            <button 
              onClick={() => onViewDetails(account)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Ver detalhes
            </button>
          </div>
        </div>
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
