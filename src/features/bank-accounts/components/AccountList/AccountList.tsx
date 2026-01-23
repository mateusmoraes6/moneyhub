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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account, index) => (
        <div 
          key={account.id} 
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <AccountCard
            account={account}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
          />
        </div>
      ))}
    </div>
  );
};

export default AccountList;
