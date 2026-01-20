import React, { useMemo } from 'react';
import { Building2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AccountDetailsModal from '../../features/bank-accounts/modals/AccountDetailsModal';
import AddAccountModal from '../../features/bank-accounts/modals/AddAccountModal';
import AccountList from '../../features/bank-accounts/components/AccountList/AccountList';
import { useCurrencyFormat } from '../../features/bank-accounts/hooks/useCurrencyFormat';
import { useAccountModals } from '../../features/bank-accounts/hooks/useAccountModals';
import { useAccounts } from '../../context/AccountsContext';
import { useTransactions } from '../../context/TransactionsContext';
import { useAccountDetails, gerarHistoricoSaldo } from '../../features/bank-accounts/hooks/useAccountDetails';
import { Account } from '../../features/bank-accounts/types/account';
import { BankAccountSummary } from '../../types/index';
import ConfirmModal from '../../components/common/ConfirmModal';

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

  const { transactions } = useTransactions();

  const selectedAccountData = selectedAccount
    ? {
      id: selectedAccount.id,
      bank_name: selectedAccount.nome_banco,
      balance: selectedAccount.saldo,
      created_at: '',
    }
    : null;

  const selectedAccountDetails = useAccountDetails(selectedAccountData, transactions);

  const [accountToDelete, setAccountToDelete] = React.useState<Account | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [pendingEditData, setPendingEditData] = React.useState<Account | null>(null);
  const [isEditConfirmOpen, setIsEditConfirmOpen] = React.useState(false);

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
      historico_saldo: gerarHistoricoSaldo(acc.id, transactions),
    })),
    [accounts, transactions]
  );

  const handleAddAccount = async (accountData: Omit<BankAccountSummary, 'id' | 'created_at'>) => {
    try {
      await addAccount(accountData);
      closeAddAccount();
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
    }
  };

  const handleUpdateAccount = (account: Account) => {
    setPendingEditData(account);
    setIsEditConfirmOpen(true);
  };

  const handleDeleteAccount = (account: Account) => {
    setAccountToDelete(account);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (accountToDelete) {
      try {
        await deleteAccount(accountToDelete.id);
      } catch (error) {
        console.error('Erro ao deletar conta:', error);
      }
      setIsConfirmOpen(false);
      setAccountToDelete(null);
    }
  };

  const confirmEdit = async () => {
    if (pendingEditData) {
      try {
        const accountData: Partial<BankAccountSummary> = {
          bank_name: pendingEditData.nome_banco,
          balance: pendingEditData.saldo,
        };
        await updateAccount(pendingEditData.id, accountData);
      } catch (error) {
        console.error('Erro ao atualizar conta:', error);
      }
      setIsEditConfirmOpen(false);
      setPendingEditData(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full min-h-[50vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-400">Carregando contas...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-6xl space-y-10"
    >
      {/* Header & Total Balance Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Header Row: Logo, Title, Subtitle on the left */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-lg shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-2xl font-bold text-white tracking-tight">Contas Bancárias</h1>
              <p className="text-gray-400 text-xs sm:text-sm">Gerencie todas as suas contas bancárias</p>
            </div>
          </div>

          {/* Total Balance Card */}
          <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50 sm:items-end">
            <span className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Saldo Global</span>
            <motion.div
              key={totalBalance}
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200 truncate"
            >
              {formatCurrency(totalBalance)}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Account List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-semibold text-gray-200">Suas Contas</h2>
          {/* Optional: Add sort/filter controls here later */}
        </div>

        <AccountList
          accounts={formattedAccounts}
          onEdit={handleUpdateAccount}
          onDelete={handleDeleteAccount}
          onViewDetails={openAccountDetails}
        />
      </div>

      {/* Add Button - Floating styling but inline position */}
      <motion.div
        className="flex justify-center pt-8 pb-12"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={openAddAccount}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-emerald-400 rounded-2xl font-semibold border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-900/20 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Adicionar Nova Conta
          </span>
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-300" />
        </button>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {selectedAccountDetails && (
          <AccountDetailsModal
            isOpen={isModalOpen}
            onClose={closeAccountDetails}
            account={selectedAccountDetails}
          />
        )}
      </AnimatePresence>

      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={closeAddAccount}
        onSave={handleAddAccount}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir esta conta? O histórico será perdido."
        onConfirm={confirmDelete}
        onCancel={() => { setIsConfirmOpen(false); setAccountToDelete(null); }}
      />

      <ConfirmModal
        isOpen={isEditConfirmOpen}
        title="Confirmar Edição"
        description="Tem certeza que deseja modificar as informações desta conta bancária?"
        onConfirm={confirmEdit}
        onCancel={() => { setIsEditConfirmOpen(false); setPendingEditData(null); }}
      />
    </motion.div>
  );
};

export default BankAccounts;