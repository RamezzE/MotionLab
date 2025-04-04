import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
  const { isAuthenticated, user } = useUserStore();

  // First check if the user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If admin is required, check if the user is an admin
  if (requireAdmin && !user.is_admin) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // If the user is authenticated and has the required admin status, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 