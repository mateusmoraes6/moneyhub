import { useState } from 'react';
import { CardFormValues } from '../types';

const initialForm: CardFormValues = {
  nome_banco: '',
  icone_url: '',
  apelido: '',
  limite_total: 0,
  limite_disponivel: 0,
  data_fechamento: 1,
  data_vencimento: 1,
};

export function useCardForm(initial = initialForm) {
  const [form, setForm] = useState<CardFormValues>(initial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.includes('limite') || name.includes('data') ? Number(value) : value,
    }));
  };

  const setFormValues = (values: CardFormValues) => setForm(values);

  const resetForm = () => setForm(initialForm);

  return {
    form,
    handleChange,
    setFormValues,
    resetForm,
  };
}
