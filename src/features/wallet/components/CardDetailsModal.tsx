import React, { useState, useMemo } from 'react';
import { Card, Fatura, Parcelamento, Transacao, FiltrosTransacao } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ isOpen, onClose, card }) => {
  const [filtros, setFiltros] = useState<FiltrosTransacao>({});
  const [showFiltros, setShowFiltros] = useState(false);

  // Dados mockados para exemplo
  const fatura: Fatura = {
    valor_total: 2500.00,
    valor_pago: 1500.00,
    valor_pendente: 1000.00,
    data_vencimento: '2024-03-25',
    status: 'em_aberto'
  };

  const parcelamentos: Parcelamento[] = [
    {
      id: 1,
      descricao: 'Smartphone',
      valor_total: 3000.00,
      valor_parcela: 300.00,
      parcelas_total: 10,
      parcela_atual: 2,
      data_primeira_parcela: '2024-02-15'
    },
    // Adicione mais parcelamentos conforme necessário
  ];

  const transacoes: Transacao[] = [
    {
      id: 1,
      descricao: 'Supermercado',
      valor: 150.00,
      data: '2024-03-15',
      categoria: 'Alimentação',
      parcelado: false
    },
    // Adicione mais transações conforme necessário
  ];

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter(transacao => {
      if (filtros.categoria && transacao.categoria !== filtros.categoria) return false;
      if (filtros.data_inicio && transacao.data < filtros.data_inicio) return false;
      if (filtros.data_fim && transacao.data > filtros.data_fim) return false;
      if (filtros.valor_min && transacao.valor < filtros.valor_min) return false;
      if (filtros.valor_max && transacao.valor > filtros.valor_max) return false;
      return true;
    });
  }, [transacoes, filtros]);

  if (!isOpen) return null;

  const getStatusColor = (status: Fatura['status']) => {
    switch (status) {
      case 'pago': return 'bg-emerald-500';
      case 'em_aberto': return 'bg-yellow-500';
      case 'atrasado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Fatura['status']) => {
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
          <div className="flex items-center gap-3">
            <img 
              src={card.icone_url} 
              alt={card.nome_banco} 
              className="w-12 h-12 rounded-lg bg-white p-0.5"
            />
            <div>
              <h2 className="text-xl font-semibold text-white">{card.apelido}</h2>
              <p className="text-sm text-gray-400">{card.nome_banco}</p>
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
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Vencimento</p>
                <p className="text-2xl font-semibold text-white">
                  {format(new Date(fatura.data_vencimento), "dd 'de' MMMM", { locale: ptBR })}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs text-white mt-2 ${getStatusColor(fatura.status)}`}>
                  {getStatusText(fatura.status)}
                </span>
              </div>
            </div>
          </section>

          {/* Parcelamentos */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Parcelamentos</h3>
            <div className="space-y-4">
              {parcelamentos.map(parcelamento => (
                <div key={parcelamento.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-medium">{parcelamento.descricao}</h4>
                      <p className="text-sm text-gray-400">
                        Parcela {parcelamento.parcela_atual} de {parcelamento.parcelas_total}
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
              ))}
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
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Categoria</label>
                  <select
                    className="w-full bg-gray-700 text-white rounded-lg p-2"
                    value={filtros.categoria || ''}
                    onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value || undefined })}
                  >
                    <option value="">Todas</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Lazer">Lazer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Período</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="bg-gray-700 text-white rounded-lg p-2"
                      value={filtros.data_inicio || ''}
                      onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value || undefined })}
                    />
                    <input
                      type="date"
                      className="bg-gray-700 text-white rounded-lg p-2"
                      value={filtros.data_fim || ''}
                      onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value || undefined })}
                    />
                  </div>
                </div>
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