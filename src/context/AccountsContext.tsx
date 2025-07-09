import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Card, AccountsContextType, BankAccountSummary } from '../types';
import { supabase } from '../supabaseClient';
import { useTransactions } from './TransactionsContext'; // ajuste o caminho se necessário

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<BankAccountSummary[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { transactions } = useTransactions();

  // Buscar contas do Supabase
  const fetchAccounts = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAccounts([]);
        return;
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(
        (data || []).map(acc => ({
          ...acc,
          bank_name: acc.bank_name,
        }))
      );
    } catch (err) {
      console.error('Erro ao buscar contas:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar contas');
    }
  }, []);

  // Buscar cartões do Supabase
  const fetchCards = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCards([]);
        return;
      }

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      console.error('Erro ao buscar cartões:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar cartões');
    }
  }, []);

  // Carregar dados quando o usuário estiver autenticado
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        fetchAccounts();
        fetchCards();
      } else {
        setAccounts([]);
        setCards([]);
      }
      setLoading(false);
    });

    // Verificar estado inicial
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchAccounts();
        await fetchCards();
      }
      setLoading(false);
    };
    
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAccounts, fetchCards]);

  // Adicionar conta
  const addAccount = useCallback(async (accountData: Omit<BankAccountSummary, 'id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('accounts')
        .insert([{
          // name: accountData.name,
          bank_name: accountData.bank_name,
          balance: accountData.balance,
          // type: accountData.type,
          user_id: user.id,
        }]);

      if (error) throw error;
      await fetchAccounts();
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erro ao adicionar conta:', err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        console.error('Erro ao adicionar conta:', (err as any).message);
      } else {
        console.error('Erro ao adicionar conta:', JSON.stringify(err));
      }
      throw err;
    }
  }, [fetchAccounts]);

  // Adicionar cartão
  const addCard = useCallback(async (cardData: Omit<Card, 'id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('cards')
        .insert([{
          ...cardData,
          user_id: user.id,
        }]);

      if (error) throw error;
      await fetchCards();
    } catch (err) {
      console.error('Erro ao adicionar cartão:', err);
      throw err;
    }
  }, [fetchCards]);

  // Atualizar limite do cartão
  const updateCardLimit = useCallback(async (cardId: number, amount: number) => {
    try {
      // Buscar o cartão atual
      const { data: card, error: fetchError } = await supabase
        .from('cards')
        .select('available_limit')
        .eq('id', cardId)
        .single();

      if (fetchError) throw fetchError;

      const newLimit = (card?.available_limit ?? 0) - amount;

      const { error } = await supabase
        .from('cards')
        .update({ available_limit: newLimit })
        .eq('id', cardId);

      if (error) throw error;

      setCards(prev => prev.map(card =>
        card.id === cardId
          ? { ...card, available_limit: newLimit }
          : card
      ));
    } catch (err) {
      console.error('Erro ao atualizar limite do cartão:', err);
      throw err;
    }
  }, []);

  // Buscar conta por ID
  const getAccountById = useCallback((id: number) => {
    return accounts.find(account => account.id === id);
  }, [accounts]);

  // Buscar cartão por ID
  const getCardById = useCallback((id: number) => {
    return cards.find(card => card.id === id);
  }, [cards]);

  // Atualizar conta
  const updateAccount = useCallback(async (accountId: number, accountData: Partial<BankAccountSummary>) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .update(accountData)
        .eq('id', accountId);

      if (error) throw error;
      await fetchAccounts();
    } catch (err) {
      console.error('Erro ao atualizar conta:', err);
      throw err;
    }
  }, [fetchAccounts]);

  // Deletar conta
  const deleteAccount = useCallback(async (accountId: number) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;
      await fetchAccounts();
    } catch (err) {
      console.error('Erro ao deletar conta:', err);
      throw err;
    }
  }, [fetchAccounts]);

  const totalBalance = accounts.reduce((acc, account) => acc + Number(account.balance), 0);

  const enrichedAccounts = useMemo(() => {
    const now = new Date();
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);

    return accounts.map(account => {
      // Filtra transações dessa conta
      const accountTransactions = transactions.filter(
        t => t.account_id === account.id
      );

      // Receitas e despesas dos últimos 30 dias
      const receitas_mes = accountTransactions
        .filter(t => t.type === 'income' && new Date(t.date) >= last30Days)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const despesas_mes = accountTransactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= last30Days)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Histórico mensal (exemplo: últimos 12 meses)
      const historico_saldo: { data: string, valor: number, receitas: number, gastos: number }[] = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7);

        const receitas = accountTransactions
          .filter(t => t.type === 'income' && t.date.slice(0, 7) === monthKey)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const gastos = accountTransactions
          .filter(t => t.type === 'expense' && t.date.slice(0, 7) === monthKey)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        // Saldo acumulado até o fim do mês
        const saldo = account.balance // ou calcule a partir das transações, se preferir
        historico_saldo.unshift({
          data: monthKey,
          valor: saldo, // pode ser ajustado para saldo acumulado até o mês
          receitas,
          gastos
        });
      }

      return {
        ...account,
        receitas_mes,
        despesas_mes,
        historico_saldo
      };
    });
  }, [accounts, transactions]);

  const value = {
    accounts: enrichedAccounts,
    cards,
    addAccount,
    updateAccount,
    deleteAccount,
    addCard,
    updateCardLimit,
    getAccountById,
    getCardById,
    loading,
    error,
    totalBalance
  };

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (context === undefined) {
    throw new Error('useAccounts deve ser usado dentro de um AccountsProvider');
  }
  return context;
};
