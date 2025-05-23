export interface BankAccount {
  id: number;
  nome_banco: string;
  icone_url: string;
  apelido: string;
  tipo_conta: 'corrente' | 'poupanca' | 'investimento';
  saldo: number;
  numero_conta: string;
  agencia: string;
}

export const mockAccounts: BankAccount[] = [
  {
    id: 1,
    nome_banco: 'Nubank',
    icone_url: '/icons/nubank.svg',
    apelido: 'Conta Principal',
    tipo_conta: 'corrente',
    saldo: 5000.50,
    numero_conta: '123456-7',
    agencia: '0001',
  },
  {
    id: 2,
    nome_banco: 'Itaú',
    icone_url: '/icons/itau.svg',
    apelido: 'Poupança',
    tipo_conta: 'poupanca',
    saldo: 15000.75,
    numero_conta: '987654-3',
    agencia: '1234',
  },
  {
    id: 3,
    nome_banco: 'C6 Bank',
    icone_url: '/icons/c6bank.svg',
    apelido: 'Investimentos',
    tipo_conta: 'investimento',
    saldo: 25000.00,
    numero_conta: '456789-0',
    agencia: '5678',
  },
]; 