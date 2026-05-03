import React, { useState } from 'react';
import { Card } from '../../types';
import LimitDonutChart from '../CardChart/LimitDonutChart';
import CardDetailsModal from '../../modals/CardDetailsModal';
import BankIcon from '../../../../components/common/BankIcon';
import { getBankIconUrl } from '../../../bank-accounts/data/banks';
import { Edit2, Trash2, Calendar, AlertTriangle } from 'lucide-react';

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
  onSelect: (card: Card) => void;
  limitUsed: number;
  availableLimit: number;
  percentUsed: number;
  currentInvoice: number;
}

const CardItem: React.FC<CardItemProps> = ({
  card, onEdit, onDelete, onSelect, availableLimit, percentUsed, currentInvoice
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Determine status color scheme
  let statusColor = 'emerald';
  if (percentUsed > 80) statusColor = 'red';
  else if (percentUsed > 50) statusColor = 'amber';

  const getGradient = () => {
    if (statusColor === 'red') return 'from-red-500/10 to-red-900/10 border-red-500/30 hover:border-red-500/50';
    if (statusColor === 'amber') return 'from-amber-500/10 to-amber-900/10 border-amber-500/30 hover:border-amber-500/50';
    return 'from-emerald-500/10 to-emerald-900/10 border-emerald-500/30 hover:border-emerald-500/50';
  };

  const getTextColor = () => {
    if (statusColor === 'red') return 'text-red-400';
    if (statusColor === 'amber') return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <>
      <div
        onClick={() => onSelect(card)}
        className={`group relative bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 w-full cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl ${getGradient()}`}
      >
        {/* Hover Highlight */}
        <div className={`absolute inset-0 bg-gradient-to-br ${statusColor === 'red' ? 'from-red-500/5' : statusColor === 'amber' ? 'from-amber-500/5' : 'from-emerald-500/5'} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative z-10">
          {/* Header + Actions */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-800 rounded-xl shadow-inner border border-gray-700 group-hover:border-gray-600 transition-colors">
                <BankIcon
                  iconUrl={getBankIconUrl(card.bank_name)}
                  bankName={card.bank_name}
                  size="md"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100 leading-tight flex items-center gap-2">
                  {card.bank_name}
                  {statusColor === 'red' && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                </h3>
                <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${statusColor === 'red' ? 'from-red-500/50 via-red-500 to-red-500/50' : statusColor === 'amber' ? 'from-amber-500/50 via-amber-500 to-amber-500/50' : 'from-emerald-500/50 via-emerald-500 to-emerald-500/50'}`} />
              </div>
            </div>

            {/* Actions sempre visíveis */}
            <div className="flex gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(card); }}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(card); }}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Grid */}
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Limit Info */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Disponível</p>
                <p className={`text-xl font-bold ${getTextColor()}`}>
                  R$ {availableLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Fatura Atual</p>
                <p className="text-lg font-bold text-gray-200">
                  R$ {currentInvoice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex justify-end">
              <div className="relative" style={{ width: 100, height: 100 }}>
                <LimitDonutChart
                  limiteTotal={card.limit}
                  limiteDisponivel={availableLimit}
                  size={100}
                />
                {/* Percentage Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className={`text-xs font-bold ${getTextColor()}`}>{Math.round(percentUsed)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Fecha dia {card.closing_day}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <span>Vence dia {card.due_day}</span>
            </div>
          </div>
        </div>
      </div>

      <CardDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        card={card}
      />
    </>
  );
};

export default CardItem;