import React from 'react';

// Importe seu TransactionList real se já existir
// import TransactionList from 'caminho/do/TransactionList';

interface CardTransactionsProps {
  cardId: number;
  // transactions: Transaction[]; // Se já tiver tipagem de transação
}

const CardTransactions: React.FC<CardTransactionsProps> = ({ cardId }) => {
  // Aqui você pode buscar as transações do cartão pelo id futuramente
  // Por enquanto, apenas um placeholder
  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-white mb-4">Transações deste cartão</h2>
      {/* <TransactionList transactions={transactions} /> */}
      <div className="text-gray-400">Funcionalidade em desenvolvimento...</div>
    </div>
  );
};

export default CardTransactions;
