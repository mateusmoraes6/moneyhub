import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { Transaction } from '../types';

interface TransactionSummary {
  balance: number;
  income: number;
  expenses: number;
}

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  editTransaction: (id: string, transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>, isGrouped?: boolean) => Promise<void>;
  deleteTransaction: (id: string, isGrouped?: boolean) => Promise<void>;
  loading: boolean;
  error: string | null;
  summary: TransactionSummary;
  isAuthenticated: boolean;
  user: any;
  lastAction: string | null;
  setLastAction: React.Dispatch<React.SetStateAction<string | null>>;
  categories: any[];
  fetchCategories: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
      if (session) {
        fetchTransactions();
        fetchCategories();
      } else {
        setTransactions([]);
        setCategories([]);
        setLoading(false);
      }
    });

    // Check initial auth state
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (user) {
        await fetchTransactions();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error checking user:', err);
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setTransactions([]);
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions((data || []) as Transaction[]);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to add transactions');

      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            ...transaction,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data as Transaction, ...prev]);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const editTransaction = async (id: string, transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>, isGrouped: boolean = false) => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to edit transactions');

      if (isGrouped) {
        // Se for agrupada, não permitir atualização de valor ou data diretamente para evitar corrupção
        // (ex: atualizar todas as parcelas com o valor total da compra)
        // Apenas metadados (categoria, descrição, status, payment_method) são propagados com segurança.
        const { amount, date, ...safeUpdate } = transaction;

        // Se for agrupada, 'id' deve ser interpretado como 'installment_id'
        const { error } = await supabase
          .from('transactions')
          .update(safeUpdate)
          .eq('installment_id', id);

        if (error) throw error;

        // Atualizar TODAS as transações que correspondem a este installment_id no estado local
        // Nota: Mantemos o valor original (item.amount) mas atualizamos os metadados
        setTransactions(prev => prev.map(item =>
          item.installment_id === id
            ? { ...item, ...safeUpdate }
            : item
        ));
      } else {
        const { data, error } = await supabase
          .from('transactions')
          .update(transaction)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        setTransactions(prev => prev.map(item => item.id === id ? (data as Transaction) : item));
      }
    } catch (err) {
      console.error('Error editing transaction:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteTransaction = async (id: string, isGrouped: boolean = false) => {
    try {
      setError(null);

      let query = supabase.from('transactions').delete();

      if (isGrouped) {
        // Se for agrupado, deleta todas as parcelas usando installment_id
        query = query.eq('installment_id', id);
      } else {
        query = query.eq('id', id);
      }

      const { error } = await query;

      if (error) throw error;

      setTransactions(prev => {
        if (isGrouped) {
          return prev.filter(t => t.installment_id !== id);
        }
        return prev.filter(transaction => transaction.id !== id);
      });
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Calculate financial summary from transactions
  const summary = useMemo(() => {
    const initialSummary = { income: 0, expenses: 0, balance: 0 };

    return transactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        acc.income += amount;
        acc.balance += amount;
      } else if (transaction.type === 'expense') {
        acc.expenses += amount;
        acc.balance -= amount;
      }
      return acc;
    }, initialSummary);
  }, [transactions]);

  const fetchCategories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCategories([]);
        return;
      }
      const { data, error } = await (supabase as any)
        .from('categories')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setCategories([]);
    }
  };

  return (
    <TransactionsContext.Provider value={{
      transactions,
      addTransaction,
      editTransaction,
      deleteTransaction,
      loading,
      error,
      summary,
      isAuthenticated,
      user,
      lastAction,
      setLastAction,
      categories,
      fetchCategories,
    }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};