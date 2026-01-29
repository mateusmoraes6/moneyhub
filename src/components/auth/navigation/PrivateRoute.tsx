import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTransactions } from '../../../context/TransactionsContext';
import MainLayout from '../../layout/MainLayout';

import LoadingSpinner from '../../common/LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useTransactions();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default PrivateRoute;