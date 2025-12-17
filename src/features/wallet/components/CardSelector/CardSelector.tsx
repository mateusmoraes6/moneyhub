import React, { useState } from 'react';
import { Card } from '../../types/card';
import BankIcon from '../../../../components/common/BankIcon';
import { X, ChevronRight, Check, CreditCard } from 'lucide-react';

interface CardSelectorProps {
  cards: Card[];
  selectedId?: number;
  onSelect: (id: number) => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({
  cards,
  selectedId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCard = cards.find(c => c.id === selectedId);

  // Helper to normalize bank name for icon path
  const normalizeBankName = (name: string) =>
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s/g, "");

  const getDisplayData = (card: Card) => {
    const bankName = card.bank_name;
    const iconUrl = `/icons/${normalizeBankName(card.bank_name)}.svg`;
    const availableLimit = typeof card.available_limit === 'number' ? card.available_limit : 0;
    const limitFormatted = availableLimit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const limitColor = availableLimit >= 0 ? 'text-emerald-400' : 'text-red-400';

    return { bankName, iconUrl, limitFormatted, limitColor };
  };

  const selectedCardData = selectedCard ? getDisplayData(selectedCard) : null;

  const handleSelect = (id: number) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Cartão
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent flex items-center justify-between group transition-all hover:border-gray-600"
        >
          <div className="flex items-center space-x-3">
            {selectedCardData?.iconUrl ? (
              <BankIcon
                iconUrl={selectedCardData.iconUrl}
                bankName={selectedCardData.bankName}
                size="sm"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-xs text-gray-400">?</span>
              </div>
            )}
            <span className={selectedCard ? 'text-white' : 'text-gray-400'}>
              {selectedCardData
                ? selectedCardData.bankName
                : 'Selecione um cartão'
              }
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors rotate-90" />
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>

          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[80vh] animate-scaleIn">
            {/* Header */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Selecionar Cartão</h3>
                <p className="text-sm text-gray-400">Escolha o cartão para a compra</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-2">
              {cards.map((card) => {
                const cardData = getDisplayData(card);
                const isSelected = selectedId === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleSelect(card.id)}
                    className={`
                             w-full p-3 rounded-xl flex items-center justify-between transition-all duration-200 border
                             ${isSelected
                        ? 'bg-purple-600/20 border-purple-500/50 shadow-[0_0_10px_rgba(147,51,234,0.1)]'
                        : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
                      }
                          `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-600/20' : 'bg-gray-800'}`}>
                        {cardData.iconUrl ? (
                          <BankIcon
                            iconUrl={cardData.iconUrl}
                            bankName={cardData.bankName}
                            size="sm"
                          />
                        ) : (
                          <CreditCard className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {cardData.bankName}
                        </p>
                        <p className="text-xs text-gray-500">Limite Disponível</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-mono font-medium ${cardData.limitColor}`}>
                        {cardData.limitFormatted}
                      </p>
                      {isSelected && (
                        <div className="flex justify-end mt-1">
                          <div className="flex items-center gap-1 text-xs text-purple-400">
                            <Check className="w-3 h-3" />
                            Selecionado
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardSelector; 