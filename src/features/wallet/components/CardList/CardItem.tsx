import React, { useState } from 'react';
import { Card } from '../../types';
import LimitDonutChart from '../CardChart/LimitDonutChart';
import CardDetailsModal from '../../modals/CardDetailsModal';
import BankIcon from '../../../../components/common/BankIcon';
import { getBankIconUrl } from '../../../bank-accounts/data/banks';

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  onSelect: (card: Card) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onEdit, onDelete, onSelect }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const valorFaturaAtual = card.limit - card.available_limit;
  const percentualGasto = (valorFaturaAtual / card.limit) * 100;

  // Função para determinar a cor do alerta da fatura
  const getFaturaColor = () => {
    if (percentualGasto >= 80) return 'text-red-400';
    if (percentualGasto >= 60) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  return (
    <>
      <div
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 shadow-lg relative"
        onClick={() => onSelect(card)}
      >
        {/* Menu de 3 pontos - Agora no topo */}
        <div className="absolute top-4 right-4 md:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-white p-2"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Menu dropdown */}
          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-gray-700"
                type="button"
              >
                + Details
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(card);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-t-lg"
                type="button"
              >
                Edit
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(card);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg"
                type="button"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Bloco 1 — Identificação */}
        <div className="flex items-center gap-3 mb-4">
          <BankIcon
            iconUrl={getBankIconUrl(card.bank_name)}
            bankName={card.bank_name}
            size="md"
          />
          <div>
            <h3 className="text-lg font-semibold text-white">{card.bank_name}</h3>
          </div>
        </div>

        {/* Bloco 2 — Limite disponível */}
        <div className="mb-3">
          <p className="text-sm text-gray-400">Available Limit</p>
          <p className="text-xl font-semibold text-emerald-400">
            R$ {card.available_limit.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500">
            Total Limit: R$ {card.limit.toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Bloco 3 e 4 — Fatura atual e Gráfico */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-400">Current Invoice</p>
            <p className={`text-lg font-semibold ${getFaturaColor()}`}>
              R$ {valorFaturaAtual.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="w-16 h-16">
            <LimitDonutChart
              limiteTotal={card.limit}
              limiteDisponivel={card.available_limit}
              size={64}
            />
          </div>
        </div>

        {/* Bloco 5 — Fechamento e Vencimento */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">
            Closing: day {card.closing_day} | Due: day {card.due_day}
          </p>
        </div>

        {/* Bloco 6 — Ações (apenas para desktop) */}
        <div className="hidden md:flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
            className="text-sm text-emerald-400 hover:underline px-2 py-1"
            type="button"
          >
            + Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="text-sm text-blue-400 hover:underline px-2 py-1"
            type="button"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card);
            }}
            className="text-sm text-red-400 hover:underline px-2 py-1"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <CardDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        card={card}
      />
    </>
  );
};

export default CardItem;
