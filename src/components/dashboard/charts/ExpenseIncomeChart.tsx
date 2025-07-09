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
        labels: {
          color: '#d1d5db',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
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
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value: any) {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0
            }).format(value);
          }
        },
        beginAtZero: true
      }
    },
  };

  const data = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Receitas',
        data: monthlyData.incomes,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Despesas',
        data: monthlyData.expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Receitas vs. Despesas</h3>
      <div className="h-64 w-full">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default ExpenseIncomeChart; 