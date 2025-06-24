export interface Card {
  id: number;
  nome_banco: string;
  icone_url: string;
  // apelido: string;
  limite_total: number;
  limite_disponivel: number;
  data_fechamento: number;
  data_vencimento: number;
  // is_active?: boolean;
}

export interface Bank {
  nome: string;
  icone: string;
}

export type CardFormValues = {
  nome_banco: string;
  icone_url: string;
  // apelido: string;
  limite_total: number;
  limite_disponivel: number;
  data_fechamento: number;
  data_vencimento: number;
};

export interface CardFromDB {
  id: number;
  user_id: string;
  name: string;
  bank: string;
  limit: number;
  available_limit: number;
  closing_day: number;
  due_day: number;
  // is_active?: boolean;
  created_at: string;
}
