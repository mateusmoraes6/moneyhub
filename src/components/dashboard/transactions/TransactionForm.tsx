import React, { useState, useEffect } from 'react';
import { PlusCircle, LogIn, X, AlertCircle } from 'lucide-react';
import { useTransactions } from '../../../context/TransactionsContext';
import { useAccounts } from '../../../context/AccountsContext';
import { TransactionType, PaymentMethod, INCOME_CATEGORIES, EXPENSE_CATEGORIES, Card, BankAccountSummary } from '../../../types';
import AccountSelector from '../../../features/bank-accounts/components/AccountSelector/AccountSelector';
import CardSelector from '../../../features/wallet/components/CardSelector/CardSelector';

const TransactionForm: React.FC = () => {
  const { addTransaction, isAuthenticated } = useTransactions();
  const { accounts, cards, updateCardLimit, updateAccount } = useAccounts();

  // Função auxiliar para normalizar o nome do banco
  const normalizeBankName = (name: string) => {
    return name
      .normalize("NFD") // Normaliza para decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
      .toLowerCase() // Converte para minúsculas
      .replace(/\s/g, ""); // Remove todos os espaços em branco
  };

  const mapAccountToSelector = (account: BankAccountSummary) => ({
    id: account.id,
    nome_banco: account.bank_name,
    // numero_conta: account.type,
    icone_url: `/icons/${normalizeBankName(account.bank_name)}.svg`,
    saldo: account.balance,
    historico_saldo: []
  });

  const mapCardToSelector = (card: Card) => ({
    id: card.id,
    nome_banco: card.bank_name,
    icone_url: `/icons/${normalizeBankName(card.bank_name)}.svg`,
    // apelido: card.name,
    limite_total: card.limit,
    limite_disponivel: card.available_limit,
    data_fechamento: card.closing_day,
    data_vencimento: card.due_day
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix_debit');
  const [category, setCategory] = useState('');
  const [accountId, setAccountId] = useState<number | undefined>(undefined);
  const [cardId, setCardId] = useState<number | string | undefined>(undefined);
  const [installmentId, setInstallmentId] = useState<string | undefined>(undefined);
  const [installmentNum, setInstallmentNum] = useState<number>(1);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('income');
    setDate(new Date().toISOString().split('T')[0]);
    setError(null);
    setPaymentMethod('pix_debit');
    setCategory('');
    setAccountId(undefined);
    setCardId(undefined);
    setInstallmentId(undefined);
    setInstallmentNum(1);
  };

  useEffect(() => {
    if (paymentMethod === 'pix_debit') {
      setCardId(undefined);
      setInstallmentNum(1);
    } else {
      setAccountId(undefined);
    }
  }, [paymentMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!description.trim()) {
      setError('Por favor, informe uma descrição');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Por favor, informe um valor válido maior que zero');
      return;
    }
    
    if (!date) {
      setError('Por favor, selecione uma data');
      return;
    }
    
    if (!category) {
      setError('Por favor, selecione uma categoria');
      return;
    }

    // Validações específicas para cartão de crédito
    if (paymentMethod === 'credit') {
      if (cardId === undefined) {
        setError('Por favor, selecione um cartão');
        return;
      }

      const selectedCard = cards.find(card => card.id == cardId);
      if (!selectedCard) {
        setError('Cartão não encontrado');
        return;
      }

      if (amountValue > selectedCard.available_limit) {
        setError('Valor excede o limite disponível do cartão');
        return;
      }
    }

    // Validações para conta
    if (paymentMethod === 'pix_debit' && accountId === undefined) {
      setError('Por favor, selecione uma conta');
      return;
    }

    try {
      // Add transaction
      await addTransaction({
        description: description.trim(),
        amount: amountValue,
        type,
        date,
        payment_method: paymentMethod,
        category_id: category,
        account_id: paymentMethod === 'pix_debit' ? (accountId as number | undefined) : undefined,
        card_id: paymentMethod === 'credit' ? (cardId as number | undefined) : undefined,
        installment_id: paymentMethod === 'credit' ? installmentId : undefined,
        installment_num: paymentMethod === 'credit' ? installmentNum : undefined,
        status: 'pending',
      });

      // Atualizar limite do cartão se for transação de crédito
      if (paymentMethod === 'credit' && typeof cardId === 'number') {
        await updateCardLimit(cardId, amountValue);
      }

      if (paymentMethod === 'pix_debit' && accountId) {
        const selectedAccount = accounts.find(acc => acc.id === Number(accountId));
        if (selectedAccount) {
          const newBalance = type === 'expense'
            ? selectedAccount.balance - amountValue
            : selectedAccount.balance + amountValue;
          await updateAccount(selectedAccount.id, { balance: newBalance });
        }
      }

      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao adicionar transação');
    }
  };

  const openModal = () => {
    if (isAuthenticated) {
      setIsModalOpen(true);
    }
  };

  const tryToCloseModal = () => {
    const hasData = description || amount || type !== 'income' || date !== new Date().toISOString().split('T')[0];
    
    if (hasData) {
      // Abrir modal de confirmação
      setIsConfirmModalOpen(true);
    } else {
      setIsModalOpen(false);
      resetForm();
    }
  };

  const confirmClose = () => {
    setIsConfirmModalOpen(false);
    setIsModalOpen(false);
    resetForm();
  };

  const cancelClose = () => {
    setIsConfirmModalOpen(false);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen && !isConfirmModalOpen) {
        tryToCloseModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen, isConfirmModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      // Foque no primeiro input quando o modal abrir
      const firstInput = document.getElementById('description');
      if (firstInput) firstInput.focus();
    }
  }, [isModalOpen]);

  if (!isAuthenticated) {
    return (
      <section className="w-full bg-gray-900 rounded-xl shadow-sm p-6 transition-all duration-300">
        <div className="text-center space-y-4">
          <LogIn className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-lg font-semibold text-white">Faça login para adicionar transações</h2>
          <p className="text-gray-400 text-sm">
            Você precisa estar autenticado para registrar suas transações
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Botão para abrir o modal de nova transação */}
      <button
        onClick={openModal}
        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 h-[50px]" // Altura fixa para corresponder ao outro botão
      >
        <PlusCircle className="w-5 h-5" />
        <span>Nova Transação</span>
      </button>

      {/* Modal para adicionar nova transação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-gray-900 rounded-xl w-full max-w-md max-h-[90vh] flex flex-col animate-fadeInUp">
            {/* Cabeçalho da modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Nova Transação</h2>
              <button 
                onClick={tryToCloseModal}
                className="p-1 text-gray-400 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulário */}
            <div className="p-4 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-2 text-sm bg-red-900/30 text-red-300 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    id="description"
                    placeholder="Ex: Salário, Mercado, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    id="amount"
                    placeholder="0,00"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-300 mb-2">Tipo</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`py-3 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                        type === 'income'
                          ? 'bg-emerald-900/40 text-emerald-300 border-2 border-emerald-500'
                          : 'bg-gray-800 text-gray-300 border-2 border-transparent hover:bg-gray-700'
                      }`}
                    >
                      Receita
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`py-3 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                        type === 'expense'
                          ? 'bg-red-900/40 text-red-300 border-2 border-red-500'
                          : 'bg-gray-800 text-gray-300 border-2 border-transparent hover:bg-gray-700'
                      }`}
                    >
                      Despesa
                    </button>
                  </div>
                </div>
                
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  >
                    <option value="">Selecione uma categoria</option>
                    {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
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
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix_debit')}
                      className={`py-3 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                        paymentMethod === 'pix_debit'
                          ? 'bg-blue-900/40 text-blue-300 border-2 border-blue-500'
                          : 'bg-gray-800 text-gray-300 border-2 border-transparent hover:bg-gray-700'
                      }`}
                    >
                      Pix/Débito
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit')}
                      className={`py-3 rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                        paymentMethod === 'credit'
                          ? 'bg-purple-900/40 text-purple-300 border-2 border-purple-500'
                          : 'bg-gray-800 text-gray-300 border-2 border-transparent hover:bg-gray-700'
                      }`}
                    >
                      Crédito
                    </button>
                  </div>

                  {/* Seleção de Conta/Cartão */}
                  {paymentMethod === 'pix_debit' ? (
                    <AccountSelector
                      accounts={accounts.map(mapAccountToSelector)}
                      selectedId={accountId}
                      onSelect={id => setAccountId(id)}
                    />
                  ) : (
                    <CardSelector
                      cards={cards.map(mapCardToSelector)}
                      selectedId={typeof cardId === 'string' ? parseInt(cardId) : cardId}
                      onSelect={setCardId}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Adicionar Transação</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-sm p-6 animate-fadeInUp">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-900/30 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Descartar alterações?</h3>
                <p className="text-gray-400 mb-4">
                  Tem certeza que deseja fechar? Os dados não salvos serão perdidos.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={cancelClose}
                    className="flex-1 py-2 px-4 border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors"
                  >
                    Não
                  </button>
                  <button
                    onClick={confirmClose}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Sim</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionForm;