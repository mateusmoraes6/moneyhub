import React, { useState } from 'react';
import CreditCardList from '../../features/wallet/components/CardList/CardList';
import CreditCardFormModal from '../../features/wallet/modals/CardFormModal';
import Header from '../../components/layout/Header';
import { useWalletCards } from '../../features/wallet/hooks/useWalletCards';
import { useTransactions } from '../../context/TransactionsContext';
import { Card, CardFormValues } from '../../features/wallet/types/card';
import { CreditCard, Plus } from 'lucide-react';

const Wallet: React.FC = () => {
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
    if (isEditing && selectedCard) {
      await editCard(selectedCard.id, newCard);
    } else {
      await addCard(newCard);
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
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-emerald-500 rounded-full p-2">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Cartões de Crédito</h1>
        </div>
        <div className="bg-yellow-900 text-yellow-200 rounded-md p-4 mb-6 text-center font-medium">
          Atenção: Esta página de cartões de crédito ainda está em desenvolvimento. Algumas funcionalidades podem não estar disponíveis.
        </div>
        <CreditCardList
          cards={cards}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelect={handleSelect}
        />
        {/* Botão de adicionar cartão na parte inferior, igual ao de contas bancárias */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" />
            Adicionar Cartão
          </button>
        </div>
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
