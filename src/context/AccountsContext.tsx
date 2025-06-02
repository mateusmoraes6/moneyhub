import React, { createContext, useContext, useState, useCallback } from 'react';
import { Account, Card, AccountsContextType } from '../types';

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  // Adicionar conta
  const addAccount = useCallback(async (accountData: Omit<Account, 'id' | 'created_at'>) => {
    const newAccount: Account = {
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
