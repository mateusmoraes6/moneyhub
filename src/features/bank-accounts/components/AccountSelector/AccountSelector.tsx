import React, { useState } from 'react';
import { Account } from '../../types/account';
import BankIcon from '../../../../components/common/BankIcon';
import { X, ChevronRight, Check } from 'lucide-react';

interface AccountSelectorProps {
  accounts: Account[];
  selectedId?: number;
  onSelect: (id: number) => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  selectedId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedAccount = accounts.find(account => account.id === selectedId);

  const getDisplayData = (account: Account) => {
    const bankName = account.nome_banco;
    const iconUrl = account.icone_url;
    const saldo = account.saldo;
    // const extraInfo = `Saldo: R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    const saldoFormatted = saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const saldoColor = saldo >= 0 ? 'text-emerald-400' : 'text-red-400';

    return { bankName, iconUrl, saldoFormatted, saldoColor };
  };

  const selectedAccountData = selectedAccount ? getDisplayData(selectedAccount) : null;

  const handleSelect = (id: number) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Conta
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent flex items-center justify-between group transition-all hover:border-gray-600"
        >
          <div className="flex items-center space-x-3">
            {selectedAccountData?.iconUrl ? (
              <BankIcon
                iconUrl={selectedAccountData.iconUrl}
                bankName={selectedAccountData.bankName}
                size="sm"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-xs text-gray-400">?</span>
              </div>
            )}
            <span className={selectedAccount ? 'text-white' : 'text-gray-400'}>
              {selectedAccountData
                ? selectedAccountData.bankName
                : 'Selecione uma conta'
              }
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors rotate-90" />
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>

          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[80vh] animate-scaleIn">
            {/* Header */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Selecionar Conta</h3>
                <p className="text-sm text-gray-400">Escolha a conta para movimentação</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-2">
              {accounts.map((account) => {
                const accountData = getDisplayData(account);
                const isSelected = selectedId === account.id;

                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleSelect(account.id)}
                    className={`
                             w-full p-3 rounded-xl flex items-center justify-between transition-all duration-200 border
                             ${isSelected
                        ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_10px_rgba(37,99,235,0.1)]'
                        : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
                      }
                          `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600/20' : 'bg-gray-800'}`}>
                        {accountData.iconUrl && (
                          <BankIcon
                            iconUrl={accountData.iconUrl}
                            bankName={accountData.bankName}
                            size="sm"
                          />
                        )}
                      </div>
                      <div className="text-left">
                        <p className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {accountData.bankName}
                        </p>
                        <p className="text-xs text-gray-500">Saldo Disponível</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-mono font-medium ${accountData.saldoColor}`}>
                        {accountData.saldoFormatted}
                      </p>
                      {isSelected && (
                        <div className="flex justify-end mt-1">
                          <div className="flex items-center gap-1 text-xs text-blue-400">
                            <Check className="w-3 h-3" />
                            Selecionado
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSelector; 