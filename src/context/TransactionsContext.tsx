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
  editTransaction: (id: string, transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  summary: TransactionSummary;
  isAuthenticated: boolean;
  lastAction: string | null;
  setLastAction: React.Dispatch<React.SetStateAction<string | null>>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchTransactions();
      } else {
        setTransactions([]);
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

  const editTransaction = async (id: string, transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to edit transactions');

      const { data, error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => prev.map(item => item.id === id ? (data as Transaction) : item));
    } catch (err) {
      console.error('Error editing transaction:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
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
      lastAction,
      setLastAction,
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