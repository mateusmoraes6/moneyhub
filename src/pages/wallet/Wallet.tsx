import React, { useState } from 'react';
import CreditCardList from '../../features/wallet/components/CardList/CardList';
import CreditCardFormModal from '../../features/wallet/modals/CardFormModal';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useWalletCards } from '../../features/wallet/hooks/useWalletCards';
import { useTransactions } from '../../context/TransactionsContext';
import { Card, CardFormValues } from '../../features/wallet/types/card';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useTransactions();
  const { cards, loading, error, addCard, editCard, deleteCard } = useWalletCards(user?.id);
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

  const handleDelete = async (card: Card) => {
    await deleteCard(card.id);
  };
  const handleSelect = (card: Card) => {/* mostrar transações do cartão futuramente */};

  // Função para salvar cartão (novo ou editado)
  const handleSave = async (newCard: CardFormValues) => {
    const cardToSave = {
      ...newCard,
      data_fechamento: newCard.data_fechamento ?? 1,
      data_vencimento: newCard.data_vencimento ?? 1,
    };

    if (isEditing && selectedCard) {
      await editCard(selectedCard.id, cardToSave);
    } else {
      await addCard(cardToSave);
    }
    setShowModal(false);
    setIsEditing(false);
    setSelectedCard(null);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

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
