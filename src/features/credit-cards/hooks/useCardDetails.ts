import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../../supabaseClient';
import { useTransactions } from '../../../context/TransactionsContext';

export function useCardDetails(cardId: number) {
  const [card, setCard] = useState<any>(null);
  const [installments, setInstallments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Usar o contexto de transações para ter dados atualizados
  const { transactions: allTransactions } = useTransactions();
  
  // Filtrar transações do cartão específico usando useMemo para evitar recálculos desnecessários
  const transactions = useMemo(() => 
    allTransactions.filter(t => t.card_id === cardId),
    [allTransactions, cardId]
  );

  useEffect(() => {
    if (!cardId) return;

    setLoading(true);

    // Buscar cartão
    const fetchCard = supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .single();

    // Buscar todos os parcelamentos do cartão
    const fetchInstallments = supabase
      .from('installments')
      .select('*')
      .eq('card_id', cardId)
      .order('start_date', { ascending: false });

    Promise.all([fetchCard, fetchInstallments])
      .then(async ([cardRes, instRes]) => {
        setCard(cardRes.data);

        // Montar parcels para cada installment usando as transações atualizadas
        const installmentsWithParcels = (instRes.data || [])
          .map((inst: any) => ({
            ...inst,
            parcels: transactions.filter((t: any) => t.installment_id === inst.id),
          }))
          .filter(inst => inst.parcels.length > 0); // <-- Adicione este filtro

        setInstallments(installmentsWithParcels);
      })
      .finally(() => setLoading(false));
  }, [cardId, transactions]); // Manter transactions como dependência

  return { card, transactions, installments, loading };
}
