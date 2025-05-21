import React from 'react';

interface LimitDonutChartProps {
  limiteTotal: number;
  limiteDisponivel: number;
  size?: number;
}

const LimitDonutChart: React.FC<LimitDonutChartProps> = ({ 
  limiteTotal, 
  limiteDisponivel,
  size = 60 
}) => {
  const valorGasto = limiteTotal - limiteDisponivel;
  const percentualGasto = (valorGasto / limiteTotal) * 100;
  
  const getColor = (percentual: number) => {
    if (percentual <= 50) return '#10B981'; // verde
    if (percentual <= 80) return '#F59E0B'; // amarelo
    return '#EF4444'; // vermelho
  };

  const strokeWidth = size * 0.15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentualGasto / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Círculo de fundo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth={strokeWidth}
        />
        {/* Círculo de progresso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(percentualGasto)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {/* Texto central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-gray-300">
          {Math.round(percentualGasto)}%
        </span>
      </div>
    </div>
  );
};

export default LimitDonutChart;
