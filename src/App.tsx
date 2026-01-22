import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionsProvider } from './context/TransactionsContext';
import AuthCallback from './pages/auth/AuthCallback';
import Login from './pages/auth/Login';
import PrivateRoute from './components/auth/navigation/PrivateRoute';
import { AccountsProvider } from './context/AccountsContext';

// Lazy load das páginas principais para reduzir bundle inicial
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Wallet = lazy(() => import('./pages/wallet/Wallet'));
const BankAccounts = lazy(() => import('./pages/bank-accounts/BankAccounts'));
const FutureTransactions = lazy(() => import('./pages/future-transactions/FutureTransactions'));

// Componente de loading para Suspense
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center bg-gray-900">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p className="text-gray-400 text-sm">Carregando...</p>
    </div>
  </div>
);

function App() {
  return (
    <TransactionsProvider>
      <AccountsProvider>
        <BrowserRouter>
          <ThemeProvider>
            <Routes>
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/login" element={<Login />} />
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