export interface Account {
  id: number;
  nome_banco: string;
  // numero_conta: string;
  icone_url: string;
  saldo: number;
  receitas_mes?: number;
  despesas_mes?: number;
  meta_saldo?: number;
  historico_saldo: Array<{
    data: string;
    valor: number;
    gastos: number;
    receitas: number;
  }>;
  categorias_gastos?: Array<{
    nome: string;
    valor: number;
    percentual: number;
  }>;
  previsao_saldo?: {
    proximo_mes: number;
    tres_meses: number;
  };
} 