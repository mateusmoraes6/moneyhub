export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'pix_debit' | 'credit';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  created_at: string;
  user_id: string;
  payment_method: PaymentMethod;
  category: string;
  account_id?: number;
  card_id?: number;
  installments?: number;
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

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salário', icon: '💰', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💼', type: 'income' },
  { id: 'sales', name: 'Vendas', icon: '🛍️', type: 'income' },
  { id: 'investments', name: 'Investimentos', icon: '📈', type: 'income' },
  { id: 'rent', name: 'Aluguel Recebido', icon: '🏠', type: 'income' },
  { id: 'bonus', name: 'Bonificação', icon: '🎁', type: 'income' },
  { id: 'other_income', name: 'Outros', icon: '📝', type: 'income' },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Alimentação', icon: '🍽️', type: 'expense' },
  { id: 'transport', name: 'Transporte', icon: '🚗', type: 'expense' },
  { id: 'health', name: 'Saúde', icon: '🏥', type: 'expense' },
  { id: 'education', name: 'Educação', icon: '📚', type: 'expense' },
  { id: 'leisure', name: 'Lazer', icon: '🎮', type: 'expense' },
  { id: 'home', name: 'Casa', icon: '🏡', type: 'expense' },
  { id: 'clothes', name: 'Roupas', icon: '👕', type: 'expense' },
  { id: 'bills', name: 'Contas', icon: '📄', type: 'expense' },
  { id: 'other_expense', name: 'Outros', icon: '📝', type: 'expense' },
];