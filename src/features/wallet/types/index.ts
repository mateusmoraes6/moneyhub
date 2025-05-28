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

export interface Fatura {
  valor_total: number;
  valor_pago: number;
  valor_pendente: number;
  data_vencimento: string;
  status: 'em_aberto' | 'pago' | 'atrasado';
}

export interface Parcelamento {
  id: number;
  descricao: string;
  valor_total: number;
  valor_parcela: number;
  parcelas_total: number;
  parcela_atual: number;
  data_primeira_parcela: string;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  parcelado: boolean;
  parcelamento_id?: number;
}

export interface FiltrosTransacao {
  categoria?: string;
  data_inicio?: string;
  data_fim?: string;
  valor_min?: number;
  valor_max?: number;
}
