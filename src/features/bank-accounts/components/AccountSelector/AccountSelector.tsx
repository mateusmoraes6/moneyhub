import React, { useState, useRef, useEffect } from 'react';
import { Account } from '../../types/account';
import BankIcon from '../../../../components/common/BankIcon';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedAccount = accounts.find(account => account.id === selectedId);

  const getDisplayData = (account: Account) => {
    const bankName = account.nome_banco;
    const iconUrl = account.icone_url;
    const saldo = account.saldo;
    const extraInfo = `Saldo: R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    const saldoColor = saldo >= 0 ? 'text-emerald-400' : 'text-red-400';

    return { bankName, iconUrl, extraInfo, saldoColor };
  };

  const selectedAccountData = selectedAccount ? getDisplayData(selectedAccount) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Conta
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {selectedAccountData?.iconUrl && (
            <BankIcon
              iconUrl={selectedAccountData.iconUrl}
              bankName={selectedAccountData.bankName}
              size="sm"
            />
          )}
          <span className={selectedAccount ? 'text-white' : 'text-gray-400'}>
            {selectedAccountData
              ? selectedAccountData.bankName
              : 'Selecione uma conta'
            }
          </span>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
          <div className="p-2 space-y-2">
            {accounts.map((account) => {
              const accountData = getDisplayData(account);
              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => {
                    onSelect(account.id);
                    setIsOpen(false);
                  }}
                  className="w-full p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-700 transition-colors duration-200"
                >
                  {accountData.iconUrl && (
                    <BankIcon
                      iconUrl={accountData.iconUrl}
                      bankName={accountData.bankName}
                      size="sm"
                    />
                  )}
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">
                      {accountData.bankName}
                    </p>
                    <p className={`text-sm ${accountData.saldoColor}`}>
                      {accountData.extraInfo}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSelector; 