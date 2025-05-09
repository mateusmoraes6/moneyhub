export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  created_at: string;
  user_id: string;
}

export type EditableTransactionFields = Omit<Transaction, 'id' | 'created_at' | 'user_id'>;

export interface FinancialSummary {
  balance: number;
  income: number;
  expenses: number;
}

export interface TransactionSummary {
  balance: number;
  income: number;
  expenses: number;
}