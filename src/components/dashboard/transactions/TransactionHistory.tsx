import React, { useState } from 'react';
import { useTransactions } from '../../../context/TransactionsContext';
import TransactionItem from './TransactionItem';
import {
  ChevronLeft,
  ChevronRight,
  History,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { groupTransactions } from '../../../utils/transactionUtils';

const TransactionHistory: React.FC = () => {
  const { transactions } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // Formatar data para exibição em português
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return new Intl.DateTimeFormat('pt-BR', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric'
  //   }).format(date);
  // };

  // Gerar opções para o seletor de mês
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      const value = date.toISOString().slice(0, 7); // formato YYYY-MM

      options.push({ label: monthYear, value });
    }

    return options;
  };

  // Filtrar transações com base nos critérios
  const getFilteredTransactions = () => {
    const today = new Date().toLocaleDateString('en-CA');

    return transactions.filter(transaction => {
      // Excluir transações futuras (Lançamentos Futuros)
      if (transaction.date > today) return false;

      // Filtro por tipo (receita/despesa)
      if (filterType && transaction.type !== filterType) return false;

      // Filtro por texto de busca
      if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filtro por mês específico
      if (selectedMonth) {
        const transactionMonth = transaction.date.slice(0, 7);
        if (transactionMonth !== selectedMonth) return false;
      }

      // Filtro por intervalo de datas
      if (startDate && endDate) {
        const transactionDate = new Date(transaction.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59); // Incluir o dia inteiro

        if (transactionDate < start || transactionDate > end) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const rawFilteredTransactions = getFilteredTransactions();

  // Agrupar transações se não houver filtro de data específico (mês ou intervalo)
  // Isso melhora a visualização de compras parceladas
  const shouldGroup = !selectedMonth && !startDate && !endDate;
  const filteredTransactions = shouldGroup
    ? groupTransactions(rawFilteredTransactions)
    : rawFilteredTransactions;
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Manipulador para limpar todos os filtros
  const clearFilters = () => {
    setFilterType(null);
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setSelectedMonth('');
    setCurrentPage(1);
  };

  const openModal = () => {
    setIsModalOpen(true);
    // Quando abrir a modal, limpar os filtros e voltar para a primeira página
    clearFilters();
  };

  return (
    <>
      {/* Botão para abrir o histórico de transações */}
      <button
        onClick={openModal}
        className="group w-full h-[60px] bg-gray-800 hover:bg-gray-750 border border-gray-700/50 hover:border-gray-600 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <History className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
        <span className="font-medium text-gray-300 group-hover:text-white transition-colors">Histórico de Transações</span>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors absolute right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 duration-300" />
      </button>

      {/* Modal de histórico de transações */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fadeInUp">
            {/* Cabeçalho da modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-gray-900/50 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  Histórico
                </h2>
                <p className="text-sm text-gray-400">Visualize e filtre suas movimentações</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filtros */}
            <div className="p-4 border-b border-gray-800 bg-gray-800/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filtro por texto */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Buscar por descrição..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Filtro por tipo */}
                <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
                  <button
                    onClick={() => {
                      setFilterType(null);
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all ${filterType === null
                      ? 'bg-gray-700 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                      }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => {
                      setFilterType('income');
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all ${filterType === 'income'
                      ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                      : 'text-gray-400 hover:text-emerald-400/80'
                      }`}
                  >
                    Receitas
                  </button>
                  <button
                    onClick={() => {
                      setFilterType('expense');
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all ${filterType === 'expense'
                      ? 'bg-red-500/20 text-red-400 shadow-sm'
                      : 'text-gray-400 hover:text-red-400/80'
                      }`}
                  >
                    Despesas
                  </button>
                </div>
              </div>

              {/* Botão para mostrar/ocultar filtros avançados */}
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => setShowAdvancedFilters((prev) => !prev)}
                  className={`text-sm flex items-center gap-1.5 transition-colors ${showAdvancedFilters ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                  type="button"
                >
                  <Filter className="w-4 h-4" />
                  {showAdvancedFilters ? 'Ocultar filtros avançados' : 'Filtros avançados'}
                </button>

                {(filterType || searchQuery || startDate || endDate || selectedMonth) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Limpar filtros
                  </button>
                )}
              </div>

              {/* Filtros avançados (mês e data) */}
              {showAdvancedFilters && (
                <div className="mt-4 pt-4 border-t border-gray-700/50 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                      Mês de Referência
                    </label>
                    <div className="relative">
                      <select
                        value={selectedMonth}
                        onChange={(e) => {
                          setSelectedMonth(e.target.value);
                          if (e.target.value) {
                            setStartDate('');
                            setEndDate('');
                          }
                          setCurrentPage(1);
                        }}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none appearance-none"
                      >
                        <option value="">Todos os meses</option>
                        {getMonthOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                      Intervalo Personalizado
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          if (e.target.value) setSelectedMonth('');
                          setCurrentPage(1);
                        }}
                        className="flex-1 p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none text-sm"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          if (e.target.value) setSelectedMonth('');
                          setCurrentPage(1);
                        }}
                        min={startDate}
                        className="flex-1 p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de transações */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-900/50">
              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="bg-gray-800/50 p-4 rounded-full mb-3">
                    <Search className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Nenhuma transação encontrada</p>
                  <p className="text-xs mt-1 opacity-70">Tente ajustar seus filtros</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentTransactions.map(transaction => (
                    <TransactionItem key={transaction.id} transaction={transaction} showBankOrCardIcon />
                  ))}
                </div>
              )}
            </div>

            {/* Controles de paginação */}
            {filteredTransactions.length > 0 && (
              <div className="border-t border-gray-800 p-4 bg-gray-900/80 rounded-b-2xl flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-medium text-gray-400">
                  Página <span className="text-white">{currentPage}</span> / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mini-resumo de transações recentes (visível quando o modal está fechado) */}
      {!isModalOpen && transactions.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Últimas Movimentações</h3>
            <button
              onClick={openModal}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-2">
            {groupTransactions(transactions).slice(0, 3).map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} showBankOrCardIcon />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionHistory;
