import React from 'react';
import BankIcon from '../../../../components/common/BankIcon';

interface Bank {
  nome: string;
  icone: string;
}

interface CardBankSelectorProps {
  bancos: Bank[];
  selected: string;
  onSelect: (bank: Bank) => void;
}

const CardBankSelector: React.FC<CardBankSelectorProps> = ({ bancos, selected, onSelect }) => (
  <div className="flex gap-2 flex-wrap">
    {bancos.map(bank => (
      <button
        type="button"
        key={bank.nome}
        className={`p-2 rounded-lg border transition flex flex-col items-center ${
          selected === bank.nome
            ? 'border-emerald-500 bg-emerald-900/20'
            : 'border-gray-700'
        }`}
        onClick={() => onSelect(bank)}
      >
        <BankIcon
          iconUrl={bank.icone}
          bankName={bank.nome}
          size="md"
        />
        <span className="text-xs text-gray-200">{bank.nome}</span>
      </button>
    ))}
  </div>
);

export default CardBankSelector;
