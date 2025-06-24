import React from 'react';
import { Account } from '../../types/account';
import AccountCard from '../AccountCard/AccountCard';

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onViewDetails: (account: Account) => void;
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
