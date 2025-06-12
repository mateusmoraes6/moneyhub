import React from 'react';
import { BankAccountDetails } from '../../data/mockAccounts';
import AccountCard from '../AccountCard/AccountCard';

interface AccountListProps {
  accounts: BankAccountDetails[];
  onEdit: (account: BankAccountDetails) => void;
  onDelete: (account: BankAccountDetails) => void;
  onViewDetails: (account: BankAccountDetails) => void;
}

const AccountList: React.FC<AccountListProps> = ({
  accounts,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default AccountList;
