import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";

export const LoginPage = () => {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  // Mode: "signin" | "signup"
  const [mode, setMode] = useState("signin");

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    emailOrUsername: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    if (newMode === "signin") {
      setFormData((prev) => ({
        ...prev,
        emailOrUsername: prev.emailOrUsername || prev.email || prev.username,
      }));
    } else if (newMode === "signup") {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || (prev.emailOrUsername.includes("@") ? prev.emailOrUsername : ""),
        username: prev.username || (!prev.emailOrUsername.includes("@") ? prev.emailOrUsername : ""),
      }));
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
    window.location.href = `${backendUrl}/auth/google`;
  };

  const validateForm = () => {
    if (mode === "signin") {
      const loginId = formData.emailOrUsername.trim();
      if (!loginId) {
        return "Please enter your email or username.";
      }
      if (!formData.password) {
        return "Please enter your password.";
      }
    } else {
      const uname = formData.username.trim();
      const mail = formData.email.trim();
      if (!uname) {
        return "Please enter a username.";
      }
      if (!mail) {
        return "Please enter your email address.";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(mail)) {
        return "Please enter a valid email address.";
      }
      if (!formData.password) {
        return "Please enter a password.";
      }
      if (formData.password.length < 6) {
        return "Password must be at least 6 characters long.";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (mode === "signin") {
        const cleanLoginId = formData.emailOrUsername.trim();
        const response = await apiClient.post("/auth/login", {
          identifier: cleanLoginId,
          email: cleanLoginId,
          username: cleanLoginId,
          password: formData.password,
        });

        if (response.data?.user) {
          setUser(response.data.user);
          navigate("/dashboard", { replace: true });
        }
      } else {
        const cleanUsername = formData.username.trim();
        const cleanEmail = formData.email.trim();
        const response = await apiClient.post("/auth/signup", {
          username: cleanUsername,
          email: cleanEmail,
          password: formData.password,
        });

        if (response.data?.user) {
          setUser(response.data.user);
          navigate("/dashboard", { replace: true });
        } else {
          // If signup didn't return session cookies immediately, auto-login
          const loginRes = await apiClient.post("/auth/login", {
            identifier: cleanEmail || cleanUsername,
            email: cleanEmail,
            username: cleanUsername,
            password: formData.password,
          });
          if (loginRes.data?.user) {
            setUser(loginRes.data.user);
            navigate("/dashboard", { replace: true });
          }
        }
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Authentication failed. Please check your credentials and try again.";
      setError(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Decorative background ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-50 opacity-50 blur-3xl" />
      </div>

      {/* Main Container Card */}
      <div className="relative w-full max-w-md bg-surface p-8 sm:p-10 rounded-3xl border border-border-subtle shadow-card text-center animate-scale-in">
        {/* Brand Badge / Logo */}
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white mb-5 shadow-subtle">
          <svg
            className="h-6 w-6"
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

        {/* Heading & Subtitle */}
        <h1 className="text-2xl font-bold text-primary-text tracking-tight">
          Placement Coach
        </h1>
        <p className="mt-1 text-sm text-secondary-text leading-relaxed max-w-xs mx-auto">
          {mode === "signin"
            ? "Sign in to access your milestones and study plan."
            : "Create an account to start your placement journey."}
        </p>

        {/* Segmented View Toggle (Sign In vs Create Account) */}
        <div className="flex bg-background p-1 rounded-xl border border-border-subtle mt-6 mb-6">
          <button
            type="button"
            id="tab-signin"
            onClick={() => switchMode("signin")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              mode === "signin"
                ? "bg-surface text-primary-text shadow-subtle"
                : "text-secondary-text hover:text-primary-text"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="tab-signup"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              mode === "signup"
                ? "bg-surface text-primary-text shadow-subtle"
                : "text-secondary-text hover:text-primary-text"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          id="google-login-button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-surface hover:bg-background text-primary-text border border-border-subtle font-medium py-3 px-4 rounded-xl transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-hover cursor-pointer group"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-border-subtle w-full" />
          <span className="absolute bg-surface px-3 text-xs text-secondary-text font-medium uppercase tracking-wider">
            or with email
          </span>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div className="mb-5 bg-red-50 text-danger border border-red-200 rounded-xl p-3 text-xs flex items-center gap-2 text-left animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {mode === "signup" ? (
            <>
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-primary-text mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface text-primary-text text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-secondary-text/60 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-primary-text mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface text-primary-text text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-secondary-text/60 disabled:opacity-60"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Email or Username Input (Sign In) */
            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="emailOrUsername"
                  autoComplete="username"
                  value={formData.emailOrUsername}
                  onChange={handleInputChange}
                  placeholder="you@example.com or username"
                  disabled={submitting}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface text-primary-text text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-secondary-text/60 disabled:opacity-60"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-primary-text">
                Password
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() =>
                    alert("Password reset is not yet configured on the server.")
                  }
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder={
                  mode === "signup" ? "At least 6 characters" : "••••••••"
                }
                disabled={submitting}
                className="w-full pl-10 pr-10 py-2.5 bg-surface text-primary-text text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-secondary-text/60 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 ease-in-out shadow-subtle hover:shadow-hover cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">
                    {mode === "signin" ? "Signing In..." : "Creating Account..."}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm">
                    {mode === "signin" ? "Sign In" : "Create Account"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <p className="mt-6 text-xs text-secondary-text flex items-center justify-center gap-1.5">
          <svg
            className="h-3.5 w-3.5 text-success shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Secure session · HTTP-only cookies</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;