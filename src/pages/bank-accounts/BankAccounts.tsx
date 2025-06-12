import React from 'react';
import Header from '../../components/layout/Header';
import { Building2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AccountDetailsModal from '../../features/bank-accounts/modals/AccountDetailsModal';
import AddAccountModal from '../../features/bank-accounts/modals/AddAccountModal';
import AccountList from '../../features/bank-accounts/components/AccountList/AccountList';
import { useBankAccounts } from '../../features/bank-accounts/hooks/useBankAccounts';
import { useCurrencyFormat } from '../../features/bank-accounts/hooks/useCurrencyFormat';
import { useAccountModals } from '../../features/bank-accounts/hooks/useAccountModals';
import { BankAccountDetails } from '../../features/bank-accounts/data/mockAccounts'

const BankAccounts: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, handleDelete, handleAddAccount, handleUpdateAccount } = useBankAccounts();
  const { formatCurrency } = useCurrencyFormat();
  const {
    selectedAccount,
    isModalOpen,
    isAddModalOpen,
    openAccountDetails,
    closeAccountDetails,
    openAddAccount,
    closeAddAccount
  } = useAccountModals();

  const totalBalance = accounts.reduce((acc, account) => acc + account.saldo, 0);

  const handleEditAccount = (account: BankAccountDetails) => {
    handleUpdateAccount(account);
  };

  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main className="container mt-12 pt-16 mx-auto px-4 py-6 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 rounded-full p-2">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-white">Contas Bancárias</h1>
            </div>
            <button 
              onClick={openAddAccount}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Conta
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-right">
              <p className="text-sm text-gray-400">Saldo Total</p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </div>

          <AccountList
            accounts={accounts}
            onEdit={handleEditAccount}
            onDelete={handleDelete}
            onViewDetails={openAccountDetails}
          />
        </div>

        {selectedAccount && (
          <AccountDetailsModal
            isOpen={isModalOpen}
            onClose={closeAccountDetails}
            account={selectedAccount}
          />
        )}

        <AddAccountModal
          isOpen={isAddModalOpen}
          onClose={closeAddAccount}
          onSave={handleAddAccount}
        />
      </main>
    </div>
  );
};

export default BankAccounts; 