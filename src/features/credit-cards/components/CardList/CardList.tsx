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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const limitTotal = Number(card.limit) || 0;
        const cardTransactions = transactions.filter(t => t.card_id === card.id);
        const pendingTransactions = cardTransactions.filter(t => t.status === 'pending');
        const limitUsed = pendingTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

        const today = new Date();
        const closingDay = card.closing_day || 31;
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let cycleEndDate: Date;
        if (currentDay < closingDay) {
          cycleEndDate = new Date(currentYear, currentMonth, closingDay);
        } else {
          cycleEndDate = new Date(currentYear, currentMonth + 1, closingDay);
        }

        const cycleEndDateStr = cycleEndDate.toISOString().slice(0, 10);
        const currentInvoice = pendingTransactions
          .filter(t => t.date <= cycleEndDateStr)
          .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

        const availableLimit = limitTotal - limitUsed;
        const percentUsed = limitTotal > 0 ? Math.round((limitUsed / limitTotal) * 100) : 0;

        return (
          <div 
            key={card.id} 
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardItem
              card={card}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
              limitUsed={limitUsed}
              availableLimit={availableLimit}
              percentUsed={percentUsed}
              currentInvoice={currentInvoice}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
