import React, { useState, useEffect } from 'react';
import { PlusCircle, LogIn, X, AlertCircle } from 'lucide-react';
import CategorySelector from './CategorySelector';
import { useTransactions } from '../../../context/TransactionsContext';
import { useAccounts } from '../../../context/AccountsContext';
import { TransactionType, PaymentMethod, BankAccountSummary } from '../../../types';
import AccountSelector from '../../../features/bank-accounts/components/AccountSelector/AccountSelector';
import CardSelector from '../../../features/wallet/components/CardSelector/CardSelector';
import { supabase } from '../../../supabaseClient';

const TransactionForm: React.FC = () => {
  const { addTransaction, isAuthenticated } = useTransactions();
  const { accounts, cards, updateCardLimit, updateAccount } = useAccounts();

  const normalizeBankName = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s/g, "");
  };

  const mapAccountToSelector = (account: BankAccountSummary) => ({
    id: account.id,
    nome_banco: account.bank_name,
    icone_url: `/icons/${normalizeBankName(account.bank_name)}.svg`,
    saldo: account.balance,
    historico_saldo: []
  });

  // const mapCardToSelector = (card: Card) => ({
  //   id: card.id,
  //   nome_banco: card.bank_name,
  //   icone_url: `/icons/${normalizeBankName(card.bank_name)}.svg`,
  //   limite_total: card.limit,
  //   limite_disponivel: card.available_limit,
  //   data_fechamento: card.closing_day,
  //   data_vencimento: card.due_day
  // });

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
  const [cardId, setCardId] = useState<number | undefined>(undefined);
  const [installmentNum, setInstallmentNum] = useState<number>(1);
  const [showInstallmentOptions, setShowInstallmentOptions] = useState(false);

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
    setInstallmentNum(1);
    setShowInstallmentOptions(false);
  };

  useEffect(() => {
    if (paymentMethod === 'pix_debit') {
      setCardId(undefined);
      setInstallmentNum(1);
      setShowInstallmentOptions(false);
    } else {
      setAccountId(undefined);
      setShowInstallmentOptions(true);
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

      const limitToCheck = selectedCard.available_limit !== undefined ? selectedCard.available_limit : selectedCard.limit;
      if (amountValue > limitToCheck) {
        setError('Valor excede o limite disponível do cartão');
        return;
      }

      if (installmentNum < 1 || installmentNum > 24) {
        setError('Número de parcelas deve estar entre 1 e 24');
        return;
      }
    }

    // Validações para conta
    if (paymentMethod === 'pix_debit' && accountId === undefined) {
      setError('Por favor, selecione uma conta');
      return;
    }

    try {
      // Se for transação de crédito e parcelada, criar o parcelamento primeiro
      let newInstallmentId: string | undefined = undefined;

      if (paymentMethod === 'credit' && installmentNum > 1) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data: installmentData, error: installmentError } = await supabase
          .from('installments')
          .insert([{
            user_id: user.id,
            total: amountValue,
            num_installments: installmentNum,
            start_date: date,
            card_id: cardId as number,
            description: description.trim(),
          }])
          .select()
          .single();

        if (installmentError) throw installmentError;
        newInstallmentId = installmentData.id;
      }

      // Logic to add transaction(s)
      // Logic to add transaction(s)
      const today = new Date().toLocaleDateString('en-CA');
      const isFuture = date > today;
      const initialStatus = isFuture ? 'pending' : 'paid';

      if (paymentMethod === 'credit' && installmentNum > 1 && newInstallmentId) {
        // Split into N transactions
        const baseAmount = Math.floor((amountValue / installmentNum) * 100) / 100;
        const firstAmount = Number((amountValue - (baseAmount * (installmentNum - 1))).toFixed(2));

        for (let i = 0; i < installmentNum; i++) {
          const instDate = new Date(date);
          // Add months correctly handling year turnover
          instDate.setMonth(instDate.getMonth() + i);

          const instDateString = instDate.toISOString().split('T')[0];
          const isInstFuture = instDateString > today;
          const instStatus = isInstFuture ? 'pending' : 'paid';

          await addTransaction({
            description: `${description.trim()} (${i + 1}/${installmentNum})`,
            amount: i === 0 ? firstAmount : baseAmount,
            type,
            date: instDateString,
            payment_method: paymentMethod,
            category_id: category,
            account_id: undefined,
            card_id: cardId as number,
            installment_id: newInstallmentId,
            installment_num: i + 1,
            status: instStatus,
          });
        }
      } else {
        // Single transaction (Debit, or Credit 1x)
        await addTransaction({
          description: description.trim(),
          amount: amountValue,
          type,
          date,
          payment_method: paymentMethod,
          category_id: category,
          account_id: paymentMethod === 'pix_debit' ? (accountId as number | undefined) : undefined,
          card_id: paymentMethod === 'credit' ? (cardId as number | undefined) : undefined,
          installment_id: newInstallmentId,
          installment_num: paymentMethod === 'credit' ? 1 : undefined,
          status: initialStatus,
        });
      }

      // Atualizar limite do cartão se for transação de crédito (Consome o TOTAL imediatamente)
      if (paymentMethod === 'credit' && typeof cardId === 'number') {
        await updateCardLimit(cardId, amountValue);
      }

      // Atualizar saldo da conta APENAS se for Pix/Débito E se já estiver efetivada (não futura)
      if (paymentMethod === 'pix_debit' && accountId && initialStatus === 'paid') {
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
      console.error(err);
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

  const { transactions } = useTransactions();

  // Recalcula o limite disponível de cada cartão
  const cardsWithAvailableLimit = cards.map(card => {
    const limitTotal = Number(card.limit) || 0;
    const cardTransactions = transactions.filter(t => t.card_id === card.id);
    const currentInvoice = cardTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const availableLimit = limitTotal - currentInvoice;
    return {
      ...card,
      available_limit: availableLimit,
    };
  });

  return (
    <>
      {/* Botão para abrir o modal de nova transação */}
      <button
        onClick={openModal}
        className="group relative w-full h-[60px] overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-0.5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
      >
        <div className="relative flex h-full items-center justify-center gap-2 bg-gray-900/10 hover:bg-transparent transition-colors rounded-2xl">
          <PlusCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
          <span className="text-lg font-semibold text-white tracking-wide">Nova Transação</span>
        </div>
      </button>

      {/* Modal para adicionar nova transação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-fadeInUp">
            {/* Cabeçalho da modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-gray-900/50 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-white">Nova Transação</h2>
                <p className="text-sm text-gray-400">Preencha os dados da movimentação</p>
              </div>
              <button
                onClick={tryToCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulário */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Tipo */}
                  <div className="col-span-2 grid grid-cols-2 gap-3 p-1 bg-gray-800/50 rounded-xl border border-gray-800">
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 ${type === 'income'
                        ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                        }`}
                    >
                      Receita
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 ${type === 'expense'
                        ? 'bg-red-500/20 text-red-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                        }`}
                    >
                      Despesa
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                      Valor
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                      <input
                        type="number"
                        id="amount"
                        placeholder="0,00"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-lg font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                      Descrição
                    </label>
                    <input
                      type="text"
                      id="description"
                      placeholder="Ex: Salário, Mercado..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                        Data
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        required
                      />
                    </div>

                    {/* Categoria */}
                    <CategorySelector
                      type={type}
                      selectedCategory={category}
                      onSelect={setCategory}
                    />
                  </div>
                </div>

                {/* Método de Pagamento */}
                <div className="pt-2 border-t border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
                    Método de Pagamento
                  </label>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix_debit')}
                      className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'pix_debit'
                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                    >
                      <span className="text-sm font-medium">Pix / Débito</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit')}
                      className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'credit'
                        ? 'bg-purple-500/10 border-purple-500/50 text-purple-400'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                    >
                      <span className="text-sm font-medium">Crédito</span>
                    </button>
                  </div>

                  {/* Seleção de Conta/Cartão */}
                  <div className="animate-fadeIn">
                    {paymentMethod === 'pix_debit' ? (
                      <AccountSelector
                        accounts={accounts.map(mapAccountToSelector)}
                        selectedId={accountId}
                        onSelect={id => setAccountId(id)}
                      />
                    ) : (
                      <div className="space-y-4">
                        <CardSelector
                          cards={cardsWithAvailableLimit}
                          selectedId={cardId}
                          onSelect={setCardId}
                        />

                        {/* Opções de Parcelamento */}
                        {showInstallmentOptions && (
                          <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800">
                            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                              Parcelas
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min="1"
                                max="24"
                                value={installmentNum}
                                onChange={(e) => setInstallmentNum(Number(e.target.value))}
                                className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none text-center"
                              />
                              <div className="text-sm text-gray-400">
                                <p>x {installmentNum === 1 ? 'à vista' : (parseFloat(amount || '0') / installmentNum).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                {installmentNum > 1 && <p className="text-xs opacity-60">Total: {parseFloat(amount || '0').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-emerald-900/20"
                  >
                    Confirmar Transação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-sm p-6 shadow-2xl animate-scaleIn">
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-500/10 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">Descartar alterações?</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Tem certeza que deseja fechar? Os dados preenchidos serão perdidos.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={cancelClose}
                    className="flex-1 py-2.5 px-4 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={confirmClose}
                    className="flex-1 py-2.5 px-4 bg-red-600/90 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
                  >
                    Descartar
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