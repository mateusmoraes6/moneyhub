import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../../types/card';
import BankIcon from '../../../../components/common/BankIcon';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCard = cards.find(card => card.id === selectedId);

  const getDisplayData = (card: Card) => {
    const bankName = card.nome_banco;
    const iconUrl = card.icone_url;
    const extraInfo = `Limite disponível: R$ ${card.limite_disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    return { bankName, iconUrl, extraInfo };
  };

  const selectedCardData = selectedCard ? getDisplayData(selectedCard) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Cartão
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {selectedCardData?.iconUrl && (
            <BankIcon
              iconUrl={selectedCardData.iconUrl}
              bankName={selectedCardData.bankName}
              size="sm"
            />
          )}
          <span className={selectedCard ? 'text-white' : 'text-gray-400'}>
            {selectedCardData
              ? selectedCardData.bankName
              : 'Selecione um cartão'
            }
          </span>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
          <div className="p-2 space-y-2">
            {cards.map((card) => {
              const cardData = getDisplayData(card);
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    onSelect(card.id);
                    setIsOpen(false);
                  }}
                  className="w-full p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-700 transition-colors duration-200"
                >
                  {cardData.iconUrl && (
                    <BankIcon
                      iconUrl={cardData.iconUrl}
                      bankName={cardData.bankName}
                      size="sm"
                    />
                  )}
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">
                      {cardData.bankName}
                    </p>
                    <p className="text-sm text-gray-400">{cardData.extraInfo}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardSelector; 