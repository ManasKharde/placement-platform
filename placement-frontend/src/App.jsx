import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/protected/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-2 border-brand-100" />
      <div className="absolute inset-0 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
    </div>
    <p className="text-sm text-secondary-text font-medium animate-fade-in">
      Loading…
    </p>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}