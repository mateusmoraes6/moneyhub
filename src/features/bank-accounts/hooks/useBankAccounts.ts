import { useState } from 'react';
import { BankAccount, mockAccounts } from '../data/mockAccounts';

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>(mockAccounts);

  const handleDelete = (account: BankAccount) => {
    setAccounts(accounts.filter(a => a.id !== account.id));
  };

  const handleAddAccount = (newAccount: Omit<BankAccount, 'id'>) => {
    const account: BankAccount = {
      ...newAccount,
      id: Date.now().toString(),
    };
    setAccounts([...accounts, account]);
  };

  return {
    accounts,
    handleDelete,
    handleAddAccount
  };
};
