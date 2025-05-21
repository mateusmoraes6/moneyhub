import { useState } from 'react';
import { Card, CardFormValues } from '../types';
import { mockCards } from '../data/mockCards';

export function useWalletCards() {
  const [cards, setCards] = useState<Card[]>(mockCards);

  const addCard = (card: CardFormValues) => {
    setCards(prev => [
      ...prev,
      { ...card, id: Date.now() }
    ]);
  };

  const editCard = (id: number, updated: CardFormValues) => {
    setCards(prev =>
      prev.map(card => (card.id === id ? { ...card, ...updated } : card))
    );
  };

  const deleteCard = (id: number) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  return {
    cards,
    addCard,
    editCard,
    deleteCard,
  };
}
