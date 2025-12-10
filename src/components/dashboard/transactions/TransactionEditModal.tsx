import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Transaction, PaymentMethod, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../../types';
import { useAccounts } from '../../../context/AccountsContext';
import AccountSelector from '../../../features/bank-accounts/components/AccountSelector/AccountSelector';
import CardSelector from '../../../features/wallet/components/CardSelector/CardSelector';

interface TransactionEditModalProps {
  transaction: Transaction;
  onSave: (updated: Partial<Transaction>) => void;
  onCancel: () => void;
}

const TransactionEditModal: React.FC<TransactionEditModalProps> = ({
  transaction,
  onSave,
  onCancel,
}) => {
  const { accounts, cards } = useAccounts();

  // Normalização do nome do banco para exibir ícones
  const normalizeBankName = (name: string) => {
    if (!name) return "";
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s/g, "");
  };

  // Mapeamento para os selectors
  const mapAccountToSelector = (account: any) => ({
    id: account.id,
    nome_banco: account.bank_name,
    icone_url: `/icons/${normalizeBankName(account.bank_name)}.svg`,
    saldo: account.balance,
    historico_saldo: []
  });

  // CardSelector espera um array de objetos Card reais
  // Apenas garantimos que o objeto esteja no formato certo, se necessário
  // Como 'cards' do contexto já são do tipo Card[], não precisamos remapear propriedades para português
  // a menos que o componente CardSelector espere nomes diferentes (mas pelo código ele usa Card também)
  // Vamos apenas passar 'cards' direto no JSX, sem mapCardToSelector, ou um map identidade se precisar filtrar.


  // Estados locais para edição
  const [editedDescription, setEditedDescription] = useState(transaction.description);
  const [editedAmount, setEditedAmount] = useState(transaction.amount.toString());
  const [editedType, setEditedType] = useState<TransactionType>(transaction.type);
  const [editedDate, setEditedDate] = useState(transaction.date.split('T')[0]);
  const [editedPaymentMethod, setEditedPaymentMethod] = useState<PaymentMethod>(transaction.payment_method || 'pix_debit');
  const [editedCategory, setEditedCategory] = useState(transaction.category_id || '');
  const [editedAccountId, setEditedAccountId] = useState<number | undefined>(transaction.account_id);
  const [editedCardId, setEditedCardId] = useState<number | undefined>(transaction.card_id);
  const [editedInstallmentNum, setEditedInstallmentNum] = useState<number>(transaction.installment_num || 1);

  const [error, setError] = useState<string | null>(null);

  // Reset conta/cartão ao trocar método de pagamento
  useEffect(() => {
    if (editedPaymentMethod === 'pix_debit') {
      setEditedCardId(undefined);
      setEditedInstallmentNum(1);
    } else {
      setEditedAccountId(undefined);
    }
  }, [editedPaymentMethod]);

  // Validação e envio
  const handleSave = () => {
    const amountValue = parseFloat(editedAmount);
    if (!editedDescription.trim()) {
      setError('Por favor, informe uma descrição');
      return;
    }
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Por favor, informe um valor válido maior que zero');
      return;
    }
    if (!editedDate) {
      setError('Por favor, selecione uma data');
      return;
    }
    if (!editedCategory) {
      setError('Por favor, selecione uma categoria');
      return;
    }
    if (editedPaymentMethod === 'credit' && editedCardId === undefined) {
      setError('Por favor, selecione um cartão');
      return;
    }
    if (editedPaymentMethod === 'pix_debit' && editedAccountId === undefined) {
      setError('Por favor, selecione uma conta');
      return;
    }

    setError(null);
    onSave({
      description: editedDescription.trim(),
      amount: amountValue,
      type: editedType,
      date: editedDate,
      payment_method: editedPaymentMethod,
      category_id: editedCategory,
      account_id: editedPaymentMethod === 'pix_debit' ? editedAccountId : undefined,
      card_id: editedPaymentMethod === 'credit'
        ? (editedCardId !== undefined ? Number(editedCardId) : undefined)
        : undefined,
      installment_num: editedPaymentMethod === 'credit' ? editedInstallmentNum : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-gray-800">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Editar Transação</h2>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 text-sm bg-red-900/40 text-red-200 border border-red-500/50 rounded-lg flex items-center gap-2">
              <span className="block h-2 w-2 rounded-full bg-red-400"></span>
              {error}
            </div>
          )}

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
            <input
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="Ex: Supermercado"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                <input
                  type="number"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Data</label>
              <input
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de Transação</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEditedType('income')}
                className={`py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${editedType === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
                  }`}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => setEditedType('expense')}
                className={`py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${editedType === 'expense'
                  ? 'bg-red-500/20 text-red-400 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
                  }`}
              >
                Despesa
              </button>
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Categoria</label>
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            >
              <option value="">Selecione uma categoria</option>
              {(editedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Método de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Método de Pagamento</label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setEditedPaymentMethod('pix_debit')}
                className={`py-3 rounded-lg text-sm font-medium transition-all duration-300 ${editedPaymentMethod === 'pix_debit'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
                  }`}
              >
                Pix/Débito
              </button>
              <button
                type="button"
                onClick={() => setEditedPaymentMethod('credit')}
                className={`py-3 rounded-lg text-sm font-medium transition-all duration-300 ${editedPaymentMethod === 'credit'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700'
                  }`}
              >
                Crédito
              </button>
            </div>

            {/* Seleção de Conta/Cartão */}
            {editedPaymentMethod === 'pix_debit' ? (
              <AccountSelector
                accounts={accounts.map(mapAccountToSelector)}
                selectedId={editedAccountId}
                onSelect={id => setEditedAccountId(id)}
              />
            ) : (
              <CardSelector
                cards={cards}
                selectedId={editedCardId}
                onSelect={setEditedCardId}
              />
            )}
          </div>

          {/* Parcelas (apenas para crédito) */}
          {editedPaymentMethod === 'credit' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Número de Parcelas
              </label>
              <input
                type="number"
                min={1}
                max={24}
                value={editedInstallmentNum}
                onChange={e => setEditedInstallmentNum(Number(e.target.value))}
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionEditModal;
