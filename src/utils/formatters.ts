import { format, parseISO } from 'date-fns';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString.split('T')[0]);
  return format(date, 'dd/MM/yyyy');
};