import React, { createContext, useContext, useState, useCallback } from 'react';
import { Card, AccountsContextType, BankAccountSummary } from '../types';
import { mockAccounts } from '../features/bank-accounts/data/mockAccounts';
import { mockCards } from '../features/wallet/data/mockCards';

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Converter os dados mockados para o formato esperado
  const initialAccounts: BankAccountSummary[] = mockAccounts.map(account => ({
    id: Number(account.id),
    name: account.nome_banco,
    bank: account.nome_banco,
    balance: account.saldo,
    type: 'checking',
    is_active: true,
    created_at: new Date().toISOString()
  }));

  const initialCards: Card[] = mockCards.map(card => ({
    id: card.id,
    name: card.apelido,
    bank: card.nome_banco,
    limit: card.limite_total,
    available_limit: card.limite_disponivel,
    closing_day: card.data_fechamento,
    due_day: card.data_vencimento,
    is_active: true,
    created_at: new Date().toISOString()
  }));

  const [accounts, setAccounts] = useState<BankAccountSummary[]>(initialAccounts);
  const [cards, setCards] = useState<Card[]>(initialCards);

  // Adicionar conta
  const addAccount = useCallback(async (accountData: Omit<BankAccountSummary, 'id' | 'created_at'>) => {
    const newAccount: BankAccountSummary = {
      ...accountData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setAccounts(prev => [...prev, newAccount]);
  }, []);

  // Adicionar cartão
  const addCard = useCallback(async (cardData: Omit<Card, 'id' | 'created_at'>) => {
    const newCard: Card = {
      ...cardData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setCards(prev => [...prev, newCard]);
  }, []);

  // Atualizar limite do cartão
  const updateCardLimit = useCallback(async (cardId: number, amount: number) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, available_limit: card.available_limit - amount }
        : card
    ));
  }, []);

  // Buscar conta por ID
  const getAccountById = useCallback((id: number) => {
    return accounts.find(account => account.id === id);
  }, [accounts]);

  // Buscar cartão por ID
  const getCardById = useCallback((id: number) => {
    return cards.find(card => card.id === id);
  }, [cards]);

  const value = {
    accounts,
    cards,
    addAccount,
    addCard,
    updateCardLimit,
    getAccountById,
    getCardById,
  };

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (context === undefined) {
    throw new Error('useAccounts deve ser usado dentro de um AccountsProvider');
  }
  return context;
};
