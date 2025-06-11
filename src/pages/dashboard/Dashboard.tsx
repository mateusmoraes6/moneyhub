import React from 'react';
import Header from '../../components/layout/Header';
import FinancialSummary from '../../components/dashboard/summary/FinancialSummary';
import TransactionForm from '../../components/dashboard/transactions/TransactionForm';
import TransactionHistory from '../../components/dashboard/transactions/TransactionHistory';
import ExpenseIncomeChart from '../../components/dashboard/charts/ExpenseIncomeChart';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main className="container mt-12 pt-16 mx-auto px-4 py-6 max-w-3xl">
        <div className="space-y-6">
          <FinancialSummary />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <TransactionForm />
              
              <div className="hidden md:block">
                <ExpenseIncomeChart />
              </div>
            </div>
            
            <div className="space-y-6">
              <TransactionHistory />
              
              <div className="block md:hidden">
                <ExpenseIncomeChart />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;