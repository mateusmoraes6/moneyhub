import React, { useMemo } from 'react';
import { useTransactions } from '../../../context/TransactionsContext';
import { format, addMonths, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CreditCard, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

const FutureProjectionCard: React.FC = () => {
    const { transactions } = useTransactions();

    const nextMonthDate = useMemo(() => addMonths(new Date(), 1), []);

    const nextMonthStats = useMemo(() => {
        const nextMonthTransactions = transactions.filter(t =>
            isSameMonth(parseISO(t.date), nextMonthDate)
        );

        const total = nextMonthTransactions.reduce((acc, t) => {
            if (t.type === 'expense') return acc + Number(t.amount);
            return acc;
        }, 0);

        const creditCardTotal = nextMonthTransactions.reduce((acc, t) => {
            if (t.type === 'expense' && t.payment_method === 'credit') return acc + Number(t.amount);
            return acc;
        }, 0);

        return { total, creditCardTotal, count: nextMonthTransactions.length };
    }, [transactions, nextMonthDate]);

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const futureTransactions = useMemo(() => {
        const today = new Date().toLocaleDateString('en-CA');
        return transactions
            .filter(t => t.date > today)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [transactions]);

    return (
        <>
            <section
                onClick={() => setIsModalOpen(true)}
                className="w-full h-full bg-gray-900 rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300 border border-gray-800 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-gray-700 hover:shadow-lg hover:shadow-blue-900/10"
            >
                {/* Background Gradient Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/10 transition-colors duration-500"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-500/20 p-2 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-400" />
                            </div>
                            <h2 className="text-sm font-medium text-gray-400">Lançamentos Futuros</h2>
                        </div>
                        <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">{futureTransactions.length} agendados</span>
                    </div>

                    <div className="space-y-1 mb-6">
                        <div className="text-3xl md:text-4xl font-bold text-white">
                            {formatCurrency(nextMonthStats.total)}
                        </div>
                        <p className="text-sm text-gray-500">Previsto para <span className="text-gray-300 capitalize">{format(nextMonthDate, 'MMMM', { locale: ptBR })}</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard className="w-4 h-4 text-purple-400" />
                                <span className="text-xs text-gray-400">Faturas Cartão</span>
                            </div>
                            <span className="text-lg font-semibold text-purple-400">{formatCurrency(nextMonthStats.creditCardTotal)}</span>
                        </div>

                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingDown className="w-4 h-4 text-red-400" />
                                <span className="text-xs text-gray-400">Total Lançamentos</span>
                            </div>
                            <span className="text-lg font-semibold text-white">{nextMonthStats.count}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-blue-400 font-medium">Ver detalhes &rarr;</p>
                </div>
            </section>

            {/* Modal de Lançamentos Futuros */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-scaleIn">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-gray-900/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    Lançamentos Futuros
                                </h2>
                                <p className="text-sm text-gray-400">Transações agendadas e parcelas futuras</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(false);
                                }}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <span className="sr-only">Fechar</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {futureTransactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-400 font-medium">Nenhum lançamento futuro encontrado</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {futureTransactions.map((transaction) => (
                                        <div key={transaction.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-800 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {transaction.type === 'income' ? <TrendingDown className="w-5 h-5 rotate-180" /> : <TrendingDown className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{transaction.description}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                        <span>{format(parseISO(transaction.date), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{transaction.payment_method === 'credit' ? 'Crédito' : 'Débito/Pix'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(Number(transaction.amount))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-900/80 border-t border-gray-800 p-4 rounded-b-2xl text-center">
                            <p className="text-xs text-gray-500">
                                Mostrando todos os lançamentos a partir de amanhã
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default FutureProjectionCard;
