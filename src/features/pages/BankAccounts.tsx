import React, { useState } from 'react';
import Header from '../../components/Header';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BankAccount, mockAccounts } from '../wallet/data/mockAccounts';

const BankAccounts: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<BankAccount[]>(mockAccounts);

  const handleDelete = (account: BankAccount) => {
    setAccounts(accounts.filter(a => a.id !== account.id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main className="container mt-12 pt-16 mx-auto px-4 py-6 max-w-3xl">
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

          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="bg-gray-900 rounded-lg p-6 shadow-lg">
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
                        {account.tipo_conta.charAt(0).toUpperCase() + account.tipo_conta.slice(1)} • 
                        Agência: {account.agencia} • 
                        Conta: {account.numero_conta}
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
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(account.saldo)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BankAccounts; 