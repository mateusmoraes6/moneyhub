import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BankAccount } from '../features/wallet/data/mockAccounts';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<BankAccount, 'id'>) => void;
}

const bancos = [
  { nome: 'Nubank', icone: '/icons/nubank.svg' },
  { nome: 'Itaú', icone: '/icons/itau.svg' },
  { nome: 'Banco do Brasil', icone: '/icons/bb.svg' },
  { nome: 'C6 Bank', icone: '/icons/c6bank.svg' },
  { nome: 'Santander', icone: '/icons/santander.svg' },
  { nome: 'Bradesco', icone: '/icons/bradesco.svg' },
  { nome: 'Inter', icone: '/icons/inter.svg' },
  { nome: 'Caixa', icone: '/icons/caixa.svg' },
];

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    nome_banco: '',
    icone_url: '',
    saldo: '',
  });
  const [showBankSelector, setShowBankSelector] = useState(false);

  const handleSelectBank = (bank: typeof bancos[0]) => {
    setForm(prev => ({
      ...prev,
      nome_banco: bank.nome,
      icone_url: bank.icone,
    }));
    setShowBankSelector(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome_banco) {
      alert('Por favor, selecione um banco.');
      return;
    }

    const saldoNumerico = form.saldo ? parseFloat(form.saldo.replace(',', '.')) : 0;

    onSave({
      ...form,
      numero_conta: '000000-0',
      saldo: saldoNumerico,
      historico_saldo: [
        {
          data: new Date().toISOString().slice(0, 7),
          valor: saldoNumerico,
          gastos: 0,
          receitas: 0,
        },
      ],
    });
    onClose();
    setForm({
      nome_banco: '',
      icone_url: '',
      saldo: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-[90vw] md:max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Adicionar Conta Bancária</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Seletor de Banco */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Banco <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBankSelector(!showBankSelector)}
                className={`w-full p-4 bg-gray-800 border rounded-lg text-left flex items-center justify-between
                  ${form.nome_banco ? 'border-green-500' : 'border-gray-700'}`}
              >
                {form.nome_banco ? (
                  <div className="flex items-center gap-3">
                    <img src={form.icone_url} alt={form.nome_banco} className="w-6 h-6" />
                    <span className="font-medium text-white">{form.nome_banco}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">Selecione um banco</span>
                )}
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showBankSelector && (
                <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                  <div className="p-2 space-y-2">
                    {bancos.map((bank) => (
                      <button
                        key={bank.nome}
                        type="button"
                        onClick={() => handleSelectBank(bank)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <img src={bank.icone} alt={bank.nome} className="w-6 h-6" />
                        <span className="font-medium text-white">{bank.nome}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Saldo Inicial */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Saldo Inicial
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.saldo}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d,.]/g, '');
                  const parts = value.split(/[,.]/);
                  if (parts.length > 2) return;
                  setForm(prev => ({ ...prev, saldo: value }));
                }}
                placeholder="R$ 0,00"
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Adicionar Conta
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal; 