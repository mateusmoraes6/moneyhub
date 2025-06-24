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
          nome_banco: card.bank_name,
          icone_url: '',
          limite_total: card.limit,
          limite_disponivel: card.available_limit,
          data_fechamento: card.closing_day,
          data_vencimento: card.due_day,
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
        bank_name: card.nome_banco,
        limit: card.limite_total,
        available_limit: card.limite_disponivel,
        closing_day: card.data_fechamento,
        due_day: card.data_vencimento,
      }])
      .select();
    if (error) setError(error.message);
    else setCards(prev => [...prev, ...(data?.map(card => ({
      id: card.id,
      nome_banco: card.bank_name,
      icone_url: '',
      limite_total: card.limit,
      limite_disponivel: card.available_limit,
      data_fechamento: card.closing_day,
      data_vencimento: card.due_day,
    })) || [])]);
  };

  const editCard = async (id: number, updated: CardFormValues) => {
    const { data, error } = await supabase
      .from('cards')
      .update({
        bank_name: updated.nome_banco,
        limit: updated.limite_total,
        available_limit: updated.limite_disponivel,
        closing_day: updated.data_fechamento,
        due_day: updated.data_vencimento,
      })
      .eq('id', id)
      .select();
    if (error) setError(error.message);
    else setCards(prev =>
      prev.map(card => (card.id === id ? {
        id: data[0].id,
        nome_banco: data[0].bank_name,
        icone_url: '',
        limite_total: data[0].limit,
        limite_disponivel: data[0].available_limit,
        data_fechamento: data[0].closing_day,
        data_vencimento: data[0].due_day,
      } : card))
    );
  };

  const deleteCard = async (id: number) => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id);
    if (error) setError(error.message);
    else setCards(prev => prev.filter(card => card.id !== id));
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
