import { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { Card, CardFormValues } from '../types/card';

export function useWalletCards(userId?: string | null) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setCards(data?.map(card => ({
          id: card.id,
          bank_name: card.bank_name,
          limit: card.limit,
          available_limit: card.available_limit,
          closing_day: card.closing_day,
          due_day: card.due_day,
        })) || []);
        setLoading(false);
      });
  }, [userId]);

  const addCard = async (card: CardFormValues) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('cards')
      .insert([{
        user_id: userId,
        bank_name: card.bank_name,
        limit: card.limit,
        available_limit: card.available_limit,
        closing_day: card.closing_day,
        due_day: card.due_day,
      }])
      .select();
    if (error) setError(error.message);
    else setCards(prev => [...prev, ...(data?.map(card => ({
      id: card.id,
      bank_name: card.bank_name,
      limit: card.limit,
      available_limit: card.available_limit,
      closing_day: card.closing_day,
      due_day: card.due_day,
    })) || [])]);
  };

  const editCard = async (id: number, updated: CardFormValues) => {
    const { data, error } = await supabase
      .from('cards')
      .update({
        bank_name: updated.bank_name,
        limit: updated.limit,
        available_limit: updated.available_limit,
        closing_day: updated.closing_day,
        due_day: updated.due_day,
      })
      .eq('id', id)
      .select();
    if (error) setError(error.message);
    else setCards(prev =>
      prev.map(card => (card.id === id ? {
        id: data[0].id,
        bank_name: data[0].bank_name,
        limit: data[0].limit,
        available_limit: data[0].available_limit,
        closing_day: data[0].closing_day,
        due_day: data[0].due_day,
      } : card))
    );
  };

  const deleteCard = async (id: number) => {
    // 1. Excluir transações vinculadas ao cartão
    const { error: transError } = await supabase
      .from('transactions')
      .delete()
      .eq('card_id', id);

    if (transError) {
      console.error('Error deleting card transactions:', transError);
      setError('Erro ao excluir transações do cartão');
      return;
    }

    // 2. Excluir parcelamentos vinculados ao cartão
    const { error: instError } = await supabase
      .from('installments')
      .delete()
      .eq('card_id', id);

    if (instError) {
      console.error('Error deleting card installments:', instError);
      setError('Erro ao excluir parcelamentos do cartão');
      return;
    }

    // 3. Excluir o cartão
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting card:', error);
      setError(error.message);
    } else {
      setCards(prev => prev.filter(card => card.id !== id));
    }
  };

  return {
    cards,
    loading,
    error,
    addCard,
    editCard,
    deleteCard,
  };
}
