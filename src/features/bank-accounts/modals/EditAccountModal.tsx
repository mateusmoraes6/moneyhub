import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Account } from '../types/account';
import { banks } from '../data/banks';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Account) => void;
  account: Account;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({ isOpen, onClose, onSave, account }) => {
  const [form, setForm] = useState({
    nome_banco: account.nome_banco,
    icone_url: account.icone_url,
    saldo: account.saldo.toString(),
  });
  const [showBankSelector, setShowBankSelector] = useState(false);

  useEffect(() => {
    setForm({
      nome_banco: account.nome_banco,
      icone_url: account.icone_url,
      saldo: account.saldo.toString(),
    });
  }, [account]);

  const handleSelectBank = (bank: typeof banks[0]) => {
    setForm(prev => ({
      ...prev,
      nome_banco: bank.name,
      icone_url: bank.icon,
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
      ...account,
      ...form,
      saldo: saldoNumerico,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-[90vw] md:max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Editar Conta Bancária</h2>
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
                    {banks.map((bank) => (
                      <button
                        key={bank.name}
                        type="button"
                        onClick={() => handleSelectBank(bank)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <img src={bank.icon} alt={bank.name} className="w-6 h-6" />
                        <span className="font-medium text-white">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Saldo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Saldo
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
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAccountModal; 