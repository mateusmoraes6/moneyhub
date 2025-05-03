export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  created_at: string;
}

export interface FinancialSummary {
  balance: number;
  income: number;
  expenses: number;
}