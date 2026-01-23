import React, { useState, useMemo } from 'react';
import CreditCardList from '../../features/wallet/components/CardList/CardList';
import CreditCardFormModal from '../../features/wallet/modals/CardFormModal';
import CardTransactions from '../../features/wallet/components/CardDetails/CardTransactions';
import { useWalletCards } from '../../features/wallet/hooks/useWalletCards';
import { useTransactions } from '../../context/TransactionsContext';
import { Card, CardFormValues } from '../../features/wallet/types/card';
import { CreditCard, Plus, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const Wallet: React.FC = () => {
  const { user } = useTransactions();
  const { cards, error, addCard, editCard, deleteCard } = useWalletCards(user?.id);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  // Stats Calculation
  const stats = useMemo(() => {
    const totalLimit = cards.reduce((acc, card) => acc + Number(card.limit), 0);
    const totalAvailable = cards.reduce((acc, card) => acc + Number(card.available_limit), 0);
    const totalUsed = totalLimit - totalAvailable;
    const usagePercent = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;

    return {
      totalLimit,
      totalAvailable,
      totalUsed,
      usagePercent
    };
  }, [cards]);

  // Actions
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

  const handleSave = async (newCard: CardFormValues) => {
    if (isEditing && selectedCard) {
      await editCard(selectedCard.id, newCard);
    } else {
      await addCard(newCard);
    }
    setShowModal(false);
    setIsEditing(false);
    setSelectedCard(null);
  };

  if (error) return (
    <div className="h-full min-h-[50vh] flex items-center justify-center text-red-400">
      <AlertCircle className="w-6 h-6 mr-2" />
      <span>Erro: {error}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-10 animate-fade-in-up">
      {/* Header & Stats Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 space-y-5">
          {/* Header Row: Logo, Title, Subtitle on the left */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-lg shadow-lg shadow-indigo-500/20 flex-shrink-0">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-2xl font-bold text-white tracking-tight">Cartões</h1>
                <p className="text-gray-400 text-xs sm:text-sm">Gerencie seus limites de crédito</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50">
              <span className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Disponível</span>
              <div
                key={stats.totalAvailable}
                className="text-lg sm:text-xl font-bold text-emerald-400 truncate transition-all duration-300"
              >
                {formatCurrency(stats.totalAvailable)}
              </div>
            </div>

            <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50">
              <span className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Fatura</span>
              <div
                key={stats.totalUsed}
                className="text-lg sm:text-xl font-bold text-amber-400 truncate transition-all duration-300"
              >
                {formatCurrency(stats.totalUsed)}
              </div>
            </div>
          </div>

          {/* Usage Bar */}
          <div className="space-y-2">
            <div className="relative bg-gray-700/50 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${stats.usagePercent > 80 ? 'bg-red-500' : stats.usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
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

      {/* Cards Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            Seus Cartões
          </h2>
        </div>

        {cards.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center animate-fadeIn">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Sua carteira está vazia</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">Adicione seu primeiro cartão de crédito para começar a controlar seus gastos.</p>
          </div>
        ) : (
          <CreditCardList
            cards={cards}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={handleSelect}
          />
        )}
      </div>

      {/* Add Button */}
      <div className="flex justify-center pt-8 pb-12">
        <button
          onClick={handleAdd}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-indigo-400 rounded-2xl font-semibold border border-indigo-500/30 hover:border-indigo-500/60 shadow-lg shadow-indigo-900/20 transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Adicionar Novo Cartão
          </span>
          <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-300" />
        </button>
      </div>

      {/* Form Modal */}
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

      {/* Transactions Detail Modal */}
      {showTransactions && selectedCard && (
        <CardTransactions
          cardId={selectedCard.id}
          onClose={() => {
            setShowTransactions(false);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
};

export default Wallet;
