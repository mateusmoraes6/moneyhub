import React, { useMemo } from 'react';
import { X, AlertCircle, PiggyBank, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Account } from '../types/account';
import AccountChart from '../components/AccountChart/AccountChart';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ isOpen, onClose, account }) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Cálculos de métricas financeiras
  const metrics = useMemo(() => {
    const receitas = account.receitas_mes || 0;
    const despesas = account.despesas_mes || 0;
    const saldo = account.saldo;

    // Taxas
    const taxaPoupanca = receitas > 0 ? ((receitas - despesas) / receitas) * 100 : 0;
    const taxaEndividamento = receitas > 0 ? (despesas / receitas) * 100 : 0;

    // Crescimento
    const historico = account.historico_saldo || [];
    const sortedHistory = [...historico].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    const ultimoMes = sortedHistory[sortedHistory.length - 1]?.valor || 0;
    const mesAnterior = sortedHistory[sortedHistory.length - 2]?.valor || 0;
    const crescimentoMensal = mesAnterior !== 0 ? ((ultimoMes - mesAnterior) / Math.abs(mesAnterior)) * 100 : 0;

    return {
      receitas,
      despesas,
      saldo,
      taxaPoupanca,
      taxaEndividamento,
      crescimentoMensal,
      ultimoMes,
      mesAnterior
    };
  }, [account]);

  const getHealthStatus = (debtRatio: number, savingsRatio: number, balance: number) => {
    if (balance < 0) return { label: 'Crítico', color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Saldo negativo. Priorize pagamento de dívidas.' };
    if (debtRatio > 80) return { label: 'Atenção', color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Despesas muito altas em relação à receita.' };
    if (debtRatio > 60) return { label: 'Regular', color: 'text-yellow-500', bg: 'bg-yellow-500/10', desc: 'Considere reduzir gastos não essenciais.' };
    if (savingsRatio > 20) return { label: 'Excelente', color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Ótima taxa de poupança. Continue assim!' };
    return { label: 'Bom', color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Situação estável, mas pode melhorar.' };
  };

  const health = getHealthStatus(metrics.taxaEndividamento, metrics.taxaPoupanca, metrics.saldo);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur z-10 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {account.nome_banco}
              <span className="text-sm px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-normal">Detalhes</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Card */}
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${health.bg}`}>
                  <AlertCircle className={`w-5 h-5 ${health.color}`} />
                </div>
                <span className="text-gray-400 font-medium">Saúde Financeira</span>
              </div>
              <div>
                <div className={`text-2xl font-bold ${health.color} mb-1`}>{health.label}</div>
                <p className="text-xs text-gray-400 leading-tight">{health.desc}</p>
              </div>
            </div>

            {/* Balanço Mês */}
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-gray-400 font-medium">Fluxo Mensal</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Entradas</span>
                  <span className="text-emerald-400 font-medium">+{formatCurrency(metrics.receitas)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Saídas</span>
                  <span className="text-red-400 font-medium">-{formatCurrency(metrics.despesas)}</span>
                </div>
              </div>
            </div>

            {/* Growth Card */}
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${metrics.crescimentoMensal >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {metrics.crescimentoMensal >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                </div>
                <span className="text-gray-400 font-medium">Crescimento</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-2xl font-bold ${metrics.crescimentoMensal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {metrics.crescimentoMensal > 0 ? '+' : ''}{metrics.crescimentoMensal.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500">vs. mês anterior</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-6">Evolução Patrimonial</h3>
            <div className="h-[300px] w-full">
              {account.historico_saldo && account.historico_saldo.length > 0 ? (
                <AccountChart historico={account.historico_saldo} variant="detailed" height={300} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <span className="mb-2">Sem dados históricos suficientes</span>
                  <span className="text-sm">O gráfico será gerado conforme você adiciona transações.</span>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
              <h4 className="text-base font-medium text-white mb-4">Análise de Poupança</h4>
              <div className="relative pt-4">
                <div className="flex justify-between mb-2 text-sm text-gray-400">
                  <span>Taxa de Poupança</span>
                  <span className="text-white font-medium">{metrics.taxaPoupanca.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(metrics.taxaPoupanca, 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Porcentagem da sua receita que foi mantida ou investida este mês.
                </p>
              </div>
            </div>

            <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
              <h4 className="text-base font-medium text-white mb-4">Comprometimento de Renda</h4>
              <div className="relative pt-4">
                <div className="flex justify-between mb-2 text-sm text-gray-400">
                  <span>Taxa de Endividamento</span>
                  <span className="text-white font-medium">{metrics.taxaEndividamento.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${metrics.taxaEndividamento > 60 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(metrics.taxaEndividamento, 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Porcentagem da sua receita destinada a despesas. Mantenha abaixo de 60%.
                </p>
              </div>
            </div>
          </div>

          {/* Forecast Placeholder */}
          <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-indigo-500/20 text-center">
            <div className="flex items-center justify-center gap-3 mb-2 text-indigo-400">
              <PiggyBank className="w-6 h-6" />
              <h3 className="text-lg font-medium">Previsão Inteligente</h3>
            </div>
            <p className="text-indigo-200/60 text-sm max-w-lg mx-auto">
              Em breve, nossa IA analisará seus padrões para prever seu saldo nos próximos 3 meses..
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsModal;