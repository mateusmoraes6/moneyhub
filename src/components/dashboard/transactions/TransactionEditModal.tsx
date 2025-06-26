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

  const mapCardToSelector = (card: any) => ({
    id: card.id,
    nome_banco: card.bank_name,
    icone_url: `/icons/${normalizeBankName(card.bank_name)}.svg`,
    limite_total: card.limit,
    limite_disponivel: card.available_limit,
    data_fechamento: card.closing_day,
    data_vencimento: card.due_day
  });

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
    <div className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700 transition-all duration-300 animate-fadeIn max-w-md mx-auto">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white mb-2">Editar Transação</h2>
        {error && (
          <div className="p-2 text-sm bg-red-900/30 text-red-300 rounded-lg">
            {error}
          </div>
        )}
        <input
          type="text"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
          placeholder="Descrição"
        />
        <input
          type="number"
          value={editedAmount}
          onChange={(e) => setEditedAmount(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
          min="0.01"
          step="0.01"
        />
        <input
          type="date"
          value={editedDate}
          onChange={(e) => setEditedDate(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
        />
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setEditedType('income')}
            className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              editedType === 'income'
                ? 'bg-emerald-900/40 text-emerald-300 border-2 border-emerald-500'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => setEditedType('expense')}
            className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              editedType === 'expense'
                ? 'bg-red-900/40 text-red-300 border-2 border-red-500'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Despesa
          </button>
        </div>
        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Categoria
          </label>
          <select
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
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
          <span className="block text-sm font-medium text-gray-300 mb-2">
            Método de Pagamento
          </span>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={() => setEditedPaymentMethod('pix_debit')}
              className={`p-2 rounded-lg font-medium transition-all duration-300 ${
                editedPaymentMethod === 'pix_debit'
                  ? 'bg-blue-900/40 text-blue-300 border-2 border-blue-500'
                  : 'bg-gray-800 text-gray-300 border-2 border-transparent hover:bg-gray-700'
              }`}
            >
              Pix/Débito
            </button>
            <button
              type="button"
              onClick={() => setEditedPaymentMethod('credit')}
              className={`p-2 rounded-lg font-medium transition-all duration-300 ${
                editedPaymentMethod === 'credit'
                  ? 'bg-purple-900/40 text-purple-300 border-2 border-purple-500'
                  : 'bg-gray-800 text-gray-300 border-2 border-transparent hover:bg-gray-700'
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
              cards={cards.map(mapCardToSelector)}
              selectedId={editedCardId}
              onSelect={setEditedCardId}
            />
          )}
        </div>
        {/* Parcelas (apenas para crédito) */}
        {editedPaymentMethod === 'credit' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Número de Parcelas
            </label>
            <input
              type="number"
              min={1}
              max={24}
              value={editedInstallmentNum}
              onChange={e => setEditedInstallmentNum(Number(e.target.value))}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
            />
          </div>
        )}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            aria-label="Cancelar edição"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30"
            aria-label="Salvar edição"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionEditModal;
