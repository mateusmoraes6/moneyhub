import { Card } from '../types';

export const mockCards: Card[] = [
  {
    id: 1,
    nome_banco: 'Nubank',
    icone_url: '/icons/nubank.svg',
    apelido: 'Roxo',
    limite_total: 5000,
    limite_disponivel: 3200,
    data_fechamento: 10,
    data_vencimento: 17,
  },
  {
    id: 2,
    nome_banco: 'Itaú',
    icone_url: '/icons/itau.svg',
    apelido: 'Black',
    limite_total: 8000,
    limite_disponivel: 2000,
    data_fechamento: 5,
    data_vencimento: 12,
  },
];
