import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiClient from "../api/client";
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Circle,
  Clock,
  Code,
  Terminal,
  Cpu,
  Database,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Loader2,
  TrendingUp,
  Compass,
  Lock,
  AlertTriangle,
  XCircle,
  Zap,
  ShieldCheck,
} from "lucide-react";

// Track theme mapping helper for dynamic modular rendering
const getTrackTheme = (track, index) => {
  const slug = (track.slug || "").toLowerCase();
  const name = (track.name || "").toLowerCase();

  // Problem Solving: DSA & SQL
  if (
    slug.includes("problem-solving") ||
    slug.includes("dsa") ||
    name.includes("dsa") ||
    name.includes("problem solving")
  ) {
    return {
      icon: Terminal,
      color: "from-purple-600 via-indigo-600 to-indigo-700",
      bgLight: "bg-purple-50",
      borderLight: "border-purple-200",
      textLight: "text-purple-700",
      accentBar: "bg-purple-600",
      badgeText: "Problem Solving & Queries",
    };
  }

  // Core CS Fundamentals
  if (
    slug.includes("computer-science") ||
    slug.includes("cs") ||
    name.includes("computer science")
  ) {
    return {
      icon: Cpu,
      color: "from-emerald-500 via-teal-600 to-teal-700",
      bgLight: "bg-emerald-50",
      borderLight: "border-emerald-200",
      textLight: "text-emerald-700",
      accentBar: "bg-emerald-600",
      badgeText: "CS Systems Core",
    };
  }

  // Quantitative Aptitude & Reasoning
  if (
    slug.includes("aptitude") ||
    slug.includes("reasoning") ||
    name.includes("aptitude")
  ) {
    return {
      icon: TrendingUp,
      color: "from-amber-500 via-orange-500 to-orange-600",
      bgLight: "bg-amber-50",
      borderLight: "border-amber-200",
      textLight: "text-amber-700",
      accentBar: "bg-amber-600",
      badgeText: "Screening Logic",
    };
  }

  // System Design & Deployment
  if (
    slug.includes("system-design") ||
    slug.includes("deployment") ||
    name.includes("system design")
  ) {
    return {
      icon: Layers,
      color: "from-pink-500 via-rose-600 to-rose-700",
      bgLight: "bg-rose-50",
      borderLight: "border-rose-200",
      textLight: "text-rose-700",
      accentBar: "bg-rose-600",
      badgeText: "High Scale Architecture",
    };
  }

  // Default / Development tracks (Node.js, Express, Frontend, etc.)
  const palettes = [
    {
      icon: Code,
      color: "from-brand-500 via-brand-600 to-indigo-700",
      bgLight: "bg-brand-50",
      borderLight: "border-brand-200",
      textLight: "text-brand-700",
      accentBar: "bg-brand-600",
      badgeText: "Core Engineering",
    },
    {
      icon: Database,
      color: "from-cyan-500 via-blue-600 to-indigo-700",
      bgLight: "bg-cyan-50",
      borderLight: "border-cyan-200",
      textLight: "text-cyan-700",
      accentBar: "bg-cyan-600",
      badgeText: "Data Architecture",
    },
  ];

  return palettes[index % palettes.length];
};

export const RoadmapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingTopicId, setTogglingTopicId] = useState(null);
  const [highlightedTopicId, setHighlightedTopicId] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [collapsedTracks, setCollapsedTracks] = useState({});
  const [toast, setToast] = useState(null);

  const toastTimeoutRef = useRef(null);
  const isManualScrollRef = useRef(false);
  const manualScrollTimeoutRef = useRef(null);
  const dockContainerRef = useRef(null);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
    };
  }, []);

  // Safe horizontal pill centering (scrollLeft only on dock container, never touches vertical ancestors)
  const centerDockPill = (trackId) => {
    const dock = dockContainerRef.current;
    const pill = document.getElementById(`pill-track-${trackId}`);
    if (dock && pill) {
      const pillLeft = pill.offsetLeft;
      const pillWidth = pill.offsetWidth;
      const dockWidth = dock.offsetWidth;
      const targetScrollLeft = pillLeft - dockWidth / 2 + pillWidth / 2;
      dock.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    }
  };

  const showToast = (message, type = "warning") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch roadmap data
  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiClient.get("/user/roadmap");
      setRoadmapData(res.data);
    } catch (err) {
      console.error("Failed to load roadmap:", err);
      setError("Unable to load preparation path. Please refresh or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  // Auto-scroll to topic from location.state or URL hash
  useEffect(() => {
    if (!loading && roadmapData) {
      const targetTopicId =
        location.state?.scrollToTopicId ||
        (window.location.hash ? window.location.hash.replace("#topic-", "") : null);

      if (targetTopicId) {
        const timer = setTimeout(() => {
          const el = document.getElementById(`topic-${targetTopicId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            setHighlightedTopicId(Number(targetTopicId) || targetTopicId);
            setTimeout(() => {
              setHighlightedTopicId(null);
            }, 2000);
          }
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, roadmapData, location.state]);

  // Dynamic tracks extraction
  const tracks = roadmapData?.tracks || roadmapData?.roadmap?.tracks || [];
  const activePath = roadmapData?.path || roadmapData?.roadmap?.path;
  const overallTotal =
    roadmapData?.totalTopics ??
    tracks.reduce((sum, t) => sum + (t.topics?.length || 0), 0);
  const overallCompleted =
    roadmapData?.completedTopics ??
    tracks.reduce(
      (sum, t) => sum + (t.topics?.filter((tp) => tp.status === "completed").length || 0),
      0
    );
  const overallPercentage =
    roadmapData?.overallProgress ??
    (overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 1000) / 10 : 0);

  // Scroll tracking for floating scroll-to-top button
  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");

    const handleScroll = () => {
      const currentScroll = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      setShowScrollTop(currentScroll > 400);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // IntersectionObserver Scroll-Spy for dynamic tracks
  useEffect(() => {
    if (!tracks.length) return;

    const scrollContainer = document.getElementById("main-scroll-container");
    const observerOptions = {
      root: scrollContainer || null,
      rootMargin: "-90px 0px -55% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      // Ignore intermediate track activations during a manual jump scroll
      if (isManualScrollRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const trackId = entry.target.id.replace("track-", "");
          setActiveTrackId(Number(trackId) || trackId);
        }
      });
    }, observerOptions);

    tracks.forEach((track) => {
      const el = document.getElementById(`track-${track.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tracks]);

  // Keep active pill centered in horizontal dock during natural scrolling
  useEffect(() => {
    if (activeTrackId && !isManualScrollRef.current) {
      centerDockPill(activeTrackId);
    }
  }, [activeTrackId]);

  // Handle URL hash for track navigation on load (e.g. #track-10)
  useEffect(() => {
    if (!loading && tracks.length > 0) {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#track-")) {
        const trackId = hash.replace("#track-", "");
        scrollToTrack(Number(trackId) || trackId);
      }
    }
  }, [loading, tracks]);

  const scrollToTrack = (trackId) => {
    // 1. Immediately update active state and center dock pill
    setCollapsedTracks((prev) => ({ ...prev, [trackId]: false }));
    setActiveTrackId(trackId);
    centerDockPill(trackId);

    // 2. Lock programmatic scrolling so observer won't abort smooth scroll
    isManualScrollRef.current = true;
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }
    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 950);

    // 3. Initiate vertical smooth scroll on main-scroll-container
    setTimeout(() => {
      const el = document.getElementById(`track-${trackId}`);
      const scrollContainer = document.getElementById("main-scroll-container");

      if (el && scrollContainer) {
        const offset = 80; // height of sticky nav dock
        const containerRect = scrollContainer.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const currentScroll = scrollContainer.scrollTop;
        const targetPosition = currentScroll + (elementRect - containerRect) - offset;
        scrollContainer.scrollTo({ top: targetPosition, behavior: "smooth" });
      } else if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }, 20);
  };

  const handleOpenSwitchModal = () => {
    window.dispatchEvent(new CustomEvent("open-switch-path-modal"));
  };

  const toggleTrackCollapse = (trackId) => {
    setCollapsedTracks((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
  };

  // Toggle topic completion with Universal Progress reflection
  const handleToggleTopic = async (topic) => {
    const currentCompleted = topic.status === "completed";
    const nextStatus = currentCompleted ? "not_started" : "completed";

    // ENFORCEMENT: If attempting to mark completed and quiz is unpassed
    if (nextStatus === "completed" && topic.hasQuiz && !topic.quizPassed) {
      showToast("Assessment required: Open topic and pass the test to complete.", "warning");
      return;
    }

    setTogglingTopicId(topic.id);

    // Optimistically update topic status across ALL tracks in state
    setRoadmapData((prev) => {
      if (!prev) return prev;
      const updateTracks = (trackList) =>
        trackList.map((t) => {
          const updatedTopics = t.topics.map((top) =>
            top.id === topic.id ? { ...top, status: nextStatus } : top
          );
          const completedCount = updatedTopics.filter((tp) => tp.status === "completed").length;
          const totalCount = updatedTopics.length;
          return {
            ...t,
            topics: updatedTopics,
            completedTopics: completedCount,
            progressPercentage:
              totalCount > 0 ? Math.round((completedCount / totalCount) * 1000) / 10 : 0,
          };
        });

      const nextTracks = updateTracks(prev.tracks || prev.roadmap?.tracks || []);
      const newTotalCompleted = nextTracks.reduce(
        (sum, t) => sum + (t.topics?.filter((tp) => tp.status === "completed").length || 0),
        0
      );
      const newOverallProgress =
        overallTotal > 0 ? Math.round((newTotalCompleted / overallTotal) * 1000) / 10 : 0;

      return {
        ...prev,
        tracks: nextTracks,
        completedTopics: newTotalCompleted,
        overallProgress: newOverallProgress,
        roadmap: prev.roadmap
          ? {
              ...prev.roadmap,
              tracks: nextTracks,
            }
          : undefined,
      };
    });

    try {
      await apiClient.post(`/user/topics/${topic.id}/toggle`, {
        status: nextStatus,
      });
    } catch (err) {
      console.error("Error toggling topic completion:", err);
      // Revert state on error
      setRoadmapData((prev) => {
        if (!prev) return prev;
        const revertTracks = (trackList) =>
          trackList.map((t) => {
            const revertedTopics = t.topics.map((top) =>
              top.id === topic.id ? { ...top, status: topic.status } : top
            );
            const completedCount = revertedTopics.filter((tp) => tp.status === "completed").length;
            const totalCount = revertedTopics.length;
            return {
              ...t,
              topics: revertedTopics,
              completedTopics: completedCount,
              progressPercentage:
                totalCount > 0 ? Math.round((completedCount / totalCount) * 1000) / 10 : 0,
            };
          });

        const prevTracks = revertTracks(prev.tracks || prev.roadmap?.tracks || []);
        return {
          ...prev,
          tracks: prevTracks,
          roadmap: prev.roadmap ? { ...prev.roadmap, tracks: prevTracks } : undefined,
        };
      });

      const errMsg =
        err.response?.data?.error ||
        "Assessment required: Open topic and pass the test to complete.";
      showToast(errMsg, "warning");
    } finally {
      setTogglingTopicId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Sticky Track Navigation Dock ── */}
      {tracks.length > 0 && (
        <div className="sticky top-0 z-30 bg-[#f8f9fa]/95 backdrop-blur-md py-3 border-b border-gray-200/80 mb-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div
              ref={dockContainerRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
            >
              {tracks.map((track) => (
                <button
                  key={track.id}
                  id={`pill-track-${track.id}`}
                  type="button"
                  onClick={() => scrollToTrack(track.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                    activeTrackId === track.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-8 pt-0 max-w-6xl mx-auto space-y-6">
        {/* Error notification banner */}
        {error && (
          <div className="bg-red-50 text-danger border border-red-200 rounded-2xl p-4 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchRoadmap}
              className="text-xs font-semibold text-danger underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Global Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-fade-in">
            <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
            <p className="text-sm font-medium text-secondary-text">
              Loading your dynamic modular roadmap...
            </p>
          </div>
        ) : !roadmapData?.hasSelectedPath && !roadmapData?.path ? (
          /* If no path selected yet */
          <div className="bg-surface rounded-3xl border border-border-subtle p-8 text-center space-y-4 shadow-card">
            <Compass className="h-12 w-12 text-brand-600 mx-auto" />
            <h2 className="text-xl font-bold text-primary-text">
              No Preparation Path Selected
            </h2>
            <p className="text-xs text-secondary-text max-w-md mx-auto">
              Please select your target engineering role on the Dashboard to configure your personalized modular preparation roadmap.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition-all shadow-subtle hover:shadow-hover cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* ── Header Hero: Active Path Title & Progress ── */}
            <section className="relative bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-purple-600 to-emerald-500 rounded-t-3xl" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3 text-brand-600" />
                      Dynamic Modular Skill-Tree
                    </span>
                    <span className="text-[11px] font-semibold text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle">
                      ⏱️ {activePath?.dailyHours || 2} Hours / Day
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/70">
                      {tracks.length} Active Tracks
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
                    {activePath?.name || "Target Engineering Path"}
                  </h1>
                  <p className="text-xs text-secondary-text max-w-2xl leading-relaxed">
                    {activePath?.description ||
                      "Modular skill tree comprising algorithmic problem solving, core computer science systems, and hands-on production engineering."}
                  </p>
                </div>

                {/* Header Action: Switch Path Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    id="switch-path-roadmap-button"
                    onClick={handleOpenSwitchModal}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-subtle bg-surface hover:bg-background text-primary-text text-xs font-semibold transition-all shadow-subtle hover:border-brand-200 cursor-pointer group"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-brand-600 transition-transform duration-300 group-hover:rotate-180" />
                    <span>Switch Path</span>
                  </button>

                  <div className="hidden sm:flex flex-col items-end pl-3 border-l border-border-subtle">
                    <span className="text-xs font-bold text-primary-text">
                      {overallPercentage}% Complete
                    </span>
                    <span className="text-[10px] text-secondary-text">
                      {overallCompleted} / {overallTotal} Topics
                    </span>
                  </div>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="mt-6 pt-5 border-t border-border-subtle/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-secondary-text">
                  <span>Overall Curriculum Completion</span>
                  <span className="font-bold text-primary-text">
                    {overallCompleted} of {overallTotal} Topics Finished ({overallPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-border-subtle h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-600 via-purple-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${overallPercentage}%` }}
                  />
                </div>
              </div>
            </section>

            {/* ── Dynamic Modular Skill Tracks ── */}
            <div className="space-y-5">
              {tracks.map((track, trackIdx) => {
                const theme = getTrackTheme(track, trackIdx);
                const TrackIcon = theme.icon;
                const isCollapsed = Boolean(collapsedTracks[track.id]);
                const completedCount =
                  track.completedTopics ??
                  track.topics?.filter((tp) => tp.status === "completed").length ??
                  0;
                const totalCount = track.totalTopics ?? track.topics?.length ?? 0;
                const progressPct =
                  track.progressPercentage ??
                  (totalCount > 0 ? Math.round((completedCount / totalCount) * 1000) / 10 : 0);
                const isPracticeEvaluation = track.evaluationType === "practice";

                return (
                  <div
                    key={track.id}
                    id={`track-${track.id}`}
                    className="bg-surface rounded-3xl border border-border-subtle shadow-card overflow-hidden transition-all duration-200"
                  >
                    {/* Track Card Header */}
                    <div
                      onClick={() => toggleTrackCollapse(track.id)}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-background/40 transition-colors select-none"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${theme.color} text-white flex items-center justify-center shadow-subtle shrink-0`}
                        >
                          <TrackIcon className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base sm:text-lg font-bold text-primary-text tracking-tight truncate">
                              {track.name}
                            </h2>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${theme.bgLight} ${theme.textLight} border ${theme.borderLight}`}
                            >
                              {theme.badgeText}
                            </span>
                            {/* Evaluation Type Badge */}
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isPracticeEvaluation
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {isPracticeEvaluation ? (
                                <>
                                  <Zap className="h-2.5 w-2.5 text-blue-600" />
                                  <span>Self-Attested Practice (DSA/SQL & Dev)</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-2.5 w-2.5 text-emerald-600" />
                                  <span>Verified Quiz Assessment</span>
                                </>
                              )}
                            </span>
                          </div>
                          {track.description && (
                            <p className="text-xs text-secondary-text truncate mt-1">
                              {track.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Progress Indicator & Collapse Chevron */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                        <div className="flex flex-col sm:items-end">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary-text">
                              {completedCount} / {totalCount} Topics
                            </span>
                            <span className="text-xs font-bold text-secondary-text">
                              ({progressPct}%)
                            </span>
                          </div>
                          <div className="w-28 sm:w-36 bg-border-subtle h-2 rounded-full overflow-hidden mt-1.5">
                            <div
                              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${theme.color}`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="p-1 rounded-xl text-secondary-text hover:text-primary-text transition-colors"
                          aria-label="Toggle section"
                        >
                          {isCollapsed ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronUp className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Track Topics Body */}
                    {!isCollapsed && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-border-subtle/70 space-y-3 animate-fade-in">
                        {track.topics && track.topics.length > 0 ? (
                          <div className="space-y-2 pt-1">
                            {track.topics.map((topic) => {
                              const isCompleted = topic.status === "completed";
                              const isUpdating = togglingTopicId === topic.id;
                              const isQuizLocked =
                                topic.hasQuiz && !topic.quizPassed && !isCompleted;
                              const isHighlighted = highlightedTopicId === topic.id;

                              return (
                                <div
                                  key={topic.id}
                                  id={`topic-${topic.id}`}
                                  onClick={() => {
                                    if (typeof topic.id === "number") {
                                      navigate(`/topics/${topic.id}`);
                                    }
                                  }}
                                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start justify-between gap-3.5 cursor-pointer select-none group ${
                                    isHighlighted
                                      ? "ring-2 ring-indigo-500/80 shadow-lg shadow-indigo-500/20 bg-indigo-50/20 border-indigo-300 scale-[1.005]"
                                      : isCompleted
                                      ? "bg-emerald-50/40 border-emerald-200/70 hover:border-emerald-300"
                                      : "bg-surface border-border-subtle hover:border-brand-300 hover:shadow-subtle"
                                  }`}
                                >
                                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleTopic(topic);
                                      }}
                                      className="shrink-0 mt-0.5 transition-transform active:scale-90 p-0.5 rounded hover:bg-black/5"
                                      title={
                                        isQuizLocked
                                          ? "Assessment required: Open topic and pass the test to complete"
                                          : isCompleted
                                          ? "Mark as Incomplete"
                                          : "Mark as Completed"
                                      }
                                    >
                                      {isUpdating ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                                      ) : isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                                      ) : isQuizLocked ? (
                                        <Lock className="h-4 w-4 text-amber-500/80 group-hover:text-amber-600" />
                                      ) : (
                                        <Circle className="h-4 w-4 text-secondary-text/70 group-hover:text-primary-text" />
                                      )}
                                    </button>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <h4
                                            className={`text-xs font-bold leading-snug truncate group-hover:text-brand-600 transition-colors ${
                                              isCompleted
                                                ? "text-emerald-950 line-through opacity-80"
                                                : "text-primary-text"
                                            }`}
                                          >
                                            {topic.name}
                                          </h4>
                                          {topic.hasQuiz && (
                                            <span
                                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                                                topic.quizPassed
                                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                  : "bg-amber-50 text-amber-700 border-amber-200"
                                              }`}
                                            >
                                              {topic.quizPassed ? "Quiz Passed" : "Quiz Required"}
                                            </span>
                                          )}
                                        </div>

                                        {topic.estimatedMinutes > 0 && (
                                          <span className="text-[10px] font-medium text-secondary-text shrink-0 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            ~{topic.estimatedMinutes}m
                                          </span>
                                        )}
                                      </div>

                                      {topic.description && (
                                        <p className="text-[11px] text-secondary-text mt-0.5 line-clamp-2">
                                          {topic.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <ChevronRight className="h-4 w-4 text-secondary-text/40 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-xs text-secondary-text">
                            No topics found in this track.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Toast Alert Notification */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-slide-down">
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-700/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <p className="text-xs sm:text-sm font-medium leading-snug">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Floating Scroll-to-Top Button ── */}
        {showScrollTop && (
          <button
            type="button"
            onClick={() => {
              const scrollContainer = document.getElementById("main-scroll-container");
              if (scrollContainer) {
                scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center cursor-pointer border border-brand-400/30 animate-fade-in"
          >
            <ChevronUp className="h-5 w-5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
