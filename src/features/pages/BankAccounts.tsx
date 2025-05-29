import React, { useState } from 'react';
import Header from '../../components/Header';
import { Building2, Plus, Edit2, Trash2, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BankAccount, mockAccounts } from '../wallet/data/mockAccounts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AccountDetailsModal from '../../components/AccountDetailsModal';

const BankAccounts: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<BankAccount[]>(mockAccounts);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (account: BankAccount) => {
    setAccounts(accounts.filter(a => a.id !== account.id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getAccountHealth = (_saldo: number, receitas: number, despesas: number) => {
    const ratio = despesas / receitas;
    if (ratio < 0.7) return { color: 'text-emerald-400', icon: TrendingUp, label: 'Excelente' };
    if (ratio < 0.9) return { color: 'text-yellow-400', icon: TrendingUp, label: 'Bom' };
    return { color: 'text-red-400', icon: TrendingDown, label: 'Atenção' };
  };

  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main className="container mt-12 pt-16 mx-auto px-4 py-6 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 rounded-full p-2">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-white">Contas Bancárias</h1>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Conta
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => {
              const health = getAccountHealth(
                account.saldo,
                account.receitas_mes || 0,
                account.despesas_mes || 0
              );
              const HealthIcon = health.icon;

              return (
                <div key={account.id} className="bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={account.icone_url} 
                        alt={account.nome_banco}
                        className="w-12 h-12 rounded-lg bg-white p-0.5"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{account.nome_banco}</h3>
                        <p className="text-gray-400">{account.apelido}</p>
                        <p className="text-sm text-gray-500">
                          {account.tipo_conta.charAt(0).toUpperCase() + account.tipo_conta.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {/* Implementar edição */}}
                        className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(account)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm text-gray-400">Saldo atual</p>
                        <p className={`text-2xl font-bold ${health.color}`}>
                          {formatCurrency(account.saldo)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <HealthIcon className={`w-5 h-5 ${health.color}`} />
                        <span className={`text-sm ${health.color}`}>{health.label}</span>
                      </div>
                    </div>

                    <div className="mt-4 h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={account.historico_saldo || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis
                            dataKey="data"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                          />
                          <YAxis
                             stroke="#9CA3AF"
                             tick={{ fill: '#9CA3AF', fontSize: 10 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: 'none',
                              borderRadius: '0.5rem',
                              color: '#fff',
                              fontSize: 12
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="valor"
                            name="Saldo"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="gastos"
                            name="Gastos"
                            stroke="#EF4444"
                            strokeWidth={2}
                            dot={false}
                          />
                           <Line
                            type="monotone"
                            dataKey="receitas"
                            name="Receitas"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Info className="w-4 h-4" />
                        <span>Última atualização: Hoje</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedAccount(account);
                          setIsModalOpen(true);
                        }}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedAccount && (
          <AccountDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            account={selectedAccount}
          />
        )}
      </main>
    </div>
  );
};

export default BankAccounts; 