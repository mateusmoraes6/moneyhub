import React from 'react';
import { Card } from '../types';
import LimitDonutChart from './LimitDonutChart';

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  onSelect: (card: Card) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onEdit, onDelete, onSelect }) => {
  const valorFaturaAtual = card.limite_total - card.limite_disponivel;
  const percentualGasto = (valorFaturaAtual / card.limite_total) * 100;
  
  // Função para determinar a cor do alerta da fatura
  const getFaturaColor = () => {
    if (percentualGasto >= 80) return 'text-red-400';
    if (percentualGasto >= 60) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  return (
    <div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 shadow-lg"
      onClick={() => onSelect(card)}
    >
      {/* Bloco 1 — Identificação */}
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={card.icone_url} 
          alt={card.nome_banco} 
          className="w-10 h-10 rounded-lg bg-white p-0.5"
        />
        <div>
          <h3 className="text-lg font-semibold text-white">{card.apelido}</h3>
          <p className="text-sm text-gray-400">{card.nome_banco}</p>
        </div>
      </div>

      {/* Bloco 2 — Limite disponível */}
      <div className="mb-3">
        <p className="text-sm text-gray-400">Limite disponível</p>
        <p className="text-xl font-semibold text-emerald-400">
          R$ {card.limite_disponivel.toLocaleString('pt-BR')}
        </p>
        <p className="text-sm text-gray-500">
          Limite total: R$ {card.limite_total.toLocaleString('pt-BR')}
        </p>
      </div>

      {/* Bloco 3 e 4 — Fatura atual e Gráfico */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-400">Fatura atual</p>
          <p className={`text-lg font-semibold ${getFaturaColor()}`}>
            R$ {valorFaturaAtual.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="w-16 h-16">
          <LimitDonutChart 
            limiteTotal={card.limite_total} 
            limiteDisponivel={card.limite_disponivel}
            size={64}
          />
        </div>
      </div>

      {/* Bloco 5 — Fechamento e Vencimento */}
      <div className="mb-4">
        <p className="text-xs text-gray-500">
          Fechamento: dia {card.data_fechamento} | Vencimento: dia {card.data_vencimento}
        </p>
      </div>

      {/* Bloco 6 — Ações */}
      <div className="flex justify-end gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card);
          }}
          className="text-sm text-blue-400 hover:underline px-2 py-1"
          type="button"
        >
          Editar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card);
          }}
          className="text-sm text-red-400 hover:underline px-2 py-1"
          type="button"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default CardItem;
