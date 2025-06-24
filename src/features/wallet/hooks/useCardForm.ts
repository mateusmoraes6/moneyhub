import { useState } from 'react';
import { CardFormValues } from '../types';
import { supabase } from '../../../supabaseClient';

const initialForm: CardFormValues = {
  nome_banco: '',
  icone_url: '',
  limite_total: 0,
  limite_disponivel: 0,
  data_fechamento: 1,
  data_vencimento: 1,
};

export function useCardForm(initial = initialForm) {
  const [form, setForm] = useState<CardFormValues>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.includes('limite') || name.includes('data') ? Number(value) : value,
    }));
  };

  const setFormValues = (values: CardFormValues) => setForm(values);

  const resetForm = () => setForm(initialForm);

  const submitForm = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([{
          user_id: userId,
          bank_name: form.nome_banco,
          limit: form.limite_total,
          available_limit: form.limite_disponivel,
          closing_day: form.data_fechamento,
          due_day: form.data_vencimento,
        }])
        .select();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cartão');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    handleChange,
    setFormValues,
    resetForm,
    submitForm,
  };
}
