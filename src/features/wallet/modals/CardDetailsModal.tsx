import React, { useState, useMemo } from 'react';
import { Card } from '../types/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BankIcon from '../../../components/common/BankIcon';
import LimitDonutChart from '../components/CardChart/LimitDonutChart';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { getBankIconUrl } from '../../bank-accounts/data/banks';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ isOpen, onClose, card }) => {
  // Mock data for demonstration
  const fatura = {
    valor_total: 2500.00,
    valor_pago: 1500.00,
    valor_pendente: 1000.00,
    data_vencimento: '2024-03-25',
    status: 'em_aberto'
  };

  const parcelamentos = [
    {
      id: 1,
      descricao: 'Smartphone',
      valor_total: 3000.00,
      valor_parcela: 300.00,
      parcelas_total: 10,
      parcela_atual: 2,
      data_primeira_parcela: '2024-02-15'
    },
  ];

  const transacoes = [
    {
      id: 1,
      descricao: 'Supermercado',
      valor: 150.00,
      data: '2024-03-15',
      categoria: 'Alimentação',
      parcelado: false
    },
  ];

  const [filtros, setFiltros] = useState({});
  const [showFiltros, setShowFiltros] = useState(false);

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter(transacao => {
      // Filtros omitidos para simplificação
      return true;
    });
  }, [transacoes, filtros]);

  // Cálculo do limite utilizado
  const limitUsed = (card.limit ?? 0) - (card.available_limit ?? 0);
  const percentUsed = card.limit ? Math.round((limitUsed / card.limit) * 100) : 0;

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
              iconUrl={getBankIconUrl(card.bank_name)}
              bankName={card.bank_name}
              size="lg"
            />
            <div>
              <p className="text-sm text-gray-400">{card.bank_name}</p>
              <div className="flex items-center gap-2 mt-2">
                <LimitDonutChart
                  limiteTotal={card.limit ?? 0}
                  limiteDisponivel={card.available_limit ?? 0}
                  size={40}
                />
                <span className="text-xs text-gray-400">
                  Limite usado: <span className="font-bold text-white">{percentUsed}%</span>
                </span>
                <span className="text-xs text-gray-400">
                  (R$ {(limitUsed).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {(card.limit ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
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
                  R$ {fatura.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Valor Pago</p>
                <p className="text-2xl font-semibold text-emerald-400">
                  R$ {fatura.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Valor Pendente</p>
                <p className="text-2xl font-semibold text-yellow-400">
                  R$ {fatura.valor_pendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(fatura.status)}
                  <span className={`font-semibold ${getStatusTextColor(fatura.status)}`}>
                    {getStatusText(fatura.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Próximo Vencimento</p>
                <p className="text-lg font-semibold text-white">
                  {format(new Date(fatura.data_vencimento), "dd 'de' MMMM", { locale: ptBR })}
                </p>
                <p className="text-xs text-gray-400">
                  Fechamento: {card.closing_day} | Vencimento: {card.due_day}
                </p>
              </div>
            </div>
          </section>

          {/* Parcelamentos */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Parcelamentos</h3>
            <div className="space-y-4">
              {parcelamentos.map(parcelamento => {
                const valorPago = parcelamento.valor_parcela * (parcelamento.parcela_atual - 1);
                return (
                  <div key={parcelamento.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-medium">{parcelamento.descricao}</h4>
                        <p className="text-sm text-gray-400">
                          Parcela {parcelamento.parcela_atual} de {parcelamento.parcelas_total}
                        </p>
                        <p className="text-xs text-gray-400">
                          Pago: R$ {valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        R$ {parcelamento.valor_parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${(parcelamento.parcela_atual / parcelamento.parcelas_total) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Transações */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Transações</h3>
              <button
                onClick={() => setShowFiltros(!showFiltros)}
                className="text-sm text-blue-400 hover:text-blue-300"
                type="button"
              >
                {showFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </button>
            </div>

            {/* Filtros */}
            {showFiltros && (
              <div className="bg-gray-800 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ... filtros ... */}
              </div>
            )}

            {/* Lista de Transações */}
            <div className="space-y-2">
              {transacoesFiltradas.map(transacao => (
                <div key={transacao.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{transacao.descricao}</h4>
                    <p className="text-sm text-gray-400">
                      {format(new Date(transacao.data), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">
                      R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {transacao.parcelado && (
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