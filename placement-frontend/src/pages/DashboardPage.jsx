import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Mail, User, Shield } from "lucide-react";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const displayName = user?.username || user?.name || "Student";
  const email = user?.email || "";
  const avatarUrl = user?.avatar_url || user?.avatarUrl || null;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Navigation Bar ── */}
      <nav className="sticky top-0 z-30 bg-surface/80 backdrop-blur-lg border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-subtle">
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <span className="text-base font-semibold text-primary-text tracking-tight">
              Placement Coach
            </span>
          </div>

          {/* User Actions */}
          <button
            id="logout-button"
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary-text hover:text-danger bg-background hover:bg-red-50 border border-border-subtle rounded-xl transition-all duration-200 cursor-pointer group"
          >
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Logout
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome Hero Card */}
        <section className="relative bg-surface rounded-3xl border border-border-subtle shadow-card p-8 overflow-hidden animate-slide-up">
          {/* Decorative gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 rounded-t-3xl" />

          <div className="flex items-center gap-6">
            {/* Avatar */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-border-subtle shadow-subtle"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-600 font-bold text-xl shadow-subtle">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-primary-text tracking-tight">
                Welcome back, {displayName}!
              </h1>
              <p className="mt-1 text-sm text-secondary-text truncate">
                Your placement journey continues. Keep pushing forward.
              </p>
            </div>
          </div>
        </section>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
          {/* Username Card */}
          <div className="bg-surface rounded-2xl border border-border-subtle shadow-subtle p-5 flex items-start gap-4 hover:shadow-hover transition-shadow duration-200 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-secondary-text uppercase tracking-wider">
                Username
              </p>
              <p className="mt-1 text-sm font-semibold text-primary-text truncate">
                {displayName}
              </p>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-surface rounded-2xl border border-border-subtle shadow-subtle p-5 flex items-start gap-4 hover:shadow-hover transition-shadow duration-200 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-secondary-text uppercase tracking-wider">
                Email
              </p>
              <p className="mt-1 text-sm font-semibold text-primary-text truncate">
                {email || "—"}
              </p>
            </div>
          </div>

          {/* Session Card */}
          <div className="bg-surface rounded-2xl border border-border-subtle shadow-subtle p-5 flex items-start gap-4 hover:shadow-hover transition-shadow duration-200 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-success shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-secondary-text uppercase tracking-wider">
                Session
              </p>
              <p className="mt-1 text-sm font-semibold text-success">
                Active · Verified
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;