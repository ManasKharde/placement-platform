import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export const LoginPage = () => {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  // Modes: "signin" | "signup" | "forgot"
  const [mode, setMode] = useState("signin");

  // Forgot password steps: "request" | "reset"
  const [forgotStep, setForgotStep] = useState("request");

  // Form State for Login / Signup
  const [formData, setFormData] = useState({
    username: "",
    emailOrUsername: "",
    email: "",
    password: "",
  });

  // Form State for Forgot / Reset Password
  const [resetData, setResetData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Resend OTP countdown timer
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Password criteria helper
  const getPasswordCriteria = (pwd) => ({
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccessMessage("");

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
    } else if (newMode === "forgot") {
      setForgotStep("request");
      setResetData((prev) => ({
        ...prev,
        email: prev.email || (formData.emailOrUsername.includes("@") ? formData.emailOrUsername : formData.email),
        otp: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
    window.location.href = `${backendUrl}/auth/google`;
  };

  // Validation for Login / Signup
  const validateForm = () => {
    if (mode === "signin") {
      const loginId = formData.emailOrUsername.trim();
      if (!loginId) {
        return "Please enter your email or username.";
      }
      if (!formData.password) {
        return "Please enter your password.";
      }
    } else if (mode === "signup") {
      const uname = formData.username.trim();
      const mail = formData.email.trim();

      if (!uname) {
        return "Please enter a username.";
      }
      if (uname.length < 3 || uname.length > 30) {
        return "Username must be between 3 and 30 characters.";
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(uname)) {
        return "Username can only contain alphanumeric characters, underscores, or hyphens.";
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

      const { minLength, hasUpper, hasLower, hasNumber, hasSpecial } =
        getPasswordCriteria(formData.password);

      if (!minLength) {
        return "Password must be at least 8 characters long.";
      }
      if (!hasUpper) {
        return "Password must include at least 1 uppercase letter.";
      }
      if (!hasLower) {
        return "Password must include at least 1 lowercase letter.";
      }
      if (!hasNumber) {
        return "Password must include at least 1 number.";
      }
      if (!hasSpecial) {
        return "Password must include at least 1 special character (!@#$%^&*...).";
      }
    }
    return null;
  };

  // Submit Handler for Login & Signup
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
        const cleanEmail = formData.email.trim().toLowerCase();

        const response = await apiClient.post("/auth/signup", {
          username: cleanUsername,
          email: cleanEmail,
          password: formData.password,
        });

        if (response.data?.user) {
          setUser(response.data.user);
          navigate("/dashboard", { replace: true });
        } else {
          // If signup didn't automatically establish session, auto-login
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
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Authentication failed. Please check your credentials and try again.";
      setError(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Forgot Password: Request OTP Step
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    const mail = resetData.email.trim();
    if (!mail) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await apiClient.post("/auth/forgot-password", { email: mail });
      setSuccessMessage(res.data?.message || "A 6-digit verification code has been sent to your email.");
      setResetData((prev) => ({ ...prev, otp: "" }));
      setForgotStep("reset");
      setResendCooldown(60); // 60s cooldown
    } catch (err) {
      const serverMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to request password reset code. Please try again.";
      setError(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Forgot Password: Reset Password Step
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const mail = resetData.email.trim();
    const otp = resetData.otp.trim();
    const pwd = resetData.newPassword;
    const confirmPwd = resetData.confirmPassword;

    if (!mail) {
      setError("Email address is required.");
      return;
    }
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    if (!pwd) {
      setError("Please enter a new password.");
      return;
    }

    const { minLength, hasUpper, hasLower, hasNumber, hasSpecial } = getPasswordCriteria(pwd);
    if (!minLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError("Password must meet all complexity requirements (8+ chars, upper, lower, number, special char).");
      return;
    }

    if (pwd !== confirmPwd) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await apiClient.post("/auth/reset-password", {
        email: mail,
        otp,
        newPassword: pwd,
      });

      // Switch to sign in view with success message and pre-filled email
      setMode("signin");
      setSuccessMessage(res.data?.message || "Password reset successful! You can now log in.");
      setFormData((prev) => ({
        ...prev,
        emailOrUsername: mail,
        password: "",
      }));
      setResetData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const serverMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to reset password. Please check your verification code and try again.";
      setError(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const signupPasswordCriteria = getPasswordCriteria(
    mode === "signup" ? formData.password : resetData.newPassword
  );

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
          {mode === "forgot" ? (
            <KeyRound className="h-6 w-6" />
          ) : (
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
          )}
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-2xl font-bold text-primary-text tracking-tight">
          {mode === "forgot"
            ? forgotStep === "request"
              ? "Forgot Password"
              : "Reset Password"
            : "Placement Coach"}
        </h1>
        <p className="mt-1 text-sm text-secondary-text leading-relaxed max-w-xs mx-auto">
          {mode === "signin" && "Sign in to access your milestones and study plan."}
          {mode === "signup" && "Create an account to start your placement journey."}
          {mode === "forgot" &&
            forgotStep === "request" &&
            "Enter your registered email to receive a 6-digit verification code."}
          {mode === "forgot" &&
            forgotStep === "reset" &&
            `Enter the 6-digit code sent to ${resetData.email} and create your new password.`}
        </p>

        {/* Segmented View Toggle (Sign In vs Create Account) */}
        {mode !== "forgot" ? (
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
        ) : (
          /* Back to Sign In button for Forgot Password mode */
          <div className="mt-4 mb-5 text-left">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        )}

        {/* Google OAuth Button (Only shown in Sign In & Signup modes) */}
        {mode !== "forgot" && (
          <>
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
          </>
        )}

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-3 text-xs flex items-center gap-2 text-left animate-fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}


        {/* Error Alert Banner */}
        {error && (
          <div className="mb-5 bg-red-50 text-danger border border-red-200 rounded-xl p-3 text-xs flex items-center gap-2 text-left animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* FORGOT PASSWORD: STEP 1 (REQUEST OTP) */}
        {mode === "forgot" && forgotStep === "request" && (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={resetData.email}
                  onChange={handleResetInputChange}
                  placeholder="you@example.com"
                  disabled={submitting}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface text-primary-text text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-secondary-text/60 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 ease-in-out shadow-subtle hover:shadow-hover cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Sending Verification Code...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">Send 6-Digit Code</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD: STEP 2 (VERIFY OTP & SET NEW PASSWORD) */}
        {mode === "forgot" && forgotStep === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            {/* OTP Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-primary-text">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={submitting || resendCooldown > 0}
                  className="text-xs text-brand-600 hover:text-brand-700 disabled:text-secondary-text cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${resendCooldown > 0 ? "opacity-50" : ""}`} />
                  <span>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                  </span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="otp"
                  maxLength={6}
                  value={resetData.otp}
                  onChange={handleResetInputChange}
                  placeholder="123456"
                  disabled={submitting}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface text-primary-text text-base font-mono tracking-widest text-center rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-secondary-text/60 disabled:opacity-60"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-secondary-text">
                Enter the 6-digit code sent to your inbox (check spam if needed).
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  autoComplete="new-password"
                  value={resetData.newPassword}
                  onChange={handleResetInputChange}
                  placeholder="At least 8 characters"
                  disabled={submitting}
                  className="w-full pl-10 pr-10 py-2.5 bg-surface text-primary-text text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-secondary-text/60 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Checklist */}
              {resetData.newPassword && (
                <div className="mt-2.5 p-2.5 bg-background rounded-xl border border-border-subtle text-[11px] space-y-1">
                  <div
                    className={`flex items-center gap-1.5 ${
                      signupPasswordCriteria.minLength ? "text-success font-medium" : "text-secondary-text"
                    }`}
                  >
                    <span>{signupPasswordCriteria.minLength ? "✓" : "○"}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      signupPasswordCriteria.hasUpper && signupPasswordCriteria.hasLower
                        ? "text-success font-medium"
                        : "text-secondary-text"
                    }`}
                  >
                    <span>{signupPasswordCriteria.hasUpper && signupPasswordCriteria.hasLower ? "✓" : "○"}</span>
                    <span>Uppercase and lowercase letters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      signupPasswordCriteria.hasNumber ? "text-success font-medium" : "text-secondary-text"
                    }`}
                  >
                    <span>{signupPasswordCriteria.hasNumber ? "✓" : "○"}</span>
                    <span>At least 1 number</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      signupPasswordCriteria.hasSpecial ? "text-success font-medium" : "text-secondary-text"
                    }`}
                  >
                    <span>{signupPasswordCriteria.hasSpecial ? "✓" : "○"}</span>
                    <span>At least 1 special character (!@#$%...)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-text">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={resetData.confirmPassword}
                  onChange={handleResetInputChange}
                  placeholder="Repeat new password"
                  disabled={submitting}
                  className="w-full pl-10 pr-10 py-2.5 bg-surface text-primary-text text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-secondary-text/60 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary-text hover:text-primary-text transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Reset Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 ease-in-out shadow-subtle hover:shadow-hover cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">Set New Password</span>
                    <ShieldCheck className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* SIGN IN & SIGN UP FORMS */}
        {mode !== "forgot" && (
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
                      placeholder="johndoe_99"
                      disabled={submitting}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface text-primary-text text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-secondary-text/60 disabled:opacity-60"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-secondary-text">
                    3-30 characters, letters, numbers, _ or -
                  </p>
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
                    onClick={() => switchMode("forgot")}
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
                    mode === "signup" ? "At least 8 characters" : "••••••••"
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

              {/* Real-time Password Rules Checklist (Sign Up) */}
              {mode === "signup" && formData.password && (
                <div className="mt-2.5 p-2.5 bg-background rounded-xl border border-border-subtle text-[11px] space-y-1">
                  <div
                    className={`flex items-center gap-1.5 ${
                      signupPasswordCriteria.minLength ? "text-success font-medium" : "text-secondary-text"
                    }`}
                  >
                    <span>{signupPasswordCriteria.minLength ? "✓" : "○"}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      signupPasswordCriteria.hasUpper && signupPasswordCriteria.hasLower
                        ? "text-success font-medium"
                        : "text-secondary-text"
                    }`}
                  >
                    <span>{signupPasswordCriteria.hasUpper && signupPasswordCriteria.hasLower ? "✓" : "○"}</span>
                    <span>Uppercase & lowercase letters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      signupPasswordCriteria.hasNumber ? "text-success font-medium" : "text-secondary-text"
                    }`}
                  >
                    <span>{signupPasswordCriteria.hasNumber ? "✓" : "○"}</span>
                    <span>At least 1 number</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      signupPasswordCriteria.hasSpecial ? "text-success font-medium" : "text-secondary-text"
                    }`}
                  >
                    <span>{signupPasswordCriteria.hasSpecial ? "✓" : "○"}</span>
                    <span>At least 1 special character (!@#$%...)</span>
                  </div>
                </div>
              )}
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
        )}

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