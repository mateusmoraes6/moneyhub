import { Transaction } from '../types';

export const groupTransactions = (transactions: Transaction[]): Transaction[] => {
  const groupedHelper: Record<string, Transaction[]> = {};
  const nonInstallmentTransactions: Transaction[] = [];

  // 1. Separate installment transactions from regular ones
  transactions.forEach(t => {
    if (t.installment_id) {
      if (!groupedHelper[t.installment_id]) {
        groupedHelper[t.installment_id] = [];
      }
      groupedHelper[t.installment_id].push(t);
    } else {
      nonInstallmentTransactions.push(t);
    }
  });

  // 2. Process groups
  const groupedInstallments: Transaction[] = Object.values(groupedHelper).map(group => {
    // Sort by installment number to find the first one easily
    group.sort((a, b) => (a.installment_num || 0) - (b.installment_num || 0));

    const firstInstallment = group[0];
    const totalAmount = group.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalInstallments = group.length; 
    // Note: group.length might be less than total installments if we don't have all of them loaded.
    // However, usually "Recent Transactions" might not have all.
    // But the user request implies we want to show the specific purchase as one card.
    
    // If we only have partial installments (e.g. filtering), the sum will be partial. 
    // But the requirements say "ao inves de uma compra dividida... aparecer um unico card... com o valor total".
    // "Valor total" usually means the full purchase price.
    // If I only have 1 of 3 installments loaded, I can't know the FULL total 100% accurately without knowing the total count and assuming equal split, OR if we have valid data.
    // But `groupTransactions` usually runs on a list. 
    
    // Strategy: We will sum what we HAVE in the list.
    // If the list is "All Transactions", we have all.
    // If the list is "Recent", we might only have 2 of 3.
    // If we sum only 2, the user sees 2/3 of the price. That might be confusing if they expect "Full Purchase Price".
    // However, showing "Full Price" when we only have 2 installments in the current view (e.g. filtered) is tricky.
    // But for "Recent Transactions" (which is usually time sorted), we might see the LATEST installments.
    
    // WAIT. If I buy something today in 3x.
    // Installment 1: Today.
    // Installment 2: Next Month.
    // Installment 3: Month after.
    
    // If I look at "Recent Transactions", I see Installment 1.
    // Installment 2 and 3 are in the future.
    // They might exist in the DB with future dates.
    // `useTransactions` fetches... let's check `TransactionsContext`.
    // It fetches `select('*')`. It does NOT filter by date. It fetches ALL transactions for the user.
    // So `transactions` contains FUTURE installments too?
    // Let's verify `CardTransactions.tsx`: `transactions.filter(t => t.card_id === cardId)`.
    // So yes, `transactions` likely has ALL if they are generated upfront.
    // If they are generated, we can sum them all.
    
    // Cleaning the description: "Teste (1/3)" -> "Teste"
    const cleanedDescription = firstInstallment.description.replace(/\s*\(\d+\/\d+\)/, '');
    
    // Create the grouped transaction
    return {
      ...firstInstallment, // Keep ID of first installment as key? Or maybe installment_id? 
                           // We need a unique ID for React Key. installment_id is good.
      id: firstInstallment.installment_id!, 
      description: `${cleanedDescription} (${totalInstallments}x)`,
      amount: totalAmount,
      // Date: The user requested "data da transação". 
      // Usually the first installment date is the transaction date.
      date: firstInstallment.date, 
      // We might want to indicate it's a grouped item?
      isGrouped: true,
    };
  });

  // 3. Merge and Sort
  // We want to sort by date descending.
  const allTransactions = [...nonInstallmentTransactions, ...groupedInstallments];
  
  return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
