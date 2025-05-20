import React, { useState } from 'react';
import CreditCardList from '../components/CreditCardList';
import CreditCardFormModal from '../components/CreditCardFormModal';
import { mockCards } from '../data/mockCards';
import { useNavigate } from 'react-router-dom';

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

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [showModal, setShowModal] = useState(false);

  // Funções de adicionar, editar, excluir (mockadas)
  const handleAdd = () => setShowModal(true);
  const handleEdit = (card: Card) => {/* abrir modal futuramente */};
  const handleDelete = (card: Card) => setCards(cards.filter(c => c.id !== card.id));
  const handleSelect = (card: Card) => {/* mostrar transações do cartão futuramente */};

  // Função para adicionar novo cartão (mock)
  const handleSave = (newCard: any) => {
    setCards(prev => [
      ...prev,
      { ...newCard, id: Date.now() }
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Meus Cartões</h1>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Adicionar Cartão
        </button>
      </div>
      <CreditCardList
        cards={cards}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
      />
      <CreditCardFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Wallet;
