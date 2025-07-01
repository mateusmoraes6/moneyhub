import React, { useMemo } from 'react';
import Header from '../../components/layout/Header';
import { Building2, Plus } from 'lucide-react';
import AccountDetailsModal from '../../features/bank-accounts/modals/AccountDetailsModal';
import AddAccountModal from '../../features/bank-accounts/modals/AddAccountModal';
import AccountList from '../../features/bank-accounts/components/AccountList/AccountList';
import { useCurrencyFormat } from '../../features/bank-accounts/hooks/useCurrencyFormat';
import { useAccountModals } from '../../features/bank-accounts/hooks/useAccountModals';
import { useAccounts } from '../../context/AccountsContext';
import { Account } from '../../features/bank-accounts/types/account';
import { BankAccountSummary } from '../../types/index';

const normalizeBankName = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s/g, "");
};

const BankAccounts: React.FC = () => {
  const { accounts, addAccount, updateAccount, deleteAccount, loading } = useAccounts();
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

  const totalBalance = useMemo(
    () => accounts.reduce((acc, account) => acc + account.balance, 0),
    [accounts]
  );

  const formattedAccounts = useMemo(
    () => accounts.map(acc => ({
      ...acc,
      nome_banco: acc.bank_name,
      numero_conta: '',
      icone_url: `/icons/${normalizeBankName(acc.bank_name)}.svg`,
      saldo: acc.balance,
      historico_saldo: [],
    })),
    [accounts]
  );

  const handleAddAccount = async (accountData: Omit<BankAccountSummary, 'id' | 'created_at'>) => {
    try {
      await addAccount(accountData);
      closeAddAccount();
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
    }
  };

  const handleUpdateAccount = async (account: Account) => {
    try {
      // Mapear apenas os campos válidos para o banco de dados
      const accountData: Partial<BankAccountSummary> = {
        bank_name: account.nome_banco,
        balance: account.saldo,
        // type: 'checking', // ou pegar de algum lugar se necessário
      };
      
      await updateAccount(account.id, accountData);
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
    }
  };

  const handleDeleteAccount = async (account: Account) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        await deleteAccount(account.id);
      } catch (error) {
        console.error('Erro ao deletar conta:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4">Carregando contas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main className="container mt-12 pt-16 mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 rounded-full p-2">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Contas Bancárias</h1>
          </div>

          <div className="flex justify-between items-center">
            {/* <div className="text-left"> */}
              <p className="text-sm text-gray-400">Saldo Total</p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(totalBalance)}
              </p>
            {/* </div> */}
          </div>

          <AccountList
            accounts={formattedAccounts}
            onEdit={handleUpdateAccount}
            onDelete={handleDeleteAccount}
            onViewDetails={openAccountDetails}
          />
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={openAddAccount}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" />
            Adicionar Conta
          </button>
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