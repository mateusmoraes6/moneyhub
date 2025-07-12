import React, { useState, useMemo } from 'react';
import { Card } from '../types/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BankIcon from '../../../components/common/BankIcon';
import LimitDonutChart from '../components/CardChart/LimitDonutChart';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { getBankIconUrl } from '../../bank-accounts/data/banks';
import { useCardDetails } from '../hooks/useCardDetails';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ isOpen, onClose, card }) => {
  // Use o hook para buscar dados reais
  const { card: cardData, transactions, installments, loading } = useCardDetails(card.id);

  if (!isOpen) return null;
  if (loading) return <div className="p-8 text-white">Carregando...</div>;
  if (!cardData) return <div className="p-8 text-red-400">Cartão não encontrado.</div>;

  // Cálculo do limite utilizado
  const limitUsed = (cardData.limit ?? 0) - (cardData.available_limit ?? 0);
  const percentUsed = cardData.limit ? Math.round((limitUsed / cardData.limit) * 100) : 0;

  // Exemplo de cálculo de fatura (ajuste conforme sua lógica de fechamento/vencimento)
  const valor_total = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const valor_pago = transactions.filter(t => t.status === 'paid').reduce((acc, t) => acc + (t.amount || 0), 0);
  const valor_pendente = valor_total - valor_pago;

  // Função para cor do texto do status
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'pago': return 'text-emerald-400';
      case 'em_aberto': return 'text-yellow-400';
      case 'atrasado': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Função para ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago': return <CheckCircle2 className="w-5 h-5 text-emerald-400 inline" />;
      case 'em_aberto': return <Clock className="w-5 h-5 text-yellow-400 inline" />;
      case 'atrasado': return <AlertCircle className="w-5 h-5 text-red-400 inline" />;
      default: return null;
    }
  };

  if (!isOpen) return null;

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago';
      case 'em_aberto': return 'Em Aberto';
      case 'atrasado': return 'Atrasado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 w-full md:w-[90%] lg:w-[800px] h-[90vh] md:h-[80vh] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col">
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BankIcon
              iconUrl={getBankIconUrl(cardData.bank_name)}
              bankName={cardData.bank_name}
              size="lg"
            />
            <div>
              <p className="text-sm text-gray-400">{cardData.bank_name}</p>
              <div className="flex items-center gap-2 mt-2">
                <LimitDonutChart
                  limiteTotal={cardData.limit ?? 0}
                  limiteDisponivel={cardData.available_limit ?? 0}
                  size={40}
                />
                <span className="text-xs text-gray-400">
                  Limite usado: <span className="font-bold text-white">{percentUsed}%</span>
                </span>
                <span className="text-xs text-gray-400">
                  (R$ {(limitUsed).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {(cardData.limit ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Resumo da Fatura */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Resumo da Fatura</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Valor Total</p>
                <p className="text-2xl font-semibold text-white">
                  R$ {valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Valor Pago</p>
                <p className="text-2xl font-semibold text-emerald-400">
                  R$ {valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Valor Pendente</p>
                <p className="text-2xl font-semibold text-yellow-400">
                  R$ {valor_pendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon('em_aberto')}
                  <span className={`font-semibold ${getStatusTextColor('em_aberto')}`}>
                    {getStatusText('em_aberto')}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Próximo Vencimento</p>
                <p className="text-lg font-semibold text-white">
                  {cardData.due_day}
                </p>
                <p className="text-xs text-gray-400">
                  Fechamento: {cardData.closing_day} | Vencimento: {cardData.due_day}
                </p>
              </div>
            </div>
          </section>

          {/* Parcelamentos */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Parcelamentos</h3>
            <div className="space-y-4">
              {installments.length === 0 && (
                <div className="text-sm text-gray-400 italic">
                  As informações aparecerão aqui após uma transação parcelada com este cartão.
                </div>
              )}
              {installments.map(parcelamento => (
                <div key={parcelamento.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-medium">{parcelamento.description}</h4>
                      <p className="text-sm text-gray-400">
                        {parcelamento.num_installments} parcelas de R$ {(parcelamento.total / parcelamento.num_installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-400">
                        Início: {parcelamento.start_date && new Date(parcelamento.start_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      R$ {parcelamento.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Transações */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Transações</h3>
            <div className="space-y-2">
              {transactions.length === 0 && (
                <div className="text-sm text-gray-400 italic">
                  As informações aparecerão aqui após uma transação usando este cartão.
                </div>
              )}
              {transactions.map(transacao => (
                <div key={transacao.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{transacao.description}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(transacao.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">
                      R$ {transacao.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {transacao.installment_id && (
                      <span className="text-xs text-blue-400">Parcelado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal; 