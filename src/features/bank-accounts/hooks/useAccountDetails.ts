import { useMemo } from 'react';
import { Transaction } from '../../../types';
import { BankAccountSummary } from '../../../types';

const normalizeBankName = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s/g, "");
  };

export function gerarHistoricoSaldo(accountId: number, transactions: Transaction[]) {
  // Filtra transações da conta
  // const transacoesConta = transactions.filter(t => t.account_id === accountId);
  const transacoesConta = transactions.filter(t => String(t.account_id) === String(accountId));

  // Agrupa por mês (ou por dia, se preferir)
  const historicoPorMes: { [mes: string]: { valor: number, gastos: number, receitas: number } } = {};

  transacoesConta.forEach(tx => {
    const mes = tx.date.slice(0, 7); // yyyy-mm
    if (!historicoPorMes[mes]) {
      historicoPorMes[mes] = { valor: 0, gastos: 0, receitas: 0 };
    }
    if (tx.type === 'income') {
      historicoPorMes[mes].receitas += Number(tx.amount);
      historicoPorMes[mes].valor += Number(tx.amount);
    } else {
      historicoPorMes[mes].gastos += Number(tx.amount);
      historicoPorMes[mes].valor -= Number(tx.amount);
    }
  });

  // Transforma em array ordenado
  return Object.entries(historicoPorMes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([data, valores]) => ({
      data,
      ...valores,
    }));
}

export function useAccountDetails(account: BankAccountSummary | null, transactions: Transaction[]) {
  // O useMemo é sempre chamado, mas retorna null se não houver conta
  return useMemo(() => {
    if (!account) return null;

    // Filtra transações da conta
    const accountTransactions = transactions.filter(t => t.account_id === account.id);

    // Últimos 30 dias
    const now = new Date();
    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);

    const receitas_mes = accountTransactions
      .filter(t => t.type === 'income' && new Date(t.date) >= last30Days)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const despesas_mes = accountTransactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= last30Days)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Histórico de saldo (exemplo: saldo ao final de cada mês)
    // Aqui, só um exemplo simples: saldo acumulado por data
    const historico_saldo = [];
    let saldo = 0;
    let receitas = 0;
    let gastos = 0;
    const sorted = [...accountTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const t of sorted) {
      if (t.type === 'income') {
        saldo += Number(t.amount);
        receitas += Number(t.amount);
      } else {
        saldo -= Number(t.amount);
        gastos += Number(t.amount);
      }
      historico_saldo.push({
        data: `${String(new Date(t.date).getMonth() + 1).padStart(2, '0')}/${new Date(t.date).getFullYear()}`,
        valor: saldo,
        gastos,
        receitas,
      });
    }

    return {
      ...account,
      nome_banco: account.bank_name,
      icone_url: `/icons/${normalizeBankName(account.bank_name)}.svg`,
      saldo: account.balance,
      receitas_mes,
      despesas_mes,
      historico_saldo,
    };
  }, [account, transactions]);
}
