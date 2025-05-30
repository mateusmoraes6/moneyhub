import React, { useState } from 'react';
import CreditCardList from '../wallet/components/CardList';
import CreditCardFormModal from '../wallet/components/CardFormModal';
import { mockCards } from '../wallet/data/mockCards';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

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

interface CardFormValues {
  nome_banco: string;
  icone_url: string;
  apelido: string;
  limite_total: number;
  limite_disponivel: number;
  data_fechamento?: number;
  data_vencimento?: number;
}

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Funções de adicionar, editar, excluir
  const handleAdd = () => {
    setIsEditing(false);
    setSelectedCard(null);
    setShowModal(true);
  };

  const handleEdit = (card: Card) => {
    setSelectedCard(card);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (card: Card) => setCards(cards.filter(c => c.id !== card.id));
  const handleSelect = (card: Card) => {/* mostrar transações do cartão futuramente */};

  // Função para salvar cartão (novo ou editado)
  const handleSave = (newCard: CardFormValues) => {
    const cardToSave = {
      ...newCard,
      data_fechamento: newCard.data_fechamento ?? 1,
      data_vencimento: newCard.data_vencimento ?? 1,
    };

    if (isEditing && selectedCard) {
      setCards(prev => prev.map(card => 
        card.id === selectedCard.id ? { ...cardToSave, id: card.id } : card
      ));
    } else {
      setCards(prev => [
        ...prev,
        { ...cardToSave, id: Date.now() }
      ]);
    }
    setShowModal(false);
    setIsEditing(false);
    setSelectedCard(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-300">
      <Header />
      
      <main className="container mt-12 pt-16 mx-auto px-4 py-6 max-w-4xl">
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
          onClose={() => {
            setShowModal(false);
            setIsEditing(false);
            setSelectedCard(null);
          }}
          onSave={handleSave}
          initialValues={isEditing && selectedCard ? selectedCard : undefined}
        />
      </main>
    </div>
  );
};

export default Wallet;
