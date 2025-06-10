import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { BankAccount } from '../../data/mockAccounts';
import AccountChart from '../AccountChart/AccountChart';
import { useCurrencyFormat } from '../../hooks/useCurrencyFormat';

// Definimos as props que o componente vai receber
interface AccountCardProps {
  account: BankAccount;                    // Dados da conta
  onEdit: (account: BankAccount) => void;  // Função para editar
  onDelete: (account: BankAccount) => void;// Função para deletar
  onViewDetails: (account: BankAccount) => void; // Função para ver detalhes
}

// Criamos o componente
const AccountCard: React.FC<AccountCardProps> = ({ 
  account, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  const { formatCurrency } = useCurrencyFormat();

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      {/* Cabeçalho do card */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <img
            src={account.icone_url}
            alt={account.nome_banco}
            className="w-12 h-12 rounded-lg bg-white p-0.5"
          />
          <div>
            <h3 className="text-lg font-semibold text-white">{account.nome_banco}</h3>
          </div>
        </div>
        {/* Botões de ação */}
        <div className="flex flex-col items-center space-y-2">
          <button onClick={() => onEdit(account)}>
            <Edit2 className="w-5 h-5" />
          </button>
          <button onClick={() => onDelete(account)}>
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
          <button onClick={() => onViewDetails(account)}>
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
