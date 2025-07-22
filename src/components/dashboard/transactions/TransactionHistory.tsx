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
  Building2,
  CreditCard
} from 'lucide-react';

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
    return transactions.filter(transaction => {
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

  const filteredTransactions = getFilteredTransactions();
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
        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
      >
        <History className="w-5 h-5" />
        <span>Histórico de Transações</span>
      </button>

      {/* Modal de histórico de transações */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            {/* Cabeçalho da modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Histórico de Transações</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filtros */}
            <div className="p-4 border-b border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filtro por texto */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Buscar por descrição..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                  />
                </div>

                {/* Filtro por tipo */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setFilterType(null);
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      filterType === null
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => {
                      setFilterType('income');
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      filterType === 'income'
                        ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Receitas
                  </button>
                  <button
                    onClick={() => {
                      setFilterType('expense');
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      filterType === 'expense'
                        ? 'bg-red-900/40 text-red-300 border border-red-500'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Despesas
                  </button>
                </div>
              </div>

              {/* Botão para mostrar/ocultar filtros avançados */}
              <button
                onClick={() => setShowAdvancedFilters((prev) => !prev)}
                className="mt-3 text-sm text-gray-400 hover:text-white flex items-center"
                type="button"
              >
                <Filter className="w-4 h-4 mr-1" />
                {showAdvancedFilters ? 'Ocultar filtros avançados' : 'Filtros avançados'}
              </button>

              {/* Filtros avançados (mês e data) */}
              {showAdvancedFilters && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Selecione um mês
                    </label>
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
                      className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                    >
                      <option value="">Todos os meses</option>
                      {getMonthOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          De
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            if (e.target.value) setSelectedMonth('');
                            setCurrentPage(1);
                          }}
                          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Até
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            if (e.target.value) setSelectedMonth('');
                            setCurrentPage(1);
                          }}
                          min={startDate}
                          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão para limpar filtros */}
              {(filterType || searchQuery || startDate || endDate || selectedMonth) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-gray-400 hover:text-white flex items-center"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Lista de transações */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    Nenhuma transação encontrada com os filtros aplicados.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentTransactions.map(transaction => (
                    <TransactionItem key={transaction.id} transaction={transaction} showBankOrCardIcon />
                  ))}
                </div>
              )}
            </div>

            {/* Controles de paginação */}
            {filteredTransactions.length > 0 && (
              <div className="border-t border-gray-800 p-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-sm text-gray-400">
                  Página {currentPage} de {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">Transações Recentes</h3>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 3).map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} showBankOrCardIcon />
            ))}
            {transactions.length > 3 && (
              <button
                onClick={openModal}
                className="w-full text-center text-sm text-gray-400 hover:text-white py-2"
              >
                Ver todas ({transactions.length})
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionHistory;
