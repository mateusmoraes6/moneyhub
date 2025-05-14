import React from 'react';
import Header from '../components/Header';
import FinancialSummary from '../components/FinancialSummary';
import TransactionForm from '../components/TransactionForm';
import TransactionHistory from '../components/TransactionHistory';
import ExpenseIncomeChart from '../components/ExpenseIncomeChart';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
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