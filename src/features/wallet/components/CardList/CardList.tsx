import React from 'react';
import { motion } from 'framer-motion';
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const CardList: React.FC<CreditCardListProps> = ({ cards, onEdit, onDelete, onSelect }) => {
  const { transactions } = useTransactions();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {cards.map(card => {
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
          <motion.div key={card.id} variants={item}>
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
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CardList;
