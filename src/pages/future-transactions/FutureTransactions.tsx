import React, { useState, useMemo } from 'react';
import { useTransactions } from '../../context/TransactionsContext';
import { format, addMonths, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, TrendingDown, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const FutureTransactions: React.FC = () => {
    const { transactions, loading } = useTransactions();
    const [selectedDate, setSelectedDate] = useState(() => addMonths(new Date(), 1)); // Default to next month

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setSelectedDate(prev => addMonths(prev, direction === 'next' ? 1 : -1));
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const tDate = parseISO(t.date);
            // Only future transactions (strict future logic could be tDate > today, but user asked for "Next Month" view logic)
            // Here we prioritize the selected month view.
            return isSameMonth(tDate, selectedDate);
        }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    }, [transactions, selectedDate]);

    const stats = useMemo(() => {
        const total = filteredTransactions.reduce((acc, t) => {
            if (t.type === 'expense') return acc + Number(t.amount);
            return acc; // Ignoring income for "Lançamentos Futuros" usually focuses on bills/expenses, but we can standardly subtract income if needed. 
            // User context: "informar o lançamento futuro ... relacionado aos gastos". So Focus on Expenses.
        }, 0);

        const creditCardTotal = filteredTransactions.reduce((acc, t) => {
            if (t.type === 'expense' && t.payment_method === 'credit') return acc + Number(t.amount);
            return acc;
        }, 0);

        const otherTotal = total - creditCardTotal;

        return { total, creditCardTotal, otherTotal };
    }, [filteredTransactions]);

    if (loading) {
        return (
            <div className="h-full bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl text-white">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-500 rounded-full p-2.5">
                    <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Lançamentos Futuros</h1>
                    <p className="text-gray-400">Previsão de gastos e parcelas para os próximos meses</p>
                </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-gray-900 p-4 rounded-xl border border-gray-800 mb-8">
                <button
                    onClick={() => handleMonthChange('prev')}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    disabled={isSameMonth(selectedDate, addMonths(new Date(), 1))} // Limit to next month as start?
                >
                    <ChevronLeft className={`w-6 h-6 ${isSameMonth(selectedDate, addMonths(new Date(), 1)) ? 'text-gray-600' : 'text-emerald-500'}`} />
                </button>

                <div className="text-center">
                    <h2 className="text-xl font-bold capitalize">
                        {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {filteredTransactions.length} lançamentos previstos
                    </p>
                </div>

                <button
                    onClick={() => handleMonthChange('next')}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <ChevronRight className="w-6 h-6 text-emerald-500" />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-medium mb-1">Total Previsto</p>
                        <h3 className="text-3xl font-bold text-white">{formatCurrency(stats.total)}</h3>
                    </div>
                    <TrendingDown className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 text-emerald-500/10" />
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-medium mb-1">Cartão de Crédito</p>
                        <h3 className="text-3xl font-bold text-blue-400">{formatCurrency(stats.creditCardTotal)}</h3>
                    </div>
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 text-blue-500/10" />
                </div>

                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-medium mb-1">Outros Gastos</p>
                        <h3 className="text-3xl font-bold text-gray-400">{formatCurrency(stats.otherTotal)}</h3>
                    </div>
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 text-gray-500/10" />
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold">Detalhamento</h3>
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-white font-medium mb-2">Sem lançamentos previstos</h3>
                        <p className="text-gray-400">Não há gastos futuros registrados para este mês.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.payment_method === 'credit' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                        {transaction.payment_method === 'credit' ? <CreditCard className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{transaction.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span>{format(parseISO(transaction.date), 'dd/MM/yyyy')}</span>
                                            {transaction.installment_num && (
                                                <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs text-white border border-gray-700">
                                                    Parcela {transaction.installment_num}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <span className="font-bold text-red-400">
                                    - {formatCurrency(Number(transaction.amount))}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FutureTransactions;
