import React from 'react';
import SummaryCarousel from '../../components/dashboard/summary/SummaryCarousel';
import TransactionForm from '../../components/dashboard/transactions/TransactionForm';
import TransactionHistory from '../../components/dashboard/transactions/TransactionHistory';
import ExpenseIncomeChart from '../../components/dashboard/charts/ExpenseIncomeChart';


const Dashboard: React.FC = () => {
  // const { accounts } = useAccounts();
  // const totalBalance = accounts.reduce((acc, account) => acc + Number(account.balance), 0); // Moved to Carousel internal logic or prop if needed, but Carousel handles it now inside.

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="space-y-6">
        <SummaryCarousel />

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