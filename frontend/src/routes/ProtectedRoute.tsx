import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth-utils';

interface ProtectedRouteProps {
  element: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;