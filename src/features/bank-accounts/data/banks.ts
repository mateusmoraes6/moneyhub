export interface Bank {
  name: string;
  icon: string;
}

export const banks: Bank[] = [
  { name: 'Nubank', icon: '/icons/nubank.svg' },
  { name: 'Itaú', icon: '/icons/itau.svg' },
  { name: 'Banco do Brasil', icon: '/icons/bb.svg' },
  { name: 'C6 Bank', icon: '/icons/c6bank.svg' },
  { name: 'Santander', icon: '/icons/santander.svg' },
  { name: 'Bradesco', icon: '/icons/bradesco.svg' },
  { name: 'Inter', icon: '/icons/inter.svg' },
  { name: 'Caixa', icon: '/icons/caixa.svg' },
];

// Função utilitária para buscar o ícone pelo nome do banco
export function getBankIconUrl(bankName: string): string {
  return banks.find(b => b.name === bankName)?.icon || '/icons/default.svg';
}
