import { useState } from 'react';
import { BankAccountDetails, mockAccounts } from '../data/mockAccounts';

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccountDetails[]>(mockAccounts);

  const handleDelete = (account: BankAccountDetails) => {
    setAccounts(accounts.filter(a => a.id !== account.id));
  };

  const handleAddAccount = (newAccount: Omit<BankAccountDetails, 'id'>) => {
    const account: BankAccountDetails = {
      ...newAccount,
      id: Date.now().toString(),
    };
    setAccounts([...accounts, account]);
  };

  const handleUpdateAccount = (updatedAccount: BankAccountDetails) => {
    setAccounts(accounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    ));
  };

  return {
    accounts,
    handleDelete,
    handleAddAccount,
    handleUpdateAccount
  };
};
