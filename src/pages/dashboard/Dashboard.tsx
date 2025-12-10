import React from 'react';
import FinancialSummary from '../../components/dashboard/summary/FinancialSummary';
import TransactionForm from '../../components/dashboard/transactions/TransactionForm';
import TransactionHistory from '../../components/dashboard/transactions/TransactionHistory';
import ExpenseIncomeChart from '../../components/dashboard/charts/ExpenseIncomeChart';
import { useAccounts } from '../../context/AccountsContext';

const Dashboard: React.FC = () => {
  const { accounts } = useAccounts();
  const totalBalance = accounts.reduce((acc, account) => acc + Number(account.balance), 0);

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="space-y-6">
        <FinancialSummary totalBalance={totalBalance} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TransactionForm />

            <div className="hidden lg:block">
              <ExpenseIncomeChart />
            </div>
          </div>

          <div className="space-y-6">
            <TransactionHistory />

            <div className="block lg:hidden">
              <ExpenseIncomeChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;