import React from 'react';
import { X, TrendingUp, Target, PieChart } from 'lucide-react';
import { BankAccount } from '../features/wallet/data/mockAccounts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ isOpen, onClose, account }) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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
                <span className="text-emerald-400 font-semibold">
                  {formatCurrency(account.saldo)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Receitas (30 dias)</span>
                <span className="text-emerald-400">
                  {formatCurrency(account.receitas_mes || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Despesas (30 dias)</span>
                <span className="text-red-400">
                  {formatCurrency(account.despesas_mes || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Saúde Financeira */}
          <div className="bg-gray-800 rounded-lg p-3">
            <h3 className="text-lg font-medium text-white mb-3">Saúde Financeira</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">Crescimento Mensal</span>
                <span className="ml-auto text-emerald-400">+5.2%</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Meta de Saldo</span>
                <span className="ml-auto text-blue-400">
                  {formatCurrency(account.meta_saldo || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Gráfico de Evolução */}
          <div className="bg-gray-800 rounded-lg p-3 md:col-span-2">
            <h3 className="text-lg font-medium text-white mb-3">Evolução do Saldo</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={account.historico_saldo || []}>
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
            </div>
          </div>

          {/* Categorias de Gastos */}
          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2">
            <h3 className="text-lg font-medium text-white mb-4">Gastos por Categoria</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {account.categorias_gastos?.map((categoria, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <PieChart className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-sm">{categoria.nome}</span>
                  </div>
                  <p className="text-emerald-400 font-semibold">
                    {formatCurrency(categoria.valor)}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {categoria.percentual}% do total
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Previsão de Saldo */}
          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2">
            <h3 className="text-lg font-medium text-white mb-4">Previsão de Saldo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Próximo mês</span>
                <span className="text-emerald-400">
                  {formatCurrency(account.previsao_saldo?.proximo_mes || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Em 3 meses</span>
                <span className="text-emerald-400">
                  {formatCurrency(account.previsao_saldo?.tres_meses || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsModal; 