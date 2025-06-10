import { useState } from 'react';
import { BankAccount } from '../data/mockAccounts';

export const useAccountModals = () => {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAccountDetails = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const closeAccountDetails = () => {
    setIsModalOpen(false);
  };

  const openAddAccount = () => {
    setIsAddModalOpen(true);
  };

  const closeAddAccount = () => {
    setIsAddModalOpen(false);
  };

  return {
    selectedAccount,
    isModalOpen,
    isAddModalOpen,
    openAccountDetails,
    closeAccountDetails,
    openAddAccount,
    closeAddAccount
  };
};
