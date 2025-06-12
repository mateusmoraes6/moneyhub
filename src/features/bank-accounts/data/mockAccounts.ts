export interface BankAccountDetails {
  id: string;
  nome_banco: string;
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

export const mockAccounts: BankAccountDetails[] = [
  {
    id: '1',
    nome_banco: 'Caixa',
    icone_url: '/icons/caixa.svg',
    saldo: -2500.00,
    numero_conta: '456789-0',
    receitas_mes: 2800.00, // Receitas últimos 30 dias
    despesas_mes: 3500.00, // Despesas últimos 30 dias
    historico_saldo: [
      { data: '2025-05-01', valor: -1500, gastos: 1200, receitas: 800 },
      { data: '2025-05-07', valor: -1800, gastos: 800, receitas: 500 },
      { data: '2025-05-14', valor: -2000, gastos: 700, receitas: 500 },
      { data: '2025-05-21', valor: -2200, gastos: 500, receitas: 300 },
      { data: '2025-05-28', valor: -2500, gastos: 300, receitas: 0 },
    ]
  },
  {
    id: '2',
    nome_banco: 'Nubank',
    icone_url: '/icons/nubank.svg',
    saldo: 6000.00,
    numero_conta: '123456-7',
    receitas_mes: 5800.00, // Bom nível de receitas
    despesas_mes: 3200.00, // Gastos controlados
    meta_saldo: 20000.00, // Meta de poupança
    historico_saldo: [
      { data: '2025-05-01', valor: 12000, gastos: 800, receitas: 1200 },
      { data: '2025-05-07', valor: 12800, gastos: 700, receitas: 1500 },
      { data: '2025-05-14', valor: 13600, gastos: 600, receitas: 1400 },
      { data: '2025-05-21', valor: 14300, gastos: 500, receitas: 1000 },
      { data: '2025-05-28', valor: 15000, gastos: 600, receitas: 1300 },
    ],
    categorias_gastos: [
      { nome: 'Investimentos', valor: 1500, percentual: 45 },
      { nome: 'Essenciais', valor: 1000, percentual: 30 },
      { nome: 'Lazer', valor: 700, percentual: 25 },
    ],
    previsao_saldo: {
      proximo_mes: 16500,
      tres_meses: 20000,
    }
  },
  {
    id: '3',
    nome_banco: 'Inter',
    icone_url: '/icons/inter.svg',
    saldo: 5000.00, // Saldo estável
    numero_conta: '789012-3',
    receitas_mes: 4000.00, // Receitas equilibradas
    despesas_mes: 4000.00, // Despesas controladas
    meta_saldo: 6000.00,
    historico_saldo: [
      { data: '2025-05-01', valor: 5000, gastos: 800, receitas: 800 },
      { data: '2025-05-07', valor: 5000, gastos: 750, receitas: 750 },
      { data: '2025-05-14', valor: 5000, gastos: 850, receitas: 850 },
      { data: '2025-05-21', valor: 5000, gastos: 800, receitas: 800 },
      { data: '2025-05-28', valor: 5000, gastos: 800, receitas: 800 },
    ],
    categorias_gastos: [
      { nome: 'Essenciais', valor: 2000, percentual: 50 },
      { nome: 'Investimentos', valor: 1200, percentual: 30 },
      { nome: 'Lazer', valor: 800, percentual: 20 },
    ],
    previsao_saldo: {
      proximo_mes: 5000, // Mantém estável
      tres_meses: 5500, // Leve crescimento
    }
  },
  {
    id: '4',
    nome_banco: 'Itaú',
    icone_url: '/icons/itau.svg',
    saldo: 3500.00,
    numero_conta: '987654-3',
    receitas_mes: 5000.00, // Receitas equilibradas
    despesas_mes: 3500.00, // Despesas controladas (70% das receitas)
    meta_saldo: 5000.00,
    historico_saldo: [
      { data: '2025-05-01', valor: 3000, gastos: 800, receitas: 1000 },
      { data: '2025-05-07', valor: 3200, gastos: 750, receitas: 950 },
      { data: '2025-05-14', valor: 3400, gastos: 700, receitas: 900 },
      { data: '2025-05-21', valor: 3300, gastos: 850, receitas: 750 },
      { data: '2025-05-28', valor: 3500, gastos: 800, receitas: 1000 },
    ],
    categorias_gastos: [
      { nome: 'Essenciais', valor: 2000, percentual: 57 },
      { nome: 'Investimentos', valor: 1000, percentual: 29 },
      { nome: 'Lazer', valor: 500, percentual: 14 },
    ],
    previsao_saldo: {
      proximo_mes: 4000,
      tres_meses: 4500,
    }
  }
]; 