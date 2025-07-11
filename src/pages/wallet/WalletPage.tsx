import { useState } from 'react';
import CardList from '../../features/wallet/components/CardList/CardList';
import CardFormModal from '../../features/wallet/modals/CardFormModal';
import CardTransactions from '../../features/wallet/components/CardDetails/CardTransactions';
import { Card, CardFormValues } from '../../features/wallet/types/card';
import { useWalletCards } from '../../features/wallet/hooks/useWalletCards';
import { useTransactions } from '../../context/TransactionsContext';

export default function WalletPage() {
  const { user } = useTransactions();
  const { cards, loading, error, addCard, editCard, deleteCard } = useWalletCards(user?.id);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Funções de ação
  const handleAdd = () => {
    setIsEditing(false);
    setShowModal(true);
    setSelectedCard(null);
  };
  
  const handleEdit = (card: Card) => {
    setSelectedCard(card);
    setIsEditing(true);
    setShowModal(true);
  };
  
  const handleDelete = async (card: Card) => {
    await deleteCard(card.id);
  };

  const handleSelect = (card: Card) => setSelectedCard(card);

  const handleSave = async (newCard: CardFormValues) => {
    // Não precisa mais de campos em português ou campos extras
    if (isEditing && selectedCard) {
      await editCard(selectedCard.id, newCard);
    } else {
      await addCard(newCard);
    }
    setShowModal(false);
    setIsEditing(false);
    setSelectedCard(null);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Meus Cartões</h1>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Adicionar Cartão
        </button>
      </div>
      <CardList
        cards={cards}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
      />
      <CardFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setIsEditing(false);
          setSelectedCard(null);
        }}
        onSave={handleSave}
        initialValues={isEditing && selectedCard ? selectedCard : undefined}
      />
      {selectedCard && (
        <CardTransactions cardId={selectedCard.id} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}