export interface Card {
  id: number;
  nome_banco: string;
  icone_url: string;
  apelido: string;
  limite_total: number;
  limite_disponivel: number;
  data_fechamento: number;
  data_vencimento: number;
}

export interface Bank {
  nome: string;
  icone: string;
}

export type CardFormValues = Omit<Card, 'id'>;
