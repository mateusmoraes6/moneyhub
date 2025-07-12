import { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';

export function useCardDetails(cardId: number) {
  const [card, setCard] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardId) return;

    setLoading(true);

    // Buscar cartão
    const fetchCard = supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .single();

    // Buscar transações do cartão
    const fetchTransactions = supabase
      .from('transactions')
      .select('*')
      .eq('card_id', cardId)
      .order('date', { ascending: false });

    // Buscar parcelamentos do cartão
    const fetchInstallments = supabase
      .from('installments')
      .select('*')
      .eq('card_id', cardId)
      .order('start_date', { ascending: false });

    Promise.all([fetchCard, fetchTransactions, fetchInstallments])
      .then(([cardRes, transRes, instRes]) => {
        setCard(cardRes.data);
        setTransactions(transRes.data || []);
        setInstallments(instRes.data || []);
      })
      .finally(() => setLoading(false));
  }, [cardId]);

  return { card, transactions, installments, loading };
}
