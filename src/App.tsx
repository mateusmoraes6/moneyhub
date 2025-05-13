import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionsProvider } from './context/TransactionsContext';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TransactionsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;