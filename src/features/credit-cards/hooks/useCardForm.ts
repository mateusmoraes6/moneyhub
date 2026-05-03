import { useState } from 'react';
import { CardFormValues } from '../types';
import { supabase } from '../../../supabaseClient';

const initialForm: CardFormValues = {
  bank_name: '',
  limit: 0,
  available_limit: 0,
  closing_day: 1,
  due_day: 1,
};

export function useCardForm(initial = initialForm) {
  const [form, setForm] = useState<CardFormValues>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ['limit', 'available_limit', 'closing_day', 'due_day'].includes(name)
        ? Number(value)
        : value,
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
          bank_name: form.bank_name,
          limit: form.limit,
          available_limit: form.available_limit,
          closing_day: form.closing_day,
          due_day: form.due_day,
        }])
        .select();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving card');
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
