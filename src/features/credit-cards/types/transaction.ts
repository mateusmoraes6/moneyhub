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
