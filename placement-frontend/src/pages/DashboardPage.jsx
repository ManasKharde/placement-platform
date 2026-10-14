import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";
import {
  Sparkles,
  Server,
  Code,
  Coffee,
  Layers,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  Target,
  BookOpen,
  Edit3,
  Loader2,
  AlertCircle,
  Compass,
  ChevronRight,
  RefreshCw,
  Zap,
} from "lucide-react";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [pacingData, setPacingData] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [availablePaths, setAvailablePaths] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Path Selection & Daily Hours Form State (Onboarding)
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [selectedDailyHours, setSelectedDailyHours] = useState(2);
  const [savingPath, setSavingPath] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState(false);
  const [updatingCommitment, setUpdatingCommitment] = useState(false);

  // Daily Missions Checkbox State
  const [completedMissionIds, setCompletedMissionIds] = useState(new Set());
  const [togglingMissionId, setTogglingMissionId] = useState(null);

  // Fetch Dashboard and Paths Data
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashRes, pacingRes, missionsRes, readinessRes] = await Promise.all([
        apiClient.get("/user/dashboard"),
        apiClient.get("/user/pacing").catch(() => ({ data: null })),
        apiClient.get("/user/missions").catch(() => ({ data: null })),
        apiClient.get("/user/readiness").catch(() => ({ data: null })),
      ]);

      setDashboardData(dashRes.data);

      if (pacingRes?.data?.hasSelectedPath) {
        setPacingData(pacingRes.data);
      }

      if (readinessRes?.data?.success && readinessRes?.data?.roles) {
        setReadinessData(readinessRes.data);
      }

      // Process Daily Missions
      if (missionsRes?.data?.missions?.length > 0) {
        const fetchedMissions = missionsRes.data.missions.map((m) => ({
          id: m.topicId,
          topicId: m.topicId,
          title: m.topicName,
          subtitle: m.trackName,
          completed: m.status === "completed",
        }));
        setMissions(fetchedMissions);
        setCompletedMissionIds(
          new Set(
            fetchedMissions.filter((m) => m.completed).map((m) => m.id)
          )
        );
      } else {
        // Fallback standard placement daily missions
        setMissions([
          { id: 44, topicId: 44, title: "Arrays & Hashing", subtitle: "Problem Solving: DSA & SQL", completed: false },
          { id: 51, topicId: 51, title: "Relational SQL: Joins & Window Functions", subtitle: "Problem Solving: DSA & SQL", completed: false },
          { id: 48, topicId: 48, title: "Operating Systems: Concurrency & Virtual Memory", subtitle: "Core Computer Science", completed: false },
        ]);
      }

      // If user hasn't selected a path, load available paths for onboarding
      if (!dashRes.data?.hasSelectedPath) {
        const pathsRes = await apiClient.get("/preparation-paths");
        setAvailablePaths(pathsRes.data?.paths || []);
        if (pathsRes.data?.paths?.length > 0) {
          setSelectedPathId(pathsRes.data.paths[0].id);
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to load dashboard data. Please refresh or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Handle Mission Toggle
  const handleToggleMission = async (mission) => {
    const isCompleted = completedMissionIds.has(mission.id);
    const nextCompleted = new Set(completedMissionIds);
    if (isCompleted) {
      nextCompleted.delete(mission.id);
    } else {
      nextCompleted.add(mission.id);
    }
    setCompletedMissionIds(nextCompleted);

    const topicId = mission.topicId || mission.id;
    if (typeof topicId === "number") {
      setTogglingMissionId(topicId);
      try {
        await apiClient.post(`/user/topics/${topicId}/toggle`, {
          status: isCompleted ? "not_started" : "completed",
        });

        // Background sync dashboard counts & readiness
        const [dashRes, readinessRes] = await Promise.all([
          apiClient.get("/user/dashboard").catch(() => null),
          apiClient.get("/user/readiness").catch(() => null),
        ]);
        if (dashRes?.data) setDashboardData(dashRes.data);
        if (readinessRes?.data?.roles) setReadinessData(readinessRes.data);
      } catch (err) {
        console.error("Mission toggle error:", err);
        // Rollback on error
        setCompletedMissionIds(completedMissionIds);
      } finally {
        setTogglingMissionId(null);
      }
    }
  };

  // Handle Mission Click
  const handleMissionClick = (mission) => {
    const tid = mission.topicId || mission.id;
    if (typeof tid === "number") {
      navigate(`/topics/${tid}`);
    }
  };

  // Handle Initial Path Selection & Confirmation (Onboarding)
  const handleConfirmPath = async (e) => {
    e?.preventDefault();
    if (!selectedPathId) return;

    setSavingPath(true);
    setError("");

    try {
      await apiClient.post("/user/preparation-path", {
        pathId: selectedPathId,
        dailyHours: selectedDailyHours,
      });

      await fetchDashboard();
    } catch (err) {
      console.error("Path selection error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to select preparation path. Please try again."
      );
    } finally {
      setSavingPath(false);
    }
  };

  // Handle Updating Daily Study Commitment
  const handleUpdateStudyTime = async (newHours) => {
    setUpdatingCommitment(true);
    try {
      await apiClient.put("/user/study-time", { dailyHours: newHours });
      setSelectedDailyHours(newHours);
      setEditingCommitment(false);
      await fetchDashboard();
    } catch (err) {
      console.error("Update study time error:", err);
      setError(err.response?.data?.error || "Failed to update daily study time.");
    } finally {
      setUpdatingCommitment(false);
    }
  };

  // Helper for role icons
  const getPathIcon = (slug) => {
    if (slug?.includes("node")) return <Server className="h-6 w-6 text-emerald-600" />;
    if (slug?.includes("react")) return <Code className="h-6 w-6 text-indigo-600" />;
    if (slug?.includes("java")) return <Coffee className="h-6 w-6 text-amber-600" />;
    return <Layers className="h-6 w-6 text-blue-600" />;
  };

  // Helper for role stack tags
  const getStackBadges = (slug) => {
    if (slug?.includes("node")) return ["Node.js", "Express", "PostgreSQL", "DSA & SQL"];
    if (slug?.includes("react")) return ["React", "TypeScript", "Tailwind CSS", "State Management"];
    if (slug?.includes("java")) return ["Java", "Spring Boot", "Hibernate / JPA", "Microservices"];
    if (slug?.includes("python") || slug?.includes("django")) return ["Python", "Django", "PostgreSQL", "REST APIs"];
    return ["Core CS", "System Design", "Problem Solving", "Web Architecture"];
  };

  const displayName = user?.username || user?.name || "Student";

  // Determine next incomplete topic for the "Resume Learning" Quick Launcher
  const nextIncompleteTopic =
    missions.find((m) => !completedMissionIds.has(m.id)) ||
    readinessData?.roles?.[0]?.recommendedNextTopic ||
    (dashboardData?.dashboard?.trackBreakdown?.[0]
      ? {
          id: dashboardData.dashboard.trackBreakdown[0].trackId,
          title: dashboardData.dashboard.trackBreakdown[0].trackName,
          subtitle: "Start your active curriculum track",
          isFallback: true,
        }
      : null);

  // Velocity & Runway calculations
  const dailyHours = dashboardData?.dashboard?.dailyHours || 2;
  const projectedDays = pacingData?.pacing?.projectedDaysToComplete || null;
  const projectedWeeks = projectedDays ? Math.max(1, Math.ceil(projectedDays / 7)) : null;
  const estimatedWeeklyTopics = Math.max(3, Math.round((dailyHours * 7) / 1.5));
  const isPacingOnTrack = projectedDays ? projectedDays <= 75 : true;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Error notification banner */}
      {error && (
        <div className="bg-red-50 text-danger border border-red-200 rounded-2xl p-4 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => {
              setError("");
              fetchDashboard();
            }}
            className="text-xs font-semibold text-danger underline hover:no-underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Global Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-fade-in">
          <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
          <p className="text-sm font-medium text-secondary-text">
            Loading your placement workspace...
          </p>
        </div>
      ) : !dashboardData?.hasSelectedPath ? (
        /* ============================================================== */
        /* STATE A: ONBOARDING STUDIO (hasSelectedPath === false)         */
        /* ============================================================== */
        <div className="space-y-8 animate-slide-up">
          {/* Onboarding Welcome Hero */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3 text-indigo-600" />
                Placement Preparation Studio
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Select Your Placement Target
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 max-w-xl leading-relaxed">
                Choose your target engineering career track to generate daily guided missions, interactive practice items, and structured modular milestones.
              </p>
            </div>

            <div className="hidden sm:flex h-20 w-20 rounded-3xl bg-indigo-50 border border-indigo-100 items-center justify-center shrink-0">
              <Target className="h-10 w-10 text-indigo-600" />
            </div>
          </div>

          {/* Step 1: Select Role Track */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white text-xs font-bold">
                1
              </span>
              <h2 className="text-base font-bold text-gray-900">
                Choose Target Engineering Role
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePaths.map((path) => {
                const isSelected = selectedPathId === path.id;
                const badges = getStackBadges(path.slug);

                return (
                  <div
                    key={path.id}
                    onClick={() => setSelectedPathId(path.id)}
                    className={`rounded-2xl p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group ${
                      isSelected
                        ? "bg-indigo-50/40 border-indigo-600 shadow-sm ring-1 ring-indigo-600"
                        : "bg-white border-gray-200/80 hover:border-gray-300 hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                          {getPathIcon(path.slug)}
                        </div>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Selected Target
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {path.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {path.description}
                      </p>

                      {/* Stack Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-3">
                        {badges.map((b) => (
                          <span
                            key={b}
                            className="text-[10px] font-semibold text-gray-600 bg-gray-100/80 px-2 py-0.5 rounded-md"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-indigo-600" />
                        {path.total_tracks || 0} Tracks
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                        {path.total_topics || 0} Topics
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-indigo-600" />
                        ~{path.total_estimated_hours || 0}h
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose Daily Commitment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white text-xs font-bold">
                2
              </span>
              <h2 className="text-base font-bold text-gray-900">
                Choose Daily Study Commitment
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  hours: 1,
                  title: "1 hr/day",
                  subtitle: "Steady",
                  desc: "Ideal for balancing current semester coursework.",
                },
                {
                  hours: 2,
                  title: "2 hrs/day",
                  subtitle: "Recommended",
                  desc: "Optimal pace for deep practice and retention.",
                },
                {
                  hours: 3,
                  title: "3+ hrs/day",
                  subtitle: "Intensive",
                  desc: "Fast-track sprint for upcoming recruitment drives.",
                },
              ].map((item) => {
                const isSelected = selectedDailyHours === item.hours;
                return (
                  <div
                    key={item.hours}
                    onClick={() => setSelectedDailyHours(item.hours)}
                    className={`rounded-2xl p-5 border transition-all duration-200 cursor-pointer text-left ${
                      isSelected
                        ? "bg-indigo-50/40 border-indigo-600 shadow-sm ring-1 ring-indigo-600"
                        : "bg-white border-gray-200/80 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.hours === 2
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Launch Action */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Ready to configure
              </p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">
                {availablePaths.find((p) => p.id === selectedPathId)?.name || "Target Role"} ·{" "}
                <span className="text-indigo-600">{selectedDailyHours} hrs/day commitment</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleConfirmPath}
              disabled={savingPath || !selectedPathId}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {savingPath ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Configuring Path...</span>
                </>
              ) : (
                <>
                  <span>Start Preparation Track</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* STATE B: ACTIVE TWO-COLUMN DASHBOARD (hasSelectedPath === true)*/
        /* ============================================================== */
        <div className="space-y-6 animate-slide-up">
          {/* ── Top Hero: Student Name | Active Role Pill | Switch Role | Overall % ── */}
          <section className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    🎯 {dashboardData?.dashboard?.activePath?.name}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Welcome back, {displayName}
                </h1>
                <p className="text-xs text-gray-500">
                  Placement mission control & personalized readiness trajectory.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  id="switch-path-dashboard-button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-switch-path-modal"))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all shadow-xs cursor-pointer group"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-indigo-600 transition-transform duration-300 group-hover:rotate-180" />
                  <span>Switch Path</span>
                </button>

                <Link
                  to="/roadmap"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>View Full Roadmap</span>
                </Link>
              </div>
            </div>

            {/* Overall Path Progress Bar */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Overall Path Curriculum Progress</span>
                <span className="font-bold text-gray-900">
                  {dashboardData?.dashboard?.overallProgress?.completedTopics || 0} of{" "}
                  {dashboardData?.dashboard?.overallProgress?.totalTopics || 0} Topics Finished (
                  {dashboardData?.dashboard?.overallProgress?.percentage || 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${dashboardData?.dashboard?.overallProgress?.percentage || 0}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* ── Two-Column Architecture Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ════════════════════════════════════════════════════════════ */}
            {/* LEFT COLUMN (60% / lg:col-span-7) — Action Engine            */}
            {/* ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 space-y-6">
              {/* 🎯 Today's Missions */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-indigo-600" />
                      <h2 className="text-base font-bold text-gray-900">Today's Missions</h2>
                    </div>
                    <p className="text-xs text-gray-500">
                      Curated high-yield topics to maintain your daily placement momentum.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {missions.filter((m) => completedMissionIds.has(m.id)).length} / {missions.length} Done
                  </span>
                </div>

                <div className="space-y-2.5">
                  {missions.map((mission) => {
                    const isChecked = completedMissionIds.has(mission.id);
                    const isUpdating = togglingMissionId === mission.id;

                    return (
                      <div
                        key={mission.id}
                        onClick={() => handleMissionClick(mission)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer select-none group ${
                          isChecked
                            ? "bg-emerald-50/40 border-emerald-200/70"
                            : "bg-gray-50/70 border-gray-200/70 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleMission(mission);
                            }}
                            className="shrink-0 transition-transform active:scale-90 p-0.5 rounded hover:bg-black/5 cursor-pointer"
                            title={isChecked ? "Mark as incomplete" : "Mark as completed"}
                          >
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                            ) : isChecked ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="h-4.5 w-4.5 text-gray-400 group-hover:text-gray-600" />
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs font-bold truncate group-hover:text-indigo-600 transition-colors ${
                                isChecked
                                  ? "text-emerald-950 line-through opacity-70"
                                  : "text-gray-900"
                              }`}
                            >
                              {mission.title}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate mt-0.5">
                              {mission.subtitle}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🗺️ Curriculum Track Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
                <div className="space-y-0.5 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    <h2 className="text-base font-bold text-gray-900">
                      Curriculum Track Breakdown
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500">
                    Modular skill progress linked to your target engineering role.
                  </p>
                </div>

                <div className="space-y-3">
                  {dashboardData?.dashboard?.trackBreakdown &&
                  dashboardData.dashboard.trackBreakdown.length > 0 ? (
                    dashboardData.dashboard.trackBreakdown.map((track) => (
                      <div
                        key={track.trackId}
                        className="bg-gray-50/70 border border-gray-200/70 rounded-xl p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">
                              {track.trackName}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {track.completedTopics} of {track.totalTopics} Topics Completed
                            </p>
                          </div>
                          <span className="text-xs font-bold text-indigo-600">
                            {track.percentage}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-3">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${track.percentage}%` }}
                          />
                        </div>

                        {/* <div className="mt-3 pt-2.5 border-t border-gray-200/50 flex justify-end">
                          <Link
                            to={`/roadmap#track-${track.trackId}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group"
                          >
                            <span>View Track Topics</span>
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div> */}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-gray-500">
                      Tracks will appear once your roadmap is loaded.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════ */}
            {/* RIGHT COLUMN (40% / lg:col-span-5) — Momentum & Velocity     */}
            {/* ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 space-y-6">
              {/* ⚡ "Resume Learning" Quick Launcher Card */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Zap className="h-3 w-3 text-amber-600" />
                      Quick Launcher
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">~45 mins</span>
                  </div>

                  <h2 className="text-base font-bold text-gray-900">
                    Resume Learning
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pick up exactly where you left off in your curriculum.
                  </p>

                  {nextIncompleteTopic ? (
                    <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block truncate">
                        {nextIncompleteTopic.subtitle || nextIncompleteTopic.trackName || "Next Up"}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                        {nextIncompleteTopic.title || nextIncompleteTopic.name}
                      </h3>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200/70">
                      <p className="text-xs font-semibold text-emerald-800">
                        🎉 All current missions completed! Excellent work!
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      if (nextIncompleteTopic?.isFallback) {
                        navigate("/roadmap");
                      } else if (nextIncompleteTopic?.id || nextIncompleteTopic?.topicId) {
                        navigate(`/topics/${nextIncompleteTopic.id || nextIncompleteTopic.topicId}`);
                      } else {
                        navigate("/roadmap");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-xs hover:shadow-sm cursor-pointer group"
                  >
                    <span>
                      Resume: {nextIncompleteTopic?.title || nextIncompleteTopic?.name || "Curriculum"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>

              {/* ⏱️ Pacing & Placement Runway Card */}
              <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    <h2 className="text-base font-bold text-gray-900">
                      Pacing & Runway
                    </h2>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPacingOnTrack
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {pacingData?.pacing?.remainingTopics === 0
                      ? "Completed! 🎉"
                      : isPacingOnTrack
                      ? "On Track"
                      : "Needs Attention"}
                  </span>
                </div>

                {/* Runway Text */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Placement Runway Projection
                  </div>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    {projectedDays
                      ? `At your velocity of ~${estimatedWeeklyTopics} topics/week (${dailyHours} hrs/day), you will complete this path in ~${projectedWeeks} weeks (~${projectedDays} days).`
                      : "Maintaining consistent daily momentum ensures rapid curriculum completion."}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-100 text-left">
                    <div className="text-[10px] font-semibold text-gray-500">Remaining Time</div>
                    <div className="text-sm font-bold text-gray-900 mt-0.5">
                      ~{pacingData?.pacing?.remainingHours || 0} Hours
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-100 text-left">
                    <div className="text-[10px] font-semibold text-gray-500">Topics Left</div>
                    <div className="text-sm font-bold text-gray-900 mt-0.5">
                      {pacingData?.pacing?.remainingTopics || 0} Topics
                    </div>
                  </div>
                </div>

                {/* Study Time Commitment Adjuster */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span className="font-medium">Target: {dailyHours} hrs/day</span>
                    <button
                      type="button"
                      onClick={() => setEditingCommitment((prev) => !prev)}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer text-[11px]"
                    >
                      {editingCommitment ? "Close" : "Change Commitment"}
                    </button>
                  </div>

                  {editingCommitment && (
                    <div className="flex items-center gap-1.5 animate-fade-in pt-1">
                      {[1, 2, 3, 4].map((hrs) => (
                        <button
                          key={hrs}
                          disabled={updatingCommitment}
                          onClick={() => handleUpdateStudyTime(hrs)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            dailyHours === hrs
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {hrs}h
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── FULL WIDTH (Bottom Section): Composite Role Readiness ── */}
          {readinessData?.roles && readinessData.roles.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
              <div>
                <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  Market Readiness Engine
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  Composite Role Readiness
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Weighted placement readiness calculated across modular curriculum tracks.
                </p>
              </div>

              {/* Prominent Composite Role Card */}
              <div className="mt-6">
                {readinessData.roles.map((role) => {
                  const roleId = role.roleId || role.id;
                  const roleName = role.roleName || role.role_name;
                  const score = role.readinessScore ?? role.percentage ?? 0;
                  const completedTopics = role.completedTopics ?? role.completed_topics ?? 0;
                  const totalTopics = role.totalTopics ?? role.total_topics ?? 0;
                  const statusLabel = role.statusBadge || role.stage || role.status || "Orientation Stage";
                  const description = role.targetLevel || role.description || role.tagline;

                  return (
                    <div
                      key={roleId}
                      className="bg-gradient-to-br from-gray-50/90 via-indigo-50/20 to-purple-50/30 border border-indigo-100/80 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-indigo-200 transition-all"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight">
                              {roleName}
                            </h3>
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                              {role.badge || "CORE ROLE"}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
                            {description}
                          </p>
                        </div>

                        {/* Large Score Display */}
                        <div className="flex items-baseline sm:flex-col sm:items-end gap-2 sm:gap-0 shrink-0">
                          <span className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">
                            {score}%
                          </span>
                          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Overall Readiness
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-5 space-y-2.5">
                        <div className="w-full bg-gray-200/90 h-3 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                          />
                        </div>

                        {/* Bottom Metric Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600 font-medium pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900">
                              {completedTopics} of {totalTopics} Topics Completed
                            </span>
                            {role.frontend && role.backend && (
                              <span className="text-gray-400 hidden sm:inline">·</span>
                            )}
                            {role.frontend && role.backend && (
                              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200">
                                  Frontend: <strong className="text-indigo-600">{role.frontend.completedTopics}/{role.frontend.totalTopics}</strong>
                                </span>
                                <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200">
                                  Backend: <strong className="text-purple-600">{role.backend.completedTopics}/{role.backend.totalTopics}</strong>
                                </span>
                              </div>
                            )}
                          </div>

                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100 self-start sm:self-auto">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;