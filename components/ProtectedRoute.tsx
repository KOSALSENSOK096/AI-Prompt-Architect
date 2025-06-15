
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    // Store the intended path to redirect after login
    // The AuthFormModal doesn't currently use this, but it's good practice.
    return <Navigate to="/" state={{ from: location }} replace />;
    // Alternatively, open login modal directly, but navigating to home is simpler.
    // For this app, we'll just redirect to home and user can click login.
  }

  return <>{children}</>;
};

export default ProtectedRoute;