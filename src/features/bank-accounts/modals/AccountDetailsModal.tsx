import React, { useMemo } from 'react';
import { X, AlertCircle, PiggyBank } from 'lucide-react';
import { Account } from '../types/account';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const financialMetrics = useMemo(() => {
    const receitas = account.receitas_mes || 0;
    const despesas = account.despesas_mes || 0;
    const saldo = account.saldo;

    // Taxa de poupança (quanto do dinheiro recebido foi poupado)
    const taxaPoupanca = receitas > 0 ? ((receitas - despesas) / receitas) * 100 : 0;

    // Taxa de endividamento (quanto das receitas vai para despesas)
    const taxaEndividamento = receitas > 0 ? (despesas / receitas) * 100 : 0;

    // Crescimento mensal
    const historico = account.historico_saldo || [];
    const sortedHistory = [...historico].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    const ultimoMes = sortedHistory[sortedHistory.length - 1]?.valor || 0;
    const mesAnterior = sortedHistory[sortedHistory.length - 2]?.valor || 0;
    const crescimentoMensal = mesAnterior !== 0 ? ((ultimoMes - mesAnterior) / mesAnterior) * 100 : 0;

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

  // Função para determinar o status da saúde financeira
  const getSaudeFinanceiraStatus = (taxaEndividamento: number, taxaPoupanca: number, saldo: number) => {
    if (saldo < 0) {
      return {
        status: 'Crítico',
        cor: 'text-red-400',
        descricao: 'Seu saldo está negativo. Priorize o pagamento de dívidas e reduza gastos não essenciais.'
      };
    }
    if (taxaEndividamento > 80) {
      return {
        status: 'Atenção',
        cor: 'text-yellow-400',
        descricao: 'Suas despesas estão muito altas em relação às receitas. Considere revisar seus gastos.'
      };
    }
    if (taxaEndividamento > 60) {
      return {
        status: 'Regular',
        cor: 'text-blue-400',
        descricao: 'Suas despesas estão altas. Procure reduzir gastos não essenciais.'
      };
    }
    if (taxaPoupanca > 20) {
      return {
        status: 'Excelente',
        cor: 'text-emerald-400',
        descricao: 'Você está poupando bem! Continue assim!'
      };
    }
    return {
      status: 'Regular',
      cor: 'text-blue-400',
      descricao: 'Sua situação está estável, mas há espaço para melhorar a poupança.'
    };
  };

  const saudeFinanceira = getSaudeFinanceiraStatus(
    financialMetrics.taxaEndividamento,
    financialMetrics.taxaPoupanca,
    financialMetrics.saldo
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-4 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Detalhes da Conta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Resumo Financeiro */}
          <div className="bg-gray-800 rounded-lg p-3">
            <h3 className="text-lg font-medium text-white mb-3">Resumo Financeiro</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Saldo Atual</span>
                <span className={`font-semibold ${account.saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(account.saldo)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Receitas (30 dias)</span>
                <span className="text-emerald-400">
                  {formatCurrency(financialMetrics.receitas)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Despesas (30 dias)</span>
                <span className="text-red-400">
                  {formatCurrency(financialMetrics.despesas)}
                </span>
              </div>
            </div>
          </div>

          {/* Saúde Financeira */}
          <div className="bg-gray-800 rounded-lg p-3">
            <h3 className="text-lg font-medium text-white mb-3">Saúde Financeira</h3>
            <div className="space-y-4">
              {/* Status Geral */}
              <div className="flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${saudeFinanceira.cor}`} />
                <span className={`font-medium ${saudeFinanceira.cor}`}>
                  {saudeFinanceira.status}
                </span>
              </div>

              {/* Descrição do Status */}
              <p className="text-sm text-gray-400">
                {saudeFinanceira.descricao}
              </p>

              {/* Métricas Detalhadas */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Taxa de Poupança</span>
                  <span className={`${financialMetrics.taxaPoupanca >= 20 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {financialMetrics.taxaPoupanca.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Taxa de Endividamento</span>
                  <span className={`${financialMetrics.taxaEndividamento <= 60 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {financialMetrics.taxaEndividamento.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Crescimento Mensal</span>
                  <span className={`${financialMetrics.crescimentoMensal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {financialMetrics.crescimentoMensal >= 0 ? '+' : ''}{financialMetrics.crescimentoMensal.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Evolução */}
          <div className="bg-gray-800 rounded-lg p-3 md:col-span-2">
            <h3 className="text-lg font-medium text-white mb-3">Evolução do Saldo</h3>
            <div className="h-48 flex items-center justify-center">
              {(!account.historico_saldo || account.historico_saldo.length === 0) ? (
                <span className="text-gray-400 text-center">
                  O gráfico aparecerá aqui após a primeira transação.
                </span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={account.historico_saldo}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="data"
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      name="Saldo"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="gastos"
                      name="Gastos"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: '#EF4444' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="receitas"
                      name="Receitas"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Previsão de Saldo */}
          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Previsão de Saldo</h3>
              <span className="text-sm text-gray-400">Em breve...</span>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <PiggyBank className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">
                Estamos trabalhando em uma funcionalidade que ajudará você a prever seu saldo futuro com base em seus padrões de gastos e receitas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountDetailsModal; 