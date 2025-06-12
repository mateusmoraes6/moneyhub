import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BankAccountDetails } from '../../data/mockAccounts';

interface AccountChartProps {
  historico: BankAccountDetails['historico_saldo'];
}

const AccountChart: React.FC<AccountChartProps> = ({ historico }) => {
  return (
    <div className="mt-4 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={historico || []}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="data"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            tickFormatter={(tickItem) => {
              const [year, month] = tickItem.split('-');
              return `${month} - ${year.slice(2)}`;
            }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: 12
            }}
          />
          <Line
            type="monotone"
            dataKey="valor"
            name="Saldo"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="gastos"
            name="Gastos"
            stroke="#EF4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="receitas"
            name="Receitas"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccountChart;
