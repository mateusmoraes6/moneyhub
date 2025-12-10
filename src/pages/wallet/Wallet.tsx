import React, { useState, useMemo } from 'react';
import CreditCardList from '../../features/wallet/components/CardList/CardList';
import CreditCardFormModal from '../../features/wallet/modals/CardFormModal';
import CardTransactions from '../../features/wallet/components/CardDetails/CardTransactions';
import { useWalletCards } from '../../features/wallet/hooks/useWalletCards';
import { useTransactions } from '../../context/TransactionsContext';
import { Card, CardFormValues } from '../../features/wallet/types/card';
import { CreditCard, Plus, Wallet as WalletIcon, TrendingUp } from 'lucide-react';
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

  if (error) return <div className="h-full bg-gray-950 flex items-center justify-center text-red-400">Erro: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl pb-20">
      {/* Page Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Carteira</h1>
          <p className="text-gray-400">Gerencie seus cartões de crédito e limites</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Adicionar Cartão
        </button>
      </div>

      {/* Global Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <WalletIcon className="w-24 h-24 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">Limite Total</p>
          <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.totalLimit)}</h3>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="w-24 h-24 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">Limite Disponível</p>
          <h3 className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.totalAvailable)}</h3>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-amber-500" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">Limite Utilizado</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-amber-400">{formatCurrency(stats.totalUsed)}</h3>
            <span className="text-sm text-gray-500 mb-1">({Math.round(stats.usagePercent)}%)</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 mt-3 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${stats.usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-400" />
          Meus Cartões
        </h2>

        {cards.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">Adicione seus cartões de crédito para controlar seus limites e faturas em um só lugar.</p>
            <button
              onClick={handleAdd}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Adicionar Cartão Agora
            </button>
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
