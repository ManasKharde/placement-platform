import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/protected/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const RoadmapPage = lazy(() => import("./pages/RoadmapPage"));
const TopicDetailPage = lazy(() => import("./pages/TopicDetailPage"));

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
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <AppLayout>
                <RoadmapPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/topics/:topicId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TopicDetailPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/preparation-path"
          element={<Navigate to="/roadmap" replace />}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}