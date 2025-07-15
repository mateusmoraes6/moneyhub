import React from "react";

interface InstallmentProgressBarProps {
  total: number;
  paid: number;
}

const InstallmentProgressBar: React.FC<InstallmentProgressBarProps> = ({ total, paid }) => {
  const percent = total > 0 ? (paid / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-white">{paid}/{total}</span>
        <span className="text-sm font-medium text-white">{Math.round(percent)}%</span>
      </div>
      <div className="relative w-full h-4 md:h-4 lg:h-4 xl:h-4" style={{ height: "16px" }}>
        {/* Barra de fundo (pendente) */}
        <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-full" />
        {/* Barra de progresso (pago) */}
        <div
          className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default InstallmentProgressBar;
