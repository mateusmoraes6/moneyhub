import React from 'react';
import Header from '../../components/layout/Header';
import { Building2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AccountDetailsModal from '../../features/bank-accounts/modals/AccountDetailsModal';
import AddAccountModal from '../../features/bank-accounts/modals/AddAccountModal';
import AccountList from '../../features/bank-accounts/components/AccountList/AccountList';
import { useCurrencyFormat } from '../../features/bank-accounts/hooks/useCurrencyFormat';
import { useAccountModals } from '../../features/bank-accounts/hooks/useAccountModals';
import { useAccounts } from '../../context/AccountsContext';
import { Account } from '../../features/bank-accounts/types/account';
import { BankAccountSummary } from '../../types/index';

const BankAccounts: React.FC = () => {
  const navigate = useNavigate();
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

  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

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

  const normalizeBankName = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s/g, "");
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
            accounts={accounts.map(acc => ({
              ...acc,
              nome_banco: acc.bank_name,
              numero_conta: '',
              icone_url: `/icons/${normalizeBankName(acc.bank_name)}.svg`,
              saldo: acc.balance,
              historico_saldo: [],
            }))}
            onEdit={handleUpdateAccount}
            onDelete={handleDeleteAccount}
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