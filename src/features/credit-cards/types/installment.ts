export interface InstallmentParcel {
  date: string;
  amount: number;
  status: 'paid' | 'pending';
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

export interface Fatura {
  valor_total: number;
  valor_pago: number;
  valor_pendente: number;
  data_vencimento: string;
  status: 'em_aberto' | 'pago' | 'atrasado';
}
