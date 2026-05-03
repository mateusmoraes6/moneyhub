import React, { Suspense, lazy, useMemo, useState } from 'react';
import { AlertCircle, CreditCard, Plus, TrendingUp } from 'lucide-react';

import CreditCardFormModal from '../../features/credit-cards/modals/CardFormModal';
import CreditCardList from '../../features/credit-cards/components/CardList/CardList';
import { useCreditCards } from '../../features/credit-cards/hooks/useCreditCards';
import { Card, CardFormValues } from '../../features/credit-cards/types/card';
import { useTransactions } from '../../context/TransactionsContext';
import { formatCurrency } from '../../utils/formatters';

const CardTransactionsLazy = lazy(
  () => import('../../features/credit-cards/components/CardDetails/CardTransactions'),
);

function TransactionsModalPlaceholder() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
          <p className="text-gray-400 text-sm">Carregando transações...</p>
        </div>
      </div>
    </div>
  );
}

const CreditCardsPage: React.FC = () => {
  const { user } = useTransactions();
  const { cards, error, addCard, editCard, deleteCard } = useCreditCards(user?.id);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  const stats = useMemo(() => {
    const totalLimit = cards.reduce((acc, card) => acc + Number(card.limit), 0);
    const totalAvailable = cards.reduce((acc, card) => acc + Number(card.available_limit), 0);
    const totalUsed = totalLimit - totalAvailable;
    const usagePercent = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;

    return { totalLimit, totalAvailable, totalUsed, usagePercent };
  }, [cards]);

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedCard(null);
    setShowModal(true);
  };

  const handleEdit = (card: Card) => {
    setSelectedCard(card);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (card: Card) => {
    if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
      await deleteCard(card.id);
    }
  };

  const handleSelect = (card: Card) => {
    setSelectedCard(card);
    setShowTransactions(true);
  };

  const handleSave = async (values: CardFormValues) => {
    if (isEditing && selectedCard) {
      await editCard(selectedCard.id, values);
    } else {
      await addCard(values);
    }
    setShowModal(false);
    setIsEditing(false);
    setSelectedCard(null);
  };

  if (error) {
    return (
      <div className="h-full min-h-[50vh] flex items-center justify-center text-red-400">
        <AlertCircle className="w-6 h-6 mr-2 shrink-0" aria-hidden />
        <span>Erro: {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-14 max-w-6xl space-y-10 animate-fade-in-up">
      {/* Hero + KPIs */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-lg shadow-lg shadow-indigo-500/20 shrink-0">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Cartões de crédito</h1>
                <p className="text-gray-400 text-xs sm:text-sm">Gerencie limites, faturas e transações dos cartões</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-medium shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Adicionar cartão
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative flex flex-col bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50 overflow-hidden">
              <TrendingUp className="absolute right-2 top-2 w-14 h-14 text-indigo-500/15 pointer-events-none" aria-hidden />
              <span className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Limite total</span>
              <span className="text-lg sm:text-xl font-bold text-white truncate">{formatCurrency(stats.totalLimit)}</span>
            </div>

            <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50">
              <span className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Disponível</span>
              <span
                key={stats.totalAvailable}
                className="text-lg sm:text-xl font-bold text-emerald-400 truncate transition-all duration-300"
              >
                {formatCurrency(stats.totalAvailable)}
              </span>
            </div>

            <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50">
              <span className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Utilizado na fatura</span>
              <span
                key={stats.totalUsed}
                className="text-lg sm:text-xl font-bold text-amber-400 truncate transition-all duration-300"
              >
                {formatCurrency(stats.totalUsed)}{' '}
                <span className="text-sm font-semibold text-gray-500">
                  ({Math.round(stats.usagePercent)}%)
                </span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative bg-gray-700/50 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  stats.usagePercent > 80 ? 'bg-red-500' : stats.usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(stats.usagePercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
              <span className="hidden sm:inline">0%</span>
              <span className="text-gray-300 text-center flex-1 sm:flex-none">
                Comprometimento: {Math.round(stats.usagePercent)}%
              </span>
              <span className="hidden sm:inline">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" aria-hidden />
            Seus cartões
          </h2>
        </div>

        {cards.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center animate-fadeIn">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-600" aria-hidden />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Adicione um cartão de crédito para acompanhar limites e faturas neste espaço.
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Adicionar cartão agora
            </button>
          </div>
        ) : (
          <CreditCardList cards={cards} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect} />
        )}
      </section>

      <CreditCardFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setIsEditing(false);
          setSelectedCard(null);
        }}
        onSave={handleSave}
        initialValues={isEditing && selectedCard ? selectedCard : undefined}
      />

      {showTransactions && selectedCard && (
        <Suspense fallback={<TransactionsModalPlaceholder />}>
          <CardTransactionsLazy
            cardId={selectedCard.id}
            onClose={() => {
              setShowTransactions(false);
              setSelectedCard(null);
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CreditCardsPage;
