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

    return (
        <section className="w-full h-full bg-gray-900 rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300 border border-gray-800 flex flex-col justify-between relative overflow-hidden group">
            {/* Background Gradient Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/10 transition-colors duration-500"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500/20 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-sm font-medium text-gray-400">Previsão: <span className="text-white capitalize">{format(nextMonthDate, 'MMMM yyyy', { locale: ptBR })}</span></h2>
                    </div>
                </div>

                <div className="space-y-1 mb-6">
                    <div className="text-3xl md:text-4xl font-bold text-white">
                        {formatCurrency(nextMonthStats.total)}
                    </div>
                    <p className="text-sm text-gray-500">Total estimado de saídas</p>
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
                            <span className="text-xs text-gray-400">Lançamentos</span>
                        </div>
                        <span className="text-lg font-semibold text-white">{nextMonthStats.count}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FutureProjectionCard;
