
import React from 'react';
import { useAccounts } from '../../../context/AccountsContext';
import { formatCurrency } from '../../../utils/formatters';
import BankIcon from '../../common/BankIcon';
import { getBankIconUrl } from '../../../features/bank-accounts/data/banks';

const AccountBalancesCard: React.FC = () => {
    const { accounts } = useAccounts();

    return (
        <section className="w-full h-full bg-gray-900 rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300 border border-gray-800 flex flex-col relative overflow-hidden group">
            {/* Background Gradient Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 opacity-50 z-0"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-emerald-600/10 transition-colors duration-500 z-0"></div>

            <div className="relative z-10 flex flex-col h-full space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Saldos por Banco</h2>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-48">
                    {accounts.length > 0 ? (
                        accounts.map((account) => (
                            <div key={account.id} className="flex items-center justify-between p-3 bg-gray-800/40 hover:bg-gray-800/80 rounded-xl transition-all duration-300 border border-gray-700/30 group/item hover:border-gray-600/50 hover:shadow-lg hover:shadow-emerald-900/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-900/80 flex items-center justify-center p-2 border border-gray-700 group-hover/item:border-gray-600 transition-colors">
                                        <BankIcon
                                            iconUrl={getBankIconUrl(account.bank_name)}
                                            bankName={account.bank_name}
                                            size="sm"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-200 group-hover/item:text-white transition-colors">{account.bank_name}</span>
                                        {/* <span className="text-[10px] text-gray-500 uppercase tracking-wider">{account.type || 'Conta'}</span> */}
                                    </div>
                                </div>
                                <span className="font-semibold text-emerald-400 group-hover/item:text-emerald-300 transition-colors whitespace-nowrap">
                                    {formatCurrency(account.balance)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-6">
                            <span className="text-sm">Nenhuma conta encontrada</span>
                        </div>
                    )}
                </div>

                {accounts.length > 0 && (
                    <div className="pt-2 border-t border-gray-800 flex justify-center items-center text-xs text-gray-500">
                        <span>Total de {accounts.length} contas</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AccountBalancesCard;
