import React, { useState } from 'react';
import CardBankSelector from './CardBankSelector';

interface CardFormValues {
  nome_banco: string;
  icone_url: string;
  apelido: string;
  limite_total: number;
  limite_disponivel: number;
  data_fechamento: number;
  data_vencimento: number;
}

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
  // Adicione mais bancos conforme desejar
];

const CreditCardFormModal: React.FC<CreditCardFormModalProps> = ({ isOpen, onClose, onSave, initialValues }) => {
  const [form, setForm] = useState<CardFormValues>(initialValues || {
    nome_banco: '',
    icone_url: '',
    apelido: '',
    limite_total: 0,
    limite_disponivel: 0,
    data_fechamento: 1,
    data_vencimento: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.includes('limite') || name.includes('data') ? Number(value) : value,
    }));
  };

  const handleSelectBank = (bank: typeof bancos[0]) => {
    setForm(prev => ({
      ...prev,
      nome_banco: bank.nome,
      icone_url: bank.icone,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
    setForm({
      nome_banco: '',
      icone_url: '',
      apelido: '',
      limite_total: 0,
      limite_disponivel: 0,
      data_fechamento: 1,
      data_vencimento: 1,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Adicionar Cartão</h2>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Banco</label>
          <CardBankSelector
            bancos={bancos}
            selected={form.nome_banco}
            onSelect={handleSelectBank}
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-300 mb-1">Apelido</label>
          <input
            type="text"
            name="apelido"
            value={form.apelido}
            onChange={handleChange}
            className="w-full rounded-lg bg-gray-800 text-white p-2"
            required
          />
        </div>
        <div className="mb-3 flex gap-2">
          <div className="flex-1">
            <label className="block text-gray-300 mb-1">Limite Total</label>
            <input
              type="number"
              name="limite_total"
              value={form.limite_total}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-800 text-white p-2"
              min={0}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-300 mb-1">Limite Disponível</label>
            <input
              type="number"
              name="limite_disponivel"
              value={form.limite_disponivel}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-800 text-white p-2"
              min={0}
              required
            />
          </div>
        </div>
        <div className="mb-3 flex gap-2">
          <div className="flex-1">
            <label className="block text-gray-300 mb-1">Dia Fechamento</label>
            <input
              type="number"
              name="data_fechamento"
              value={form.data_fechamento}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-800 text-white p-2"
              min={1}
              max={31}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-300 mb-1">Dia Vencimento</label>
            <input
              type="number"
              name="data_vencimento"
              value={form.data_vencimento}
              onChange={handleChange}
              className="w-full rounded-lg bg-gray-800 text-white p-2"
              min={1}
              max={31}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium mt-4 transition"
        >
          Salvar Cartão
        </button>
      </form>
    </div>
  );
};

export default CreditCardFormModal;
