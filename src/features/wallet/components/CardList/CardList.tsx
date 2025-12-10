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

        // Filtra apenas transações pendentes (não pagas) para o cálculo do limite usado (Total Debt)
        const pendingTransactions = cardTransactions.filter(t => t.status === 'pending');

        // Cálculo do Limite Utilizado (Soma de TODAS as pendências, incluindo parcelas futuras)
        const limitUsed = pendingTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

        // Cálculo da Fatura Atual (Vigente) baseada no dia de fechamento
        // Se a data de hoje < fechamento, a fatura atual é a deste mês (acumulando).
        // Se a data de hoje >= fechamento, a fatura atual (aberta) já é a do próximo mês.
        // Inclui tudo que está pendente até a data de corte.
        const today = new Date();
        const closingDay = card.closing_day || 31; // fallback para fim do mês
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let cycleEndDate: Date;

        if (currentDay < closingDay) {
          // Fatura fecha neste mês
          cycleEndDate = new Date(currentYear, currentMonth, closingDay);
        } else {
          // Fatura já fechou, acumulando para o próximo
          cycleEndDate = new Date(currentYear, currentMonth + 1, closingDay);
        }

        // String YYYY-MM-DD para comparação
        const cycleEndDateStr = cycleEndDate.toISOString().slice(0, 10);

        const currentInvoice = pendingTransactions
          .filter(t => t.date <= cycleEndDateStr)
          .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

        // Limite disponível
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
