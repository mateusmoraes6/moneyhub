export interface BankAccount {
  id: string;
  nome_banco: string;
  apelido: string;
  tipo_conta: string;
  agencia: string;
  numero_conta: string;
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

export const mockAccounts: BankAccount[] = [
  {
    id: '1',
    nome_banco: 'Nubank',
    icone_url: '/icons/nubank.svg',
    apelido: 'Conta Principal',
    tipo_conta: 'corrente',
    saldo: 5000.50,
    numero_conta: '123456-7',
    agencia: '0001',
    historico_saldo: [
      { data: '2024-01', valor: 1000, gastos: 800, receitas: 1800 },
      { data: '2024-02', valor: 1500, gastos: 900, receitas: 1900 },
      { data: '2024-03', valor: 2000, gastos: 1000, receitas: 2000 },
      { data: '2024-04', valor: 1800, gastos: 1200, receitas: 2000 },
      { data: '2024-05', valor: 2500, gastos: 1100, receitas: 2400 },
    ],
  },
  {
    id: '2',
    nome_banco: 'Itaú',
    icone_url: '/icons/itau.svg',
    apelido: 'Poupança',
    tipo_conta: 'poupanca',
    saldo: 15000.75,
    numero_conta: '987654-3',
    agencia: '1234',
    historico_saldo: [
      { data: '2024-01', valor: 1000, gastos: 800, receitas: 1800 },
      { data: '2024-02', valor: 1500, gastos: 900, receitas: 1900 },
      { data: '2024-03', valor: 2000, gastos: 1000, receitas: 2000 },
      { data: '2024-04', valor: 1800, gastos: 1200, receitas: 2000 },
      { data: '2024-05', valor: 2500, gastos: 1100, receitas: 2400 },
    ],
  },
  {
    id: '3',
    nome_banco: 'C6 Bank',
    icone_url: '/icons/c6bank.svg',
    apelido: 'Investimentos',
    tipo_conta: 'investimento',
    saldo: 25000.00,
    numero_conta: '456789-0',
    agencia: '5678',
    historico_saldo: [
      { data: '2024-01', valor: 1000, gastos: 800, receitas: 1800 },
      { data: '2024-02', valor: 1500, gastos: 900, receitas: 1900 },
      { data: '2024-03', valor: 2000, gastos: 1000, receitas: 2000 },
      { data: '2024-04', valor: 1800, gastos: 1200, receitas: 2000 },
      { data: '2024-05', valor: 2500, gastos: 1100, receitas: 2400 },
    ],
  },
]; 