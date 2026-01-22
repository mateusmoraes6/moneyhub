import React, { lazy, Suspense, useRef, useEffect, useState } from 'react';
import SummaryCarousel from '../../components/dashboard/summary/SummaryCarousel';
import TransactionForm from '../../components/dashboard/transactions/TransactionForm';
import TransactionHistory from '../../components/dashboard/transactions/TransactionHistory';

// Lazy load do gráfico pesado
const ExpenseIncomeChart = lazy(() => import('../../components/dashboard/charts/ExpenseIncomeChart'));

// Componente de placeholder para o gráfico
const ChartPlaceholder = () => (
  <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 flex flex-col h-full animate-pulse">
    <div className="px-6 py-5 border-b border-gray-800/50">
      <div className="h-5 bg-gray-800 rounded w-48 mb-2"></div>
      <div className="h-3 bg-gray-800 rounded w-64"></div>
    </div>
    <div className="p-4 flex-1 min-h-[300px] flex items-center justify-center">
      <div className="text-gray-600 text-sm">Carregando gráfico...</div>
    </div>
  </div>
);


// Hook para lazy load com Intersection Observer
const useLazyLoad = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const Dashboard: React.FC = () => {
  // Lazy load do gráfico quando visível na viewport
  const desktopChartRef = useLazyLoad();
  const mobileChartRef = useLazyLoad();

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="space-y-6">
        <div className="relative z-20">
          <SummaryCarousel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TransactionForm />

            <div ref={desktopChartRef.ref} className="hidden lg:block">
              {desktopChartRef.isVisible ? (
                <Suspense fallback={<ChartPlaceholder />}>
                  <ExpenseIncomeChart />
                </Suspense>
              ) : (
                <ChartPlaceholder />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <TransactionHistory />

            <div ref={mobileChartRef.ref} className="block lg:hidden">
              {mobileChartRef.isVisible ? (
                <Suspense fallback={<ChartPlaceholder />}>
                  <ExpenseIncomeChart />
                </Suspense>
              ) : (
                <ChartPlaceholder />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;