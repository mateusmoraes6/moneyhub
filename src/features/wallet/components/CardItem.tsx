import React from 'react';

interface Card {
  id: number;
  nome_banco: string;
  icone_url: string;
  apelido: string;
  limite_total: number;
  limite_disponivel: number;
  data_fechamento: number;
  data_vencimento: number;
}

interface CreditCardCardProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  onSelect: (card: Card) => void;
}

const CreditCardCard: React.FC<CreditCardCardProps> = ({ card, onEdit, onDelete, onSelect }) => (
  <div
    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition"
    onClick={() => onSelect(card)}
  >
    <div className="flex items-center gap-4">
      <img src={card.icone_url} alt={card.nome_banco} className="w-12 h-12 rounded-full bg-white p-1" />
      <div>
        <div className="text-lg font-bold text-white">{card.apelido}</div>
        <div className="text-xs text-gray-400">{card.nome_banco}</div>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <div className="text-sm text-gray-400">Limite disponível</div>
      <div className="text-xl font-semibold text-emerald-400">
        R$ {card.limite_disponivel.toLocaleString('pt-BR')}
      </div>
      <div className="text-xs text-gray-500">Limite total: R$ {card.limite_total.toLocaleString('pt-BR')}</div>
      <div className="text-xs text-gray-500 mt-1">
        Fechamento: dia {card.data_fechamento} | Vencimento: dia {card.data_vencimento}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <button
        onClick={e => { e.stopPropagation(); onEdit(card); }}
        className="text-xs text-emerald-400 hover:underline"
        type="button"
      >
        Editar
      </button>
      <button
        onClick={e => { e.stopPropagation(); onDelete(card); }}
        className="text-xs text-red-400 hover:underline"
        type="button"
      >
        Excluir
      </button>
    </div>
  </div>
);

export default CreditCardCard;
