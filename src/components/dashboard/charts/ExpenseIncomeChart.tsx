import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTransactions } from '../../../context/TransactionsContext';

// Registrar os componentes necessários do ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseIncomeChart: React.FC = () => {
  const { transactions } = useTransactions();
  const [monthlyData, setMonthlyData] = useState<{
    labels: string[];
    incomes: number[];
    expenses: number[];
  }>({
    labels: [],
    incomes: [],
    expenses: [],
  });

  useEffect(() => {
    // Agrupar transações por mês do ano atual
    const groupedByMonth: Record<string, { income: number; expense: number }> = {};

    const currentYear = new Date().getFullYear();
    // Gerar todos os meses do ano atual
    for (let m = 0; m < 12; m++) {
      const date = new Date(currentYear, m, 1);
      const monthKey = date.toISOString().slice(0, 7); // formato YYYY-MM
      groupedByMonth[monthKey] = { income: 0, expense: 0 };
    }

    // Somar transações por mês e tipo
    transactions.forEach(transaction => {
      const monthKey = transaction.date.slice(0, 7);
      if (groupedByMonth[monthKey]) {
        if (transaction.type === 'income') {
          groupedByMonth[monthKey].income += transaction.amount;
        } else {
          groupedByMonth[monthKey].expense += transaction.amount;
        }
      }
    });

    // Preparar dados para o gráfico (todos os meses do ano em ordem cronológica)
    const sortedMonths = Object.keys(groupedByMonth)
      .sort((a, b) => a.localeCompare(b));

    const labels = sortedMonths.map(monthKey => {
      const [year, month] = monthKey.split('-').map(Number);
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('pt-BR', { month: 'short' });
    });

    const incomes = sortedMonths.map(month => groupedByMonth[month].income);
    const expenses = sortedMonths.map(month => groupedByMonth[month].expense);

    setMonthlyData({ labels, incomes, expenses });
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#9ca3af',
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(75, 85, 99, 0.4)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        border: {
          display: false
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10
          },
          callback: function (value: any) {
            if (value >= 1000) {
              return 'R$ ' + (value / 1000).toFixed(0) + 'k';
            }
            return value;
          }
        },
        beginAtZero: true
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  const data = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Receitas',
        data: monthlyData.incomes,
        backgroundColor: '#10b981', // Emerald 500 flat
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: 'Despesas',
        data: monthlyData.expenses,
        backgroundColor: '#ef4444', // Red 500 flat
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
    ],
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-800/50">
        <h3 className="text-base font-semibold text-white">Fluxo de Caixa Anual</h3>
        <p className="text-xs text-gray-500 mt-1">Comparativo mensal de entradas e saídas</p>
      </div>
      <div className="p-4 flex-1 min-h-[300px]">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default ExpenseIncomeChart; 