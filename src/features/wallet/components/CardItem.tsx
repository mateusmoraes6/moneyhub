import React from 'react';
import LimitDonutChart from './LimitDonutChart';

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

const CreditCardCard: React.FC<CreditCardCardProps> = ({ card, onEdit, onDelete, onSelect }) => {
  const valorFaturaAtual = card.limite_total - card.limite_disponivel;

  return (
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
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="group relative">
            <LimitDonutChart 
              limiteTotal={card.limite_total} 
              limiteDisponivel={card.limite_disponivel} 
            />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Gasto: R$ {valorFaturaAtual.toLocaleString('pt-BR')} | 
              Disponível: R$ {card.limite_disponivel.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Fatura atual: R$ {valorFaturaAtual.toLocaleString('pt-BR')} | Vence: dia {card.data_vencimento}
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
    </div>
  );
};

export default CreditCardCard;
