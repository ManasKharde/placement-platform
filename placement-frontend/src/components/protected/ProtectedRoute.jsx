import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. Show soft off-white loading state while checking JWT cookie
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-brand-100" />
          <div className="absolute inset-0 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-secondary-text font-medium animate-fade-in">
          Verifying session…
        </p>
      </div>
    );
  }

  // 2. Redirect to login if user session is not active
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Render protected child components
  return children;
};

export default ProtectedRoute;