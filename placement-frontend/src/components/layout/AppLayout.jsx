import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/client";
import {
  LayoutDashboard,
  Map,
  LogOut,
  ChevronDown,
  RefreshCw,
  X,
  Layers,
  Server,
  Code,
  Coffee,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

export const AppLayout = ({ children, onPathSwitched }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [availablePaths, setAvailablePaths] = useState([]);
  const [activePathId, setActivePathId] = useState(null);
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [switching, setSwitching] = useState(false);
  const [switchError, setSwitchError] = useState("");

  const dropdownRef = useRef(null);
  const mobileNavRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setIsMobileNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // Fetch available paths and current user path for switch modal
  const loadPaths = useCallback(async () => {
    try {
      const [pathsRes, userPathRes] = await Promise.all([
        apiClient.get("/preparation-paths"),
        apiClient.get("/user/preparation-path").catch(() => ({ data: null })),
      ]);

      const paths = pathsRes.data?.paths || [];
      setAvailablePaths(paths);

      const currentId = userPathRes?.data?.userPath?.path_id;
      if (currentId) {
        setActivePathId(currentId);
        setSelectedPathId(currentId);
      } else if (paths.length > 0) {
        setSelectedPathId(paths[0].id);
      }
    } catch (err) {
      console.error("Error loading preparation paths:", err);
    }
  }, []);

  const handleOpenSwitchModal = useCallback(() => {
    setProfileDropdownOpen(false);
    setSwitchError("");
    loadPaths();
    setSwitchModalOpen(true);
  }, [loadPaths]);

  // Listen for open-switch-path-modal event from child pages
  useEffect(() => {
    const handleTriggerSwitch = () => {
      handleOpenSwitchModal();
    };
    window.addEventListener("open-switch-path-modal", handleTriggerSwitch);
    return () => window.removeEventListener("open-switch-path-modal", handleTriggerSwitch);
  }, [handleOpenSwitchModal]);

  const handleConfirmSwitch = async () => {
    if (!selectedPathId) return;
    setSwitching(true);
    setSwitchError("");

    try {
      await apiClient.post("/user/preparation-path/switch", {
        pathId: selectedPathId,
      });

      setActivePathId(selectedPathId);
      setSwitchModalOpen(false);

      if (onPathSwitched) {
        onPathSwitched(selectedPathId);
      } else {
        // Trigger a clean route reload/refresh
        navigate(0);
      }
    } catch (err) {
      console.error("Path switch error:", err);
      setSwitchError(
        err.response?.data?.error || "Failed to switch path. Please try again."
      );
    } finally {
      setSwitching(false);
    }
  };

  const getPathIcon = (slug) => {
    if (slug?.includes("node")) return <Server className="h-5 w-5 text-emerald-600" />;
    if (slug?.includes("react")) return <Code className="h-5 w-5 text-brand-600" />;
    if (slug?.includes("java")) return <Coffee className="h-5 w-5 text-amber-600" />;
    return <Layers className="h-5 w-5 text-indigo-600" />;
  };

  const displayName = user?.username || user?.name || "Student";
  const email = user?.email || "";
  const avatarUrl = user?.avatar_url || user?.avatarUrl || null;
  const streakDays = user?.streak_days || user?.streakDays || 1;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Preparation Path", path: "/roadmap", icon: Map },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8f9fa] flex-col">
      {/* ── Top Navbar ── */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shrink-0">
        <div className="w-full h-16 flex items-center justify-between px-4 sm:px-6 md:px-8">
          {/* Left side: Logo & Mobile Menu Toggle */}
          <div className="relative" ref={mobileNavRef}>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth >= 768) {
                  navigate("/dashboard");
                }
                setIsMobileNavOpen((prev) => !prev);
              }}
              className="flex items-center gap-2 focus:outline-none md:cursor-pointer group"
            >
              {/* Logo icon */}
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-subtle group-hover:shadow-hover transition-all">
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
              {/* Brand name hidden on mobile screens */}
              <span className="hidden md:inline font-bold text-gray-900">
                Placement Coach
              </span>
            </button>

            {/* Mobile-only Nav Dropdown */}
            {isMobileNavOpen && (
              <div className="md:hidden absolute left-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-lg border border-gray-100 z-50">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === "/dashboard"
                      ? "bg-brand-50 text-brand-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/roadmap"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === "/roadmap" || location.pathname === "/preparation-path"
                      ? "bg-brand-50 text-brand-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Roadmap
                </Link>
              </div>
            )}
          </div>

          {/* Right side: Compact streak + Profile */}
          <div className="flex items-center gap-2">
            {/* Compact Streak Badge on Mobile */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
              <span>🔥</span>
              <span>{streakDays}</span>
              <span className="hidden sm:inline">Day Streak</span>
            </div>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id="profile-dropdown-button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-border-subtle bg-surface hover:bg-background transition-all cursor-pointer group"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-7 w-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-primary-text hidden md:inline truncate max-w-[120px]">
                  {displayName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-secondary-text group-hover:text-primary-text transition-transform duration-200" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface border border-border-subtle shadow-card p-2 text-left z-50 animate-scale-in">
                  {/* User Info Header */}
                  <div className="px-3 py-2.5 border-b border-border-subtle/80">
                    <p className="text-xs font-bold text-primary-text truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-secondary-text truncate mt-0.5">
                      {email || "student@placementcoach.com"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleOpenSwitchModal}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-primary-text hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-brand-600" />
                      <span>Switch Preparation Path</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-border-subtle/80">
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-danger hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main App Shell Body (Sidebar + Content) ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Independent Sidebar Container */}
        <aside className="w-64 h-full shrink-0 bg-white border-r border-gray-200 hidden sm:flex flex-col justify-between py-6 px-3 overflow-y-auto overscroll-contain">
          <div className="space-y-1">
            <div className="px-3 pb-3 text-[11px] font-semibold text-secondary-text uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === "/roadmap" && location.pathname === "/preparation-path");

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                    ? "bg-brand-50 text-brand-600 shadow-subtle"
                    : "text-secondary-text hover:text-primary-text hover:bg-background"
                    }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-brand-600" : "text-secondary-text"
                      }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Footer inside sidebar */}
          <div className="px-3 pt-4 border-t border-border-subtle/60 text-[11px] text-secondary-text flex items-center justify-between">
            <span className="font-medium">Placement Ready</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </aside>

        {/* Independent Main Content Container */}
        <main
          id="main-scroll-container"
          className="flex-1 h-full overflow-y-auto overscroll-contain relative"
        >
          {children}
          <div className="h-28 w-full shrink-0 md:hidden" aria-hidden="true" />
        </main>
      </div>

      {/* ── Switch Preparation Path Modal ── */}
      {switchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-text/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 animate-scale-in text-left">
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-semibold mb-1.5">
                  <Sparkles className="h-3 w-3" />
                  <span>Curriculum Switch</span>
                </div>
                <h3 className="text-xl font-bold text-primary-text tracking-tight">
                  Switch Preparation Path
                </h3>
                <p className="text-xs text-secondary-text mt-0.5">
                  Select your new target role. Your study commitment will be preserved.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSwitchModalOpen(false)}
                className="p-1.5 rounded-xl text-secondary-text hover:text-primary-text hover:bg-background transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error banner if any */}
            {switchError && (
              <div className="mb-4 bg-red-50 text-danger border border-red-200 rounded-xl p-3 text-xs">
                {switchError}
              </div>
            )}

            {/* Available Paths List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 my-4">
              {availablePaths.map((path) => {
                const isSelected = selectedPathId === path.id;
                const isCurrentActive = activePathId === path.id;

                return (
                  <div
                    key={path.id}
                    onClick={() => setSelectedPathId(path.id)}
                    className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 ${isSelected
                      ? "bg-brand-50/70 border-brand-500 shadow-subtle ring-2 ring-brand-500/20"
                      : "bg-surface border-border-subtle hover:border-brand-200 hover:bg-background/40"
                      }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-white border border-border-subtle shadow-subtle flex items-center justify-center shrink-0">
                        {getPathIcon(path.slug)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-primary-text truncate">
                            {path.name}
                          </h4>
                          {isCurrentActive && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-secondary-text truncate mt-0.5">
                          {path.total_tracks || 0} Tracks · {path.total_topics || 0} Topics · ~{path.total_estimated_hours || 0}h
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <CheckCircle2 className="h-5 w-5 text-brand-600 fill-brand-100" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-border-subtle" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle/80">
              <button
                type="button"
                disabled={switching}
                onClick={() => setSwitchModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-secondary-text hover:text-primary-text hover:bg-background transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={switching || !selectedPathId || selectedPathId === activePathId}
                onClick={handleConfirmSwitch}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition-all shadow-subtle hover:shadow-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {switching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Switching Path...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Switch</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
