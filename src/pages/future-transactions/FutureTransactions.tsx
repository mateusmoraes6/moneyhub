import React, { useState, useMemo } from 'react';
import { useTransactions } from '../../context/TransactionsContext';
import { format, addMonths, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, TrendingDown, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

import { motion } from 'framer-motion';

const FutureTransactions: React.FC = () => {
    const { transactions, loading } = useTransactions();
    const [selectedDate, setSelectedDate] = useState(() => addMonths(new Date(), 1)); // Default to next month

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setSelectedDate(prev => addMonths(prev, direction === 'next' ? 1 : -1));
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const tDate = parseISO(t.date);
            return isSameMonth(tDate, selectedDate);
        }).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    }, [transactions, selectedDate]);

    const stats = useMemo(() => {
        const total = filteredTransactions.reduce((acc, t) => {
            if (t.type === 'expense') return acc + Number(t.amount);
            return acc;
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 max-w-6xl space-y-8 text-white"
        >
            {/* Header & Stats Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-5 sm:p-6 shadow-2xl">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10 space-y-6">
                    {/* Header Row: Logo, Title, Subtitle */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 rounded-lg shadow-lg shadow-emerald-500/20 flex-shrink-0">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl sm:text-2xl font-bold text-white tracking-tight">Lançamentos Futuros</h1>
                                <p className="text-gray-400 text-xs sm:text-sm">Previsão de gastos e parcelas para os próximos meses</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingDown className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Previsto</span>
                            </div>
                            <motion.div
                                key={stats.total}
                                initial={{ scale: 0.95, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-lg sm:text-xl font-bold text-white truncate"
                            >
                                {formatCurrency(stats.total)}
                            </motion.div>
                        </div>

                        <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Cartão de Crédito</span>
                            </div>
                            <motion.div
                                key={stats.creditCardTotal}
                                initial={{ scale: 0.95, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-lg sm:text-xl font-bold text-blue-400 truncate"
                            >
                                {formatCurrency(stats.creditCardTotal)}
                            </motion.div>
                        </div>

                        <div className="flex flex-col bg-gray-900/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Outros Gastos</span>
                            </div>
                            <motion.div
                                key={stats.otherTotal}
                                initial={{ scale: 0.95, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-lg sm:text-xl font-bold text-gray-300 truncate"
                            >
                                {formatCurrency(stats.otherTotal)}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
                <button
                    onClick={() => handleMonthChange('prev')}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                    disabled={isSameMonth(selectedDate, addMonths(new Date(), 1))}
                >
                    <ChevronLeft className={`w-6 h-6 transition-colors ${isSameMonth(selectedDate, addMonths(new Date(), 1)) ? 'text-gray-600' : 'text-emerald-500 group-hover:text-emerald-400'}`} />
                </button>

                <div className="text-center">
                    <h2 className="text-xl font-bold capitalize text-white">
                        {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {filteredTransactions.length} lançamentos previstos
                    </p>
                </div>

                <button
                    onClick={() => handleMonthChange('next')}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                >
                    <ChevronRight className="w-6 h-6 text-emerald-500 group-hover:text-emerald-400" />
                </button>
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
        </motion.div>
    );
};

export default FutureTransactions;
