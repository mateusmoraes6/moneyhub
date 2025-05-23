import React from 'react';

// Import TransactionList
// import TransactionList from 'caminho/do/TransactionList';

interface Transaction {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  status: 'pago' | 'pendente';
}

interface CardTransactionsProps {
  cardId: number;
  onClose: () => void;
}

const CardTransactions: React.FC<CardTransactionsProps> = ({ cardId, onClose }) => {
  // Exemplo de transações mockadas
  const transactions: Transaction[] = [
    {
      id: 1,
      descricao: 'Supermercado Extra',
      valor: 250.90,
      data: '2024-03-15',
      categoria: 'Alimentação',
      status: 'pago'
    },
    {
      id: 2,
      descricao: 'Netflix',
      valor: 39.90,
      data: '2024-03-10',
      categoria: 'Entretenimento',
      status: 'pendente'
    },
    {
      id: 3,
      descricao: 'Uber',
      valor: 45.50,
      data: '2024-03-14',
      categoria: 'Transporte',
      status: 'pago'
    }
  ];

  return (
    <div className="mt-8 bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Transações do Cartão</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map(transaction => (
          <div 
            key={transaction.id}
            className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="text-white font-medium">{transaction.descricao}</h3>
              <p className="text-sm text-gray-400">{transaction.categoria}</p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.status === 'pago' ? 'text-emerald-400' : 'text-yellow-400'
              }`}>
                R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-400">{transaction.data}</p>
            </div>
            <span className={`ml-4 px-2 py-1 rounded-full text-xs ${
              transaction.status === 'pago' 
                ? 'bg-emerald-900 text-emerald-300' 
                : 'bg-yellow-900 text-yellow-300'
            }`}>
              {transaction.status === 'pago' ? 'Pago' : 'Pendente'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardTransactions;
