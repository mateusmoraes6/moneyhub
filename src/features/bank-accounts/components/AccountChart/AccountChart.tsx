import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Account } from '../../types/account';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface AccountChartProps {
  historico: Account['historico_saldo'];
  variant?: 'simple' | 'detailed';
  height?: number;
}

const AccountChart: React.FC<AccountChartProps> = ({ historico, variant = 'simple', height = 128 }) => {
  const data = historico || [];

  // Preparar dados para Chart.js
  const chartData = useMemo(() => {
    const labels = data.map(item => {
      if (!item.data) return '';
      const parts = item.data.split('-');
      if (parts.length < 2) return item.data;
      return `${parts[1]}/${parts[0].slice(2)}`;
    });

    return {
      labels,
      datasets: variant === 'simple'
        ? [
            {
              label: 'Saldo',
              data: data.map(item => item.valor),
              borderColor: '#10B981',
              backgroundColor: (context: any) => {
                if (!context.chart.chartArea) {
                  return 'rgba(16, 185, 129, 0.3)';
                }
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  return 'rgba(16, 185, 129, 0.3)';
                }
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                return gradient;
              },
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
            }
          ]
        : [
            {
              label: 'Saldo',
              data: data.map(item => item.valor),
              borderColor: '#10B981',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: '#10B981',
              pointBorderColor: '#10B981',
              pointHoverBackgroundColor: '#064E3B',
              pointHoverBorderColor: '#10B981',
              pointHoverBorderWidth: 2,
            },
            {
              label: 'Receitas',
              data: data.map(item => item.receitas || 0),
              borderColor: '#3B82F6',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
            },
            {
              label: 'Gastos',
              data: data.map(item => item.gastos || 0),
              borderColor: '#EF4444',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
            }
          ]
    };
  }, [data, variant]);

  const options = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: variant === 'detailed',
          position: 'top' as const,
          labels: {
            color: '#9CA3AF',
            font: {
              size: 10
            },
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
          }
        },
        tooltip: {
          backgroundColor: variant === 'simple' ? '#1F2937' : '#111827',
          borderColor: '#374151',
          borderWidth: 1,
          borderRadius: 8,
          padding: variant === 'simple' ? 8 : 12,
          titleColor: variant === 'simple' ? 'transparent' : '#9CA3AF',
          bodyColor: variant === 'simple' ? '#10B981' : '#fff',
          titleFont: {
            size: 0
          },
          bodyFont: {
            size: 12
          },
          displayColors: variant === 'detailed',
          usePointStyle: true,
          callbacks: {
            label: function (context: any) {
              if (variant === 'simple') {
                return `R$ ${context.parsed.y.toFixed(2)}`;
              }
              const label = context.dataset.label || '';
              const value = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y);
              return `${label}: ${value}`;
            },
            title: function () {
              return '';
            }
          }
        }
      },
      scales: variant === 'detailed' ? {
        x: {
          grid: {
            display: true,
            color: '#374151',
            drawBorder: false,
            drawOnChartArea: true,
            drawTicks: false,
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 10
            },
            padding: 10,
          },
          border: {
            display: false
          }
        },
        y: {
          grid: {
            display: true,
            color: '#374151',
            drawBorder: false,
            drawTicks: false,
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 10
            },
            padding: -10,
            callback: function (value: any) {
              return `R$${(value / 1000).toFixed(0)}k`;
            }
          },
          border: {
            display: false
          }
        }
      } : {
        x: {
          display: false
        },
        y: {
          display: false
        }
      },
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
    };

    return baseOptions;
  }, [variant]);

  return (
    <div style={{ height }} className="w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AccountChart;
