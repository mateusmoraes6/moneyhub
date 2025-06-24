import React from 'react';
import CreditCardCard from './CardItem';

interface Card {
  id: number;
  nome_banco: string;
  icone_url: string;
  limite_total: number;
  limite_disponivel: number;
  data_fechamento: number;
  data_vencimento: number;
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
