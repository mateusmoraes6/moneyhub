import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionsProvider } from './context/TransactionsContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import AuthCallback from './pages/auth/AuthCallback';
const Login = lazy(() => import('./pages/auth/Login'));
import PrivateRoute from './components/auth/navigation/PrivateRoute';
import { AccountsProvider } from './context/AccountsContext';

// Lazy load das páginas principais para reduzir bundle inicial
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Wallet = lazy(() => import('./pages/wallet/Wallet'));
const BankAccounts = lazy(() => import('./pages/bank-accounts/BankAccounts'));
const FutureTransactions = lazy(() => import('./pages/future-transactions/FutureTransactions'));

import SplashScreen from './components/common/SplashScreen';

// Componente de loading para Suspense (transições de página)
const PageLoader = () => <LoadingSpinner />;

function App() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Mantém a splash screen por um tempo mínimo para garantir a estética
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TransactionsProvider>
      <AccountsProvider>
        <BrowserRouter>
          <ThemeProvider>
            <AnimatePresence mode="wait">
              {isInitialLoad && <SplashScreen key="splash" />}
            </AnimatePresence>
            <Routes>
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/login"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Login />
                  </Suspense>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<PageLoader />}>
                      <Dashboard />
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/wallet"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<PageLoader />}>
                      <Wallet />
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/bank-accounts"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<PageLoader />}>
                      <BankAccounts />
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/future-transactions"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<PageLoader />}>
                      <FutureTransactions />
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </AccountsProvider>
    </TransactionsProvider>
  );
}

export default App;