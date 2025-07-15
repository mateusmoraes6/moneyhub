import React from 'react';
import { useTransactions } from '../../../../context/TransactionsContext';
import CardItem from './CardItem';

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

const CardList: React.FC<CreditCardListProps> = ({ cards, onEdit, onDelete, onSelect }) => {
  const { transactions } = useTransactions();

  return (
    <div className="space-y-4">
      {cards.map(card => {
        const limitTotal = Number(card.limit) || 0;
        const cardTransactions = transactions.filter(t => t.card_id === card.id);

        // Cálculo da fatura atual (soma das transações do cartão)
        const currentInvoice = cardTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

        // Limite usado e disponível
        const limitUsed = currentInvoice;
        const availableLimit = limitTotal - limitUsed;
        const percentUsed = limitTotal > 0 ? Math.round((limitUsed / limitTotal) * 100) : 0;

        return (
          <CardItem
            key={card.id}
            card={card}
            onEdit={onEdit}
            onDelete={onDelete}
            onSelect={onSelect}
            limitUsed={limitUsed}
            availableLimit={availableLimit}
            percentUsed={percentUsed}
            currentInvoice={currentInvoice}
          />
        );
      })}
    </div>
  );
};

export default CardList;
