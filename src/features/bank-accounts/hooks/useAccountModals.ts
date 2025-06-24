import { useState } from 'react';
import { Account } from '../types/account';

export const useAccountModals = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAccountDetails = (account: Account) => {
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
