import React, { useState, useRef, useEffect } from 'react';

import { CardFormValues } from '../types/card';

interface CreditCardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: CardFormValues) => void;
  initialValues?: CardFormValues;
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

const CreditCardFormModal: React.FC<CreditCardFormModalProps> = ({ isOpen, onClose, onSave, initialValues }) => {
  const [form, setForm] = useState<CardFormValues>(initialValues || {
    nome_banco: '',
    icone_url: '',
    limite_total: 0,
    limite_disponivel: 0,
    data_fechamento: 1,
    data_vencimento: 15,
  });

  const [showBankSelector, setShowBankSelector] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Foco automático no primeiro campo
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Atualiza o formulário quando initialValues mudar
  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: name.includes('limite') || name.includes('data') ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleCurrencyChange = (name: string, value: string) => {
    const numericValue = Number(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    setForm(prev => ({
      ...prev,
      [name]: numericValue,
    }));
  };

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
    if (!form.nome_banco || form.limite_total === undefined || form.limite_disponivel === undefined || form.data_fechamento === undefined || form.data_vencimento === undefined) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    const valuesToSave = {
        ...form,
        limite_total: form.limite_total ?? 0,
        limite_disponivel: form.limite_disponivel ?? 0,
        data_fechamento: form.data_fechamento ?? 1,
        data_vencimento: form.data_vencimento ?? 1,
    };

    onSave(valuesToSave as CardFormValues);
    onClose();
    setForm({
      nome_banco: '',
      icone_url: '',
      limite_total: 0,
      limite_disponivel: 0,
      data_fechamento: 1,
      data_vencimento: 1,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div 
        ref={modalRef}
        className="bg-gray-900 rounded-xl w-full max-w-[90vw] md:max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {initialValues ? 'Editar Cartão' : 'Adicionar Cartão'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2"
              aria-label="Fechar modal"
            >
              ✕
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
                  <span className="text-gray-400">Ex.: Nubank, Itaú, BB...</span>
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

          {/* Campos de Limite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Limite Total <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="limite_total"
                value={form.limite_total === 0 ? '' : form.limite_total.toString()}
                onChange={handleChange}
                placeholder="Ex.: 0,00"
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Limite Disponível <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="limite_disponivel"
                value={form.limite_disponivel === 0 ? '' : form.limite_disponivel.toString()}
                onChange={handleChange}
                placeholder="Ex.: 0,00"
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Campos de Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Dia de Fechamento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="data_fechamento"
                value={form.data_fechamento === 1 ? '' : form.data_fechamento.toString()}
                onChange={handleChange}
                placeholder="Ex.: 5"
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Dia de Vencimento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="data_vencimento"
                value={form.data_vencimento === 15 ? '' : form.data_vencimento.toString()}
                onChange={handleChange}
                placeholder="Ex.: 15"
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {initialValues ? 'Salvar Alterações' : 'Adicionar Cartão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditCardFormModal;
