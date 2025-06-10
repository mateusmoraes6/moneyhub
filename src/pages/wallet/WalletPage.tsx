import React, { useState } from 'react';
import CardList from '../../features/wallet/components/CardList/CardList';
import CardFormModal from '../../features/wallet/modals/CardFormModal';
import CardTransactions from '../../features/wallet/components/CardDetails/CardTransactions';
import { Card, CardFormValues } from '../../features/wallet/types';

import { mockCards } from '../../features/wallet/data/mockCards';

export default function WalletPage() {
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Funções de ação
  const handleAdd = () => {
    setIsEditing(false);
    setShowModal(true);
  };
  
  const handleEdit = (card: Card) => {
    setSelectedCard(card);
    setIsEditing(true);
    setShowModal(true);
  };
  
  const handleDelete = (card: Card) => setCards(cards.filter(c => c.id !== card.id));
  const handleSelect = (card: Card) => setSelectedCard(card);

  const handleSave = (newCard: CardFormValues) => {
    if (isEditing && selectedCard) {
      setCards(prev => prev.map(card => 
        card.id === selectedCard.id ? { ...newCard, id: card.id } : card
      ));
    } else {
      setCards(prev => [
        ...prev,
        { ...newCard, id: Date.now() }
      ]);
    }
    setShowModal(false);
    setIsEditing(false);
    setSelectedCard(null);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      {/* ...botão voltar, título, botão adicionar... */}
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
        <CardTransactions cardId={selectedCard.id} />
      )}
    </div>
  );
}
