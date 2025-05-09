export interface TransactionsContextType {
  lastAction: string | null;
  setLastAction: (action: string | null) => void;
}
