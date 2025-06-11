import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionsProvider } from './context/TransactionsContext';
import AuthCallback from './pages/auth/AuthCallback';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import PrivateRoute from './components/auth/navigation/PrivateRoute';
import Wallet from './pages/wallet/Wallet';
import BankAccounts from './pages/bank-accounts/BankAccounts';
import { AccountsProvider } from './context/AccountsContext';

function App() {
  return (
    <AccountsProvider>
      <BrowserRouter>
        <ThemeProvider>
          <TransactionsProvider>
            <Routes>
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/wallet"
                element={
                  <PrivateRoute>
                    <Wallet />
                  </PrivateRoute>
                }
              />
              <Route
                path="/bank-accounts"
                element={
                  <PrivateRoute>
                    <BankAccounts />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TransactionsProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AccountsProvider>
  );
}

export default App;