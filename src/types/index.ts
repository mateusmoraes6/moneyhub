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
  category_id: string;
  account_id?: number;
  card_id?: number;
  installment_id?: string;
  installment_num?: number;
  status: 'pending' | 'paid' | 'overdue';
  due_date?: string;
  isGrouped?: boolean;
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
  { id: 'travel', name: 'Viagens', icon: '✈️', type: 'expense' },
  { id: 'subscriptions', name: 'Assinaturas e Streaming', icon: '📺', type: 'expense' },
  { id: 'beauty', name: 'Beleza e Estética', icon: '💇', type: 'expense' },
  { id: 'bills', name: 'Contas', icon: '📄', type: 'expense' },
  { id: 'other_expense', name: 'Outros', icon: '📝', type: 'expense' },
];

export interface BankAccountSummary {
  id: number;
  bank_name: string;
  balance: number;
  created_at: string;
}

export interface Card {
  id: number;
  bank_name: string;
  limit: number;
  available_limit: number;
  closing_day: number;
  due_day: number;
  created_at: string;
}

export interface AccountsContextType {
  accounts: BankAccountSummary[];
  cards: Card[];
  addAccount: (account: Omit<BankAccountSummary, 'id' | 'created_at'>) => Promise<void>;
  updateAccount: (accountId: number, accountData: Partial<BankAccountSummary>) => Promise<void>;
  deleteAccount: (accountId: number) => Promise<void>;
  addCard: (card: Omit<Card, 'id' | 'created_at'>) => Promise<void>;
  updateCardLimit: (cardId: number, amount: number) => Promise<void>;
  getAccountById: (id: number) => BankAccountSummary | undefined;
  getCardById: (id: number) => Card | undefined;
  loading: boolean;
  error: string | null;
}