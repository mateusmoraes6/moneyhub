import React from 'react';
import CreditCardCard from './CardItem';

interface Card {
  id: number;
  bank_name: string;
  limit: number;
  available_limit: number;
  closing_day: number;
  due_day: number;
}

interface CreditCardListProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  onSelect: (card: Card) => void;
}

const CreditCardList: React.FC<CreditCardListProps> = ({ cards, onEdit, onDelete, onSelect }) => (
  <div className="space-y-4">
    {cards.map(card => (
      <CreditCardCard
        key={card.id}
        card={card}
        onEdit={onEdit}
        onDelete={onDelete}
        onSelect={onSelect}
      />
    ))}
  </div>
);

export default CreditCardList;
