import { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { Account } from '../types/account';

export const useBankAccounts = (userId: string) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar contas do usuário
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setAccounts(data?.map(acc => ({
          id: acc.id,
          nome_banco: acc.bank_name,
          numero_conta: '',
          icone_url: '',
          saldo: acc.balance,
          historico_saldo: []
        })) || []);
        setLoading(false);
      });
  }, [userId]);

  // Adicionar conta
  const handleAddAccount = async (newAccount: Omit<Account, 'id'>) => {
    const { data, error } = await supabase
      .from('accounts')
      .insert([{
        user_id: userId,
        // name: newAccount.nome_banco,
        bank_name: newAccount.nome_banco,
        balance: newAccount.saldo,
        type: 'checking',
      }])
      .select();
    if (error) setError(error.message);
    else setAccounts(prev => [...prev, ...(data?.map(acc => ({
      id: acc.id,
      nome_banco: acc.bank_name,
      numero_conta: '',
      icone_url: '',
      saldo: acc.balance,
      historico_saldo: []
    })) || [])]);
  };

  // Atualizar conta
  const handleUpdateAccount = async (updatedAccount: Account) => {
    const { data, error } = await supabase
      .from('accounts')
      .update({
        // name: updatedAccount.nome_banco,
        bank_name: updatedAccount.nome_banco,
        balance: updatedAccount.saldo,
        type: 'checking',
      })
      .eq('id', updatedAccount.id)
      .select();
    if (error) setError(error.message);
    else setAccounts(prev =>
      prev.map(acc => (acc.id === updatedAccount.id ? {
        id: data[0].id,
        nome_banco: data[0].bank_name,
        numero_conta: '',
        icone_url: '',
        saldo: data[0].balance,
        historico_saldo: []
      } : acc))
    );
  };

  // Remover conta
  const handleDelete = async (account: Account) => {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', account.id);
    if (error) setError(error.message);
    else setAccounts(prev => prev.filter(a => a.id !== account.id));
  };

  return {
    accounts,
    loading,
    error,
    handleAddAccount,
    handleUpdateAccount,
    handleDelete,
  };
};
