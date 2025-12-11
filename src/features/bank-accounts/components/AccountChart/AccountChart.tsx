import React from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Account } from '../../types/account';

interface AccountChartProps {
  historico: Account['historico_saldo'];
  variant?: 'simple' | 'detailed';
  height?: number;
}

const AccountChart: React.FC<AccountChartProps> = ({ historico, variant = 'simple', height = 128 }) => {
  const data = historico || [];

  if (variant === 'simple') {
    return (
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: 12,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#9CA3AF' }}
              itemStyle={{ color: '#10B981' }}
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Saldo']}
              labelFormatter={() => ''}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Detailed view for Modal
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis
            dataKey="data"
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 10 }}
            tickFormatter={(tickItem) => {
              if (!tickItem) return '';
              const parts = tickItem.split('-');
              if (parts.length < 2) return tickItem;
              return `${parts[1]}/${parts[0].slice(2)}`;
            }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#6B7280"
            tick={{ fill: '#6B7280', fontSize: 10 }}
            tickFormatter={(value: number) => `R$${(value / 1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: 12,
              padding: '8px 12px'
            }}
          />
          <Line
            type="monotone"
            dataKey="valor"
            name="Saldo"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#064E3B' }}
          />
          <Line
            type="monotone"
            dataKey="receitas"
            name="Receitas"
            stroke="#3B82F6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="gastos"
            name="Gastos"
            stroke="#EF4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccountChart;
