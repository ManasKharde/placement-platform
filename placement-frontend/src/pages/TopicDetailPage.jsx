import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { normalizeTrackName } from "../utils/trackUtils";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  BookOpen,
  Code,
  Terminal,
  Cpu,
  Database,
  PlayCircle,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Target,
  Layers,
  Award,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Trophy,
  Zap,
  ArrowRight,
  Lock,
} from "lucide-react";

// Helper to extract YouTube video embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  // If it is already an embed URL
  if (url.includes("youtube.com/embed/")) {
    return url;
  }
  // Extract 11-character video ID from any standard YouTube format
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

// Sanitizes raw LaTeX commands and $ wrappers from text lines, plus strips html tags like <br>
const sanitizeLine = (text) => {
  if (!text) return "";
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\\to/g, "→")
    .replace(/\\infty/g, "∞")
    .replace(/\\log/g, "log")
    .replace(/\\sqrt\{?([^}]+)\}?/g, "sqrt($1)")
    .replace(/\$([^$]+)\$/g, "$1") // Strip $inline math$ wrappers
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "");
};

// Simple custom Markdown theory viewer
const SimpleMarkdown = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  if (!content) return null;

  const handleCopy = (codeText, idx) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(idx);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 text-xs sm:text-sm text-primary-text leading-relaxed">
      {parts.map((part, idx) => {
        if (part.startsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const lang = lines[0]?.match(/^[a-z]+/i) ? lines[0] : "";
          const code = lang ? lines.slice(1).join("\n") : lines.join("\n");

          return (
            <div
              key={idx}
              className="relative my-3 rounded-2xl bg-[#0f172a] text-slate-100 border border-slate-800 shadow-card overflow-hidden font-mono text-xs"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="uppercase font-semibold tracking-wider">
                  {lang || "Code"}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(code, idx)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedCode === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Process standard markdown lines
        const lines = part.split("\n");
        return (
          <div key={idx} className="space-y-2">
            {lines.map((line, lIdx) => {
              let trimmed = sanitizeLine(line.trim());
              if (!trimmed) return null;

              // Filter out horizontal rules (---, ***, ___ etc.)
              if (/^[-*_]{3,}$/.test(trimmed)) return null;

              // Filter out markdown table separators (|---|---| or |:---|:---|)
              if (/^\|[-:\s|]+\|$/.test(trimmed)) return null;

              // If a pipe table line was present e.g. | Col 1 | Col 2 |
              if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
                const cells = trimmed
                  .slice(1, -1)
                  .split("|")
                  .map((c) => c.trim())
                  .filter(Boolean);
                if (cells.length === 0) return null;
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 ml-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span
                      className="text-secondary-text"
                      dangerouslySetInnerHTML={{
                        __html: cells
                          .map((c) =>
                            c
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-text font-bold">$1</strong>')
                              .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-background border border-border-subtle font-mono text-[11px] text-brand-600 font-semibold">$1</code>')
                          )
                          .join(" — "),
                      }}
                    />
                  </div>
                );
              }

              // Strip blockquote '>' prefix
              if (trimmed.startsWith(">")) {
                trimmed = trimmed.replace(/^>\s*/, "");
                if (!trimmed) return null;
              }

              if (trimmed.startsWith("#### ")) {
                return (
                  <h4
                    key={lIdx}
                    className="text-sm sm:text-base font-bold text-primary-text tracking-tight mt-4 mb-1.5 flex items-center gap-2"
                  >
                    <span>{trimmed.replace("#### ", "")}</span>
                  </h4>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={lIdx}
                    className="text-base sm:text-lg font-bold text-primary-text tracking-tight mt-5 mb-2 flex items-center gap-2 border-b border-border-subtle/60 pb-1.5"
                  >
                    <span>{trimmed.replace("### ", "")}</span>
                  </h3>
                );
              }

              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={lIdx}
                    className="text-lg sm:text-xl font-extrabold text-primary-text tracking-tight mt-6 mb-2 border-b border-border-subtle pb-2"
                  >
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }

              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const bulletText = trimmed.slice(2);
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 ml-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span
                      className="text-secondary-text"
                      dangerouslySetInnerHTML={{
                        __html: bulletText
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-text font-bold">$1</strong>')
                          .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-background border border-border-subtle font-mono text-[11px] text-brand-600 font-semibold">$1</code>'),
                      }}
                    />
                  </div>
                );
              }

              if (/^\d+\.\s/.test(trimmed)) {
                const num = trimmed.match(/^\d+\./)[0];
                const itemText = trimmed.replace(/^\d+\.\s*/, "");
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 ml-1">
                    <span className="text-xs font-bold text-brand-600 mt-0.5 shrink-0">
                      {num}
                    </span>
                    <span
                      className="text-secondary-text"
                      dangerouslySetInnerHTML={{
                        __html: itemText
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-text font-bold">$1</strong>')
                          .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-background border border-border-subtle font-mono text-[11px] text-brand-600 font-semibold">$1</code>'),
                      }}
                    />
                  </div>
                );
              }

              return (
                <p
                  key={lIdx}
                  className="text-secondary-text leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: trimmed
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-text font-bold">$1</strong>')
                      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-background border border-border-subtle font-mono text-[11px] text-brand-600 font-semibold">$1</code>'),
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// MCQ Question Text & Code Formatter
const RenderMcqQuestionText = ({ text }) => {
  if (!text) return null;

  const isCodeBlock = (part) => {
    const trimmed = part.trim();
    if (!trimmed) return false;
    if (trimmed.endsWith("?")) return false;

    const startsWithCode =
      /^(class|struct)\s+[A-Za-z0-9_]+/m.test(trimmed) ||
      /^(template\s*<|namespace\s+)/m.test(trimmed) ||
      /^(int|void|bool|double|float|auto)\s+main\s*\(/m.test(trimmed);

    const containsCodeStructure =
      (trimmed.includes("{") &&
        trimmed.includes("}") &&
        (trimmed.includes(";") || trimmed.includes("cout <<") || trimmed.includes("return "))) ||
      /^[A-Za-z0-9_:]+\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{/m.test(trimmed) ||
      /(public|private|protected):/m.test(trimmed);

    const isNumberedList = /^[0-9]+\.\s+[A-Z]/m.test(trimmed) && !trimmed.includes("{");
    const isBulletList = /^[•\-*]\s+/m.test(trimmed) && !trimmed.includes("{");

    if (isNumberedList || isBulletList) return false;

    return Boolean(startsWithCode || containsCodeStructure);
  };

  const parts = text.split("\n\n");

  if (parts.length <= 1 || !parts.some(isCodeBlock)) {
    return (
      <div className="text-slate-900 font-semibold text-base mb-4 leading-relaxed whitespace-pre-wrap break-words">
        {text}
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-4">
      {parts.map((part, pIdx) => {
        const trimmed = part.trim();
        if (!trimmed) return null;

        if (isCodeBlock(trimmed)) {
          return (
            <div
              key={pIdx}
              className="my-3 rounded-2xl bg-[#0f172a] text-slate-100 p-4 border border-slate-800 font-mono text-xs overflow-x-auto shadow-inner"
            >
              <pre className="font-mono text-xs leading-relaxed whitespace-pre">
                <code>{trimmed}</code>
              </pre>
            </div>
          );
        }

        return (
          <div
            key={pIdx}
            className="text-slate-900 font-semibold text-base leading-relaxed whitespace-pre-wrap break-words"
          >
            {trimmed}
          </div>
        );
      })}
    </div>
  );
};

const getOptionLetter = (opt, idx) => {
  if (typeof opt === "object" && opt !== null) {
    if (opt.letter) return opt.letter;
    if (typeof opt.text === "string" && /^[A-D]\)/.test(opt.text.trim())) {
      return opt.text.trim().charAt(0);
    }
  }
  if (typeof opt === "string" && /^[A-D]\)/.test(opt.trim())) {
    return opt.trim().charAt(0);
  }
  return ["A", "B", "C", "D"][idx] || String.fromCharCode(65 + idx);
};

const getOptionText = (opt) => {
  if (typeof opt === "object" && opt !== null) {
    return opt.text || opt.label || opt.title || JSON.stringify(opt);
  }
  if (typeof opt === "string" && /^[A-D]\)\s*/.test(opt.trim())) {
    return opt.trim().replace(/^[A-D]\)\s*/, "");
  }
  return opt != null ? String(opt) : "";
};

const getCorrectAnswerLetter = (q) => {
  if (q.correctAnswer) return q.correctAnswer;
  if (typeof q.correct_index === "number") {
    return ["A", "B", "C", "D"][q.correct_index] || String.fromCharCode(65 + q.correct_index);
  }
  if (Array.isArray(q.options)) {
    const idx = q.options.findIndex((opt) => {
      if (typeof opt === "object" && opt !== null) {
        return Boolean(opt.isCorrect || opt.correct);
      }
      if (typeof opt === "string" && q.correct_answer) {
        return opt.trim() === q.correct_answer.trim();
      }
      return false;
    });
    if (idx !== -1) {
      return ["A", "B", "C", "D"][idx] || String.fromCharCode(65 + idx);
    }
  }
  return q.answer || "";
};

export const TopicDetailPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("learning"); // "learning" | "practice"
  const [togglingCompletion, setTogglingCompletion] = useState(false);

  // Core CS MCQ Dual-Mode Timed Test & Browse Engine State
  const [mcqQuizMode, setMcqQuizMode] = useState("browse"); // 'browse' (full vertical list) | 'timed' (single question aptitude view)
  const [mcqActiveQuestionIndex, setMcqActiveQuestionIndex] = useState(0);
  const [mcqSelectedAnswers, setMcqSelectedAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [mcqIsTimerRunning, setMcqIsTimerRunning] = useState(false);
  const [mcqTimeLeft, setMcqTimeLeft] = useState(3600); // 60 minutes for 50 questions
  const [mcqIsTestSubmitted, setMcqIsTestSubmitted] = useState(false);
  const [mcqRevealedExplanations, setMcqRevealedExplanations] = useState({});
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);

  // Quiz Engine State
  const [quizData, setQuizData] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizMode, setQuizMode] = useState("overview"); // "overview" | "active" | "review"
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizError, setQuizError] = useState("");
  const [expandedExplanations, setExpandedExplanations] = useState({});

  const selectedAnswersRef = useRef(selectedAnswers);
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  const submittingRef = useRef(submittingQuiz);
  useEffect(() => {
    submittingRef.current = submittingQuiz;
  }, [submittingQuiz]);

  // Local storage state for individual checklist tasks
  const [checkedTaskIds, setCheckedTaskIds] = useState(() => {
    try {
      return new Set(
        JSON.parse(localStorage.getItem(`topic_tasks_${topicId}`) || "[]")
      );
    } catch {
      return new Set();
    }
  });

  // Collapsed questions state for CS flashcards
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState(null);

  const fetchTopicDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiClient.get(`/topics/${topicId}`);
      if (res.data?.topic) {
        const fetchedTopic = {
          ...res.data.topic,
          track_name: normalizeTrackName(res.data.topic.track_name),
        };
        setTopic(fetchedTopic);
        const qCount = res.data.topic.practice_items?.length || 0;
        const initialSeconds = qCount <= 25 ? 1800 : 3600;
        setMcqTimeLeft(initialSeconds);
      } else {
        setError("Topic details could not be found.");
      }
    } catch (err) {
      console.error("Failed to load topic details:", err);
      setError(
        err.response?.data?.error ||
        "Unable to load topic workspace. Please refresh or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizData = async () => {
    try {
      setLoadingQuiz(true);
      const res = await apiClient.get(`/topics/${topicId}/quiz`);
      setQuizData(res.data);
    } catch (err) {
      console.error("Failed to load topic quiz:", err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  useEffect(() => {
    if (topicId) {
      fetchTopicDetail();
      fetchQuizData();
      setQuizMode("overview");
      setQuizResult(null);
      setSelectedAnswers({});
      setMcqQuizMode("browse");
      setMcqActiveQuestionIndex(0);
      setMcqSelectedAnswers({});
      setMcqIsTimerRunning(false);
      setMcqIsTestSubmitted(false);
      setMcqRevealedExplanations({});
      setIsAssessmentStarted(false);
    }
  }, [topicId]);

  useEffect(() => {
    if (topic?.practice_items?.length) {
      const qCount = topic.practice_items.length;
      const initialSeconds = qCount <= 25 ? 1800 : 3600;
      setMcqTimeLeft(initialSeconds);
    }
  }, [topic]);

  // Handle Assessment Submission
  const handleSubmitQuiz = async (answersToSubmit = selectedAnswersRef.current) => {
    if (submittingRef.current || !quizData?.quiz) return;
    setSubmittingQuiz(true);
    setQuizError("");

    try {
      const res = await apiClient.post(`/topics/${topicId}/quiz/submit`, {
        answers: answersToSubmit,
      });

      setQuizResult(res.data);
      setQuizMode("review");

      // Auto-expand explanations in review
      const defaultExpanded = {};
      if (res.data.review) {
        res.data.review.forEach((_, idx) => {
          defaultExpanded[idx] = true;
        });
      }
      setExpandedExplanations(defaultExpanded);

      // If passed, immediately mark topic as completed in UI
      if (res.data.passed) {
        setTopic((prev) => ({
          ...prev,
          status: "completed",
          completed_at: new Date().toISOString(),
        }));
      }

      // Update quizData latest attempt
      setQuizData((prev) => ({
        ...prev,
        latest_attempt: {
          id: Date.now(),
          score: res.data.score,
          total_questions: res.data.total_questions,
          percentage: res.data.percentage,
          passed: res.data.passed,
          attempted_at: new Date().toISOString(),
        },
      }));
    } catch (err) {
      console.error("Quiz submission error:", err);
      setQuizError(
        err.response?.data?.error || "Failed to submit assessment. Please try again."
      );
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Live Countdown Timer for Active Quiz
  useEffect(() => {
    let timer = null;
    if (quizMode === "active") {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto submit when time expires
            if (!submittingRef.current) {
              handleSubmitQuiz(selectedAnswersRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizMode]);

  // Live Countdown Timer for MCQ Timed Assessment Mode (Auto-Submit on Expiration)
  useEffect(() => {
    if (!mcqIsTimerRunning || mcqIsTestSubmitted) return;

    const timer = setInterval(() => {
      setMcqTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setMcqIsTestSubmitted(true);
          setMcqIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mcqIsTimerRunning, mcqIsTestSubmitted]);

  // Start or Retake Quiz
  const handleStartQuiz = () => {
    if (!quizData?.quiz || !quizData.questions?.length) return;
    const initialTime = (quizData.quiz.time_limit_minutes || 5) * 60;
    setSelectedAnswers({});
    setActiveQuestionIdx(0);
    setTimeRemaining(initialTime);
    setQuizResult(null);
    setQuizError("");
    setQuizMode("active");
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Master topic completion toggle
  const handleToggleMasterCompletion = async () => {
    if (!topic || togglingCompletion) return;
    const isCompleted = topic.status === "completed";
    const nextStatus = isCompleted ? "not_started" : "completed";

    setTogglingCompletion(true);
    // Optimistic update
    setTopic((prev) => ({
      ...prev,
      status: nextStatus,
      completed_at: nextStatus === "completed" ? new Date().toISOString() : null,
    }));

    try {
      await apiClient.post(`/user/topics/${topic.id}/toggle`, {
        status: nextStatus,
      });
    } catch (err) {
      console.error("Error toggling topic status:", err);
      // Rollback
      setTopic((prev) => ({
        ...prev,
        status: isCompleted ? "completed" : "not_started",
      }));
    } finally {
      setTogglingCompletion(false);
    }
  };

  // Toggle individual checklist item
  const handleToggleTask = (taskKey) => {
    const nextSet = new Set(checkedTaskIds);
    if (nextSet.has(taskKey)) {
      nextSet.delete(taskKey);
    } else {
      nextSet.add(taskKey);
    }
    setCheckedTaskIds(nextSet);
    try {
      localStorage.setItem(
        `topic_tasks_${topicId}`,
        JSON.stringify([...nextSet])
      );
    } catch (err) {
      console.error("Failed to save task checkbox state:", err);
    }
  };

  const getPillarIcon = (pillarKey) => {
    switch (pillarKey) {
      case "dsa":
        return <Terminal className="h-4 w-4" />;
      case "cs":
        return <Cpu className="h-4 w-4" />;
      case "databases":
      case "apt_sql":
        return <Database className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const isCompleted = topic?.status === "completed";
  const pillarKey = topic?.pillar?.key || "dev";
  const isDatabaseTopic =
    pillarKey === "databases" ||
    topic?.pillar?.name === "Databases" ||
    topic?.track_slug === "postgresql-mastery" ||
    topic?.track_slug === "mongodb-mastery" ||
    topic?.track_slug === "databases" ||
    (topic?.slug && (topic.slug.startsWith("pg-") || topic.slug.startsWith("mongo-")));
  const isMcqEvaluationTopic = Boolean(
    topic?.practice_items?.length > 0 &&
    topic.practice_items.some(
      (item) => item.type === "mcq" || Array.isArray(item.options)
    )
  );

  const trackIdentifier = `${topic?.track_name || ""} ${topic?.track_slug || ""} ${topic?.track || ""} ${topic?.category || ""} ${topic?.module_name || ""} ${topic?.pillar?.name || ""} ${topic?.pillar?.key || ""} ${topic?.slug || ""}`.toLowerCase();

  const isAptitude =
    trackIdentifier.includes("aptitude") ||
    trackIdentifier.includes("reasoning") ||
    trackIdentifier.includes("quantitative") ||
    Boolean(topic?.slug && topic.slug.startsWith("aptitude-")) ||
    Boolean(topic?.track_slug && topic.track_slug.includes("aptitude"));

  const pillarStr = `${typeof topic?.pillar === "string" ? topic.pillar : topic?.pillar?.name || ""} ${topic?.pillar?.key || ""}`.toLowerCase();
  const trackStr = `${typeof topic?.track === "string" ? topic.track : topic?.track_name || topic?.track?.name || ""} ${topic?.track_slug || topic?.track?.slug || ""}`.toLowerCase();

  const isCoreCS = Boolean(
    !isAptitude &&
    (pillarKey === "cs" ||
      pillarStr.includes("cs fundamentals") ||
      pillarStr.includes("core computer science") ||
      trackStr.includes("core-computer-science") ||
      trackStr.includes("core computer science") ||
      trackStr === "core cs" ||
      trackStr === "core" ||
      pillarStr === "core" ||
      ((trackStr.includes("core") || pillarStr.includes("core")) &&
        (trackStr.includes("cs") ||
          trackStr.includes("computer science") ||
          pillarStr.includes("cs") ||
          pillarStr.includes("computer science") ||
          pillarKey === "cs")))
  );

  const isInterviewQATopic =
    !isMcqEvaluationTopic &&
    (topic?.track_slug === "javascript-mastery" ||
      topic?.slug?.startsWith("js-") ||
      Boolean(
        topic?.practice_items?.length > 0 &&
        topic.practice_items.some(
          (p) => p.platform === "Technical Interview QA" || p.answer
        )
      ));
  const hasQuiz = Boolean(quizData?.hasQuiz) || isAptitude;
  const isQuizPassed = Boolean(quizData?.latest_attempt?.passed);
  const isLocked = (hasQuiz || isAptitude) && !isQuizPassed && !isCompleted;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* ── Top Bar: Breadcrumbs & Master Completion ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-secondary-text flex-wrap">
          <button
            type="button"
            onClick={() => navigate('/roadmap', { state: { scrollToTopicId: topic?.id || parseInt(topicId, 10) } })}
            className="flex items-center gap-1.5 font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Roadmap</span>
          </button>
          <span>/</span>
          <span className="font-medium text-secondary-text shrink-0">
            {normalizeTrackName(topic?.track_name) || "Track"}
          </span>
          <span>/</span>
          <span
            title={topic?.title || "Topic"}
            className="truncate max-w-[180px] sm:max-w-xs md:max-w-md lg:max-w-lg inline-block align-bottom font-medium text-slate-900"
          >
            {topic?.title || "Topic"}
          </span>
        </div>

        {/* Master Completion Button */}
        {topic && (
          <button
            type="button"
            id="master-topic-toggle-button"
            disabled={togglingCompletion || isLocked}
            onClick={handleToggleMasterCompletion}
            title={
              isLocked
                ? "Pass assessment (>=70%) to unlock completion"
                : isCompleted
                  ? "Mark as Incomplete"
                  : "Mark as Completed"
            }
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-subtle shrink-0 ${isLocked
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-80"
              : isCompleted
                ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-hover"
                : "bg-surface hover:bg-background text-primary-text border border-border-subtle hover:border-brand-300 cursor-pointer hover:shadow-hover"
              }`}
          >
            {togglingCompletion ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                <span>Updating Status...</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-white fill-emerald-500" />
                <span>Completed ✓</span>
              </>
            ) : isLocked ? (
              <>
                <Lock className="h-4 w-4 text-amber-500" />
                <span>Locked (Quiz Required)</span>
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 text-secondary-text" />
                <span>Mark as Completed</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="bg-red-50 text-danger border border-red-200 rounded-2xl p-4 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchTopicDetail}
            className="text-xs font-semibold text-danger underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-fade-in">
          <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
          <p className="text-sm font-medium text-secondary-text">
            Loading topic workspace...
          </p>
        </div>
      ) : topic ? (
        <div className="space-y-6 animate-slide-up">
          {/* ── Topic Header Card ── */}
          <section className="relative bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 rounded-t-3xl" />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Pillar Badge */}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80">
                    {getPillarIcon(isDatabaseTopic ? "databases" : pillarKey)}
                    <span>{isDatabaseTopic ? "Databases" : (topic.pillar?.name || "Core Pillar")}</span>
                  </span>

                  {/* Track Pill */}
                  <span className="text-[11px] font-semibold text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle">
                    {normalizeTrackName(topic.track_name)}
                  </span>

                  {/* Subtrack Pill */}
                  {topic.subtrack && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      <Layers className="h-3 w-3" />
                      <span>{topic.subtrack}</span>
                    </span>
                  )}

                  {/* Estimated Minutes */}
                  <span className="text-[11px] font-semibold text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle flex items-center gap-1">
                    <Clock className="h-3 w-3 text-brand-600" />
                    {topic.id === 22262 || topic.slug === "java-backend-one-shot"
                      ? "62:55:08"
                      : topic.duration
                        ? topic.duration
                        : topic.estimated_minutes >= 60
                          ? `~${Math.floor(topic.estimated_minutes / 60)}h ${topic.estimated_minutes % 60 > 0 ? `${topic.estimated_minutes % 60}m` : ""}`.trim()
                          : `~${topic.estimated_minutes || 60} mins`}
                  </span>

                  {/* Status Pill */}
                  {isCompleted && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
                  {topic.title}
                </h1>
                <p className="text-xs sm:text-sm text-secondary-text leading-relaxed max-w-3xl">
                  {topic.short_description || topic.description}
                </p>
              </div>
            </div>

            {/* ── Dual Tab Navigation Header ── */}
            <div className="mt-8 pt-4 border-t border-border-subtle flex items-center gap-2">
              <button
                type="button"
                id="tab-learning-trigger"
                onClick={() => setActiveTab("learning")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "learning"
                  ? "bg-brand-600 text-white shadow-subtle"
                  : "text-secondary-text hover:text-primary-text hover:bg-background"
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Learning & Theory</span>
              </button>

              <button
                type="button"
                id="tab-practice-trigger"
                onClick={() => setActiveTab("practice")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "practice"
                  ? "bg-brand-600 text-white shadow-subtle"
                  : "text-secondary-text hover:text-primary-text hover:bg-background"
                  }`}
              >
                <Target className="h-4 w-4" />
                <span>Practical Evaluation</span>
                {quizData?.hasQuiz ? (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "practice"
                      ? "bg-white/20 text-white"
                      : quizData.latest_attempt?.passed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-brand-100 text-brand-700"
                      }`}
                  >
                    {quizData.latest_attempt?.passed ? "Passed ✓" : "Quiz"}
                  </span>
                ) : isDatabaseTopic ? (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "practice"
                      ? "bg-white/20 text-white"
                      : "bg-brand-100 text-brand-700"
                      }`}
                  >
                    {topic.practice_items?.length || 0}
                  </span>
                ) : topic.practice_items?.length > 0 ? (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "practice"
                      ? "bg-white/20 text-white"
                      : "bg-brand-100 text-brand-700"
                      }`}
                  >
                    {topic.practice_items.length}
                  </span>
                ) : null}
              </button>
            </div>
          </section>

          {/* ============================================================== */}
          {/* TAB 1: LEARNING & THEORY                                       */}
          {/* ============================================================== */}
          {activeTab === "learning" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Left 2 Cols: Markdown Theory Summary */}
              <div className="lg:col-span-2 bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-600" />
                    <h2 className="text-sm font-bold text-primary-text uppercase tracking-wider">
                      Concept Breakdown & Architectural Notes
                    </h2>
                  </div>
                  {topic.subtrack ? (
                    <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                      {topic.subtrack}
                    </span>
                  ) : (
                    <span className="text-[11px] text-secondary-text">
                      Placement Guide
                    </span>
                  )}
                </div>

                {/* Render Markdown Summary */}
                <SimpleMarkdown content={topic.theory_summary} />
              </div>

              {/* Right Col: Embedded Video, Practice Problems & Documentation Links */}
              <div className="space-y-6">
                {/* 1. Primary Embedded YouTube Video Lecture */}
                {(() => {
                  // Check all possible property variants returned by backend
                  const rawVideoUrl =
                    topic?.video_url ||
                    topic?.videoUrl ||
                    topic?.youtube_url ||
                    topic?.video ||
                    topic?.video_links?.map((v) => (typeof v === "string" ? v : v?.url)).find((u) => getYouTubeEmbedUrl(u)) ||
                    topic?.resources?.find((r) => r.resource_type === "video" && getYouTubeEmbedUrl(r.url))?.url ||
                    (typeof topic?.video_links?.[0] === "string" ? topic.video_links[0] : topic?.video_links?.[0]?.url) ||
                    topic?.resources?.find((r) => r.resource_type === "video")?.url;

                  const primaryVideo =
                    topic?.video_links?.find((v) => getYouTubeEmbedUrl(typeof v === "string" ? v : v?.url)) ||
                    topic?.resources?.find((r) => r.resource_type === "video" && getYouTubeEmbedUrl(r.url)) ||
                    topic?.video_links?.[0] ||
                    topic?.resources?.find((r) => r.resource_type === "video");

                  const embedUrl = getYouTubeEmbedUrl(rawVideoUrl);
                  const videoTitle =
                    (typeof primaryVideo === "object" ? primaryVideo?.title : null) ||
                    topic?.title ||
                    topic?.name ||
                    "Video Lecture";

                  const videoWatchUrl =
                    rawVideoUrl && !rawVideoUrl.includes("results?search_query")
                      ? rawVideoUrl
                      : null;

                  const creatorName =
                    topic?.creator_name ||
                    (typeof primaryVideo === "object" ? primaryVideo?.creator_name : null) ||
                    topic?.video_links?.[0]?.creator_name ||
                    (topic?.track_id === 654 || topic?.slug?.startsWith("pg-lecture")
                      ? "Thapa Technical (Vinod Bahadur Thapa)"
                      : null);

                  const creatorChannelUrl =
                    topic?.creator_channel_url ||
                    (typeof primaryVideo === "object" ? primaryVideo?.creator_channel_url : null) ||
                    topic?.video_links?.[0]?.creator_channel_url ||
                    (topic?.track_id === 654 || topic?.slug?.startsWith("pg-lecture")
                      ? "https://www.youtube.com/@ThapaTechnical"
                      : null);

                  return (
                    <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-5 sm:p-6 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4 text-red-500" />
                          <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">
                            Embedded Video Lecture
                          </h3>
                        </div>
                        {videoWatchUrl && (
                          <a
                            href={videoWatchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-medium text-secondary-text hover:text-red-500 flex items-center gap-1 transition-colors"
                          >
                            <span>Open on YouTube</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {embedUrl ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-black shadow-sm">
                          <iframe
                            src={embedUrl}
                            title={videoTitle}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No video available for this topic.
                        </div>
                      )}

                      {typeof primaryVideo === "object" && primaryVideo?.title && (
                        <div className="pt-1">
                          <h4 className="text-xs font-bold text-primary-text leading-snug line-clamp-2">
                            {primaryVideo.title}
                          </h4>
                          {(primaryVideo?.duration || topic.id === 22262 || (topic?.estimated_minutes >= 60 ? `${Math.floor(topic.estimated_minutes / 60)}h ${topic.estimated_minutes % 60}m` : null)) && (
                            <p className="text-[10px] text-secondary-text mt-0.5">
                              ⏱ Duration: {topic.id === 22262 ? "62:55:08" : (primaryVideo?.duration || `${Math.floor(topic.estimated_minutes / 60)}h ${topic.estimated_minutes % 60}m`)}
                            </p>
                          )}
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between flex-wrap gap-2">
                            {creatorName && (
                              <span>
                                Creator:{" "}
                                {creatorChannelUrl ? (
                                  <a
                                    href={creatorChannelUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-brand-600 dark:text-brand-400 hover:underline"
                                  >
                                    {creatorName}
                                  </a>
                                ) : (
                                  <span className="font-medium">{creatorName}</span>
                                )}
                              </span>
                            )}
                            {rawVideoUrl && (
                              <a
                                href={rawVideoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                              >
                                <span>Watch on YouTube ↗</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 2. Interactive Target Practice Problems / Interview Q&As / Timed Evaluation Suite */}
                {/* Render Timed Evaluation Suite strictly for Core Computer Science; omit for Frontend, React & Aptitude */}
                {isCoreCS && isMcqEvaluationTopic ? (
                  <div className="bg-surface rounded-3xl border border-brand-200/80 dark:border-brand-900/50 shadow-card p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-brand-600" />
                        <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">
                          Timed Evaluation Suite
                        </h3>
                      </div>
                      {(() => {
                        const overviewQCount = topic.practice_items?.length || 50;
                        const overviewMinutes = overviewQCount <= 25 ? 30 : 60;
                        return (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                            {overviewQCount} Questions • {overviewMinutes} Mins
                          </span>
                        );
                      })()}
                    </div>

                    <div className="space-y-3">
                      <div>
                        {(() => {
                          const overviewQCount = topic.practice_items?.length || 50;
                          const overviewMinutes = overviewQCount <= 25 ? 30 : 60;
                          return (
                            <h4 className="text-xs sm:text-sm font-bold text-primary-text">
                              {overviewQCount}-Question Timed Evaluation Test ({overviewMinutes} Mins)
                            </h4>
                          );
                        })()}
                        <p className="text-[11px] text-secondary-text mt-1 leading-relaxed">
                          Standard evaluation covering core foundations, analytical problem solving, and real-world placement assessment.
                        </p>
                      </div>

                      {/* Section breakdown badges */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-xl bg-background border border-border-subtle font-medium">
                          <span className="text-secondary-text">Theory & Concept</span>
                          <span className="font-bold text-primary-text">
                            {topic.practice_items?.filter((q) => (q.category || "").toLowerCase().includes("theory")).length || 25} Questions
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-xl bg-background border border-border-subtle font-medium">
                          <span className="text-secondary-text">Numerical & Memory Math</span>
                          <span className="font-bold text-primary-text">
                            {topic.practice_items?.filter((q) => (q.category || "").toLowerCase().includes("numerical") || (q.category || "").toLowerCase().includes("memory")).length || 15} Questions
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-xl bg-background border border-border-subtle font-medium">
                          <span className="text-secondary-text">Engineering Scenarios</span>
                          <span className="font-bold text-primary-text">
                            {topic.practice_items?.filter((q) => (q.category || "").toLowerCase().includes("scenario") || (q.category || "").toLowerCase().includes("engineering")).length || 10} Questions
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("practice");
                            if (!mcqIsTestSubmitted) {
                              setMcqQuizMode("timed");
                              const qCount = topic.practice_items?.length || 50;
                              setMcqTimeLeft(qCount <= 25 ? 1800 : 3600);
                              setMcqIsTimerRunning(true);
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-subtle hover:shadow-hover cursor-pointer"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          <span>
                            {mcqIsTimerRunning
                              ? "Resume Timed Test →"
                              : mcqIsTestSubmitted
                                ? "View Scorecard & Review →"
                                : "Launch 50-Question Test →"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* 3. Recommended Documentation & Guides */}
                <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
                    <FileText className="h-4 w-4 text-brand-600" />
                    <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">
                      Official Docs & Cheatsheets
                    </h3>
                  </div>

                  {topic.doc_links?.length > 0 ? (
                    <div className="space-y-2.5">
                      {topic.doc_links.map((doc, dIdx) => (
                        <a
                          key={dIdx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-2xl border border-border-subtle/80 bg-background/60 hover:bg-background hover:border-brand-200 transition-all flex items-start justify-between gap-3 group"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-primary-text group-hover:text-brand-600 transition-colors line-clamp-2">
                                {doc.title}
                              </h4>
                              <p className="text-[10px] text-secondary-text mt-0.5 truncate">
                                {new URL(doc.url).hostname.replace("www.", "")}
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-secondary-text/50 group-hover:text-primary-text shrink-0 mt-1" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-background/60 border border-border-subtle text-center">
                      <p className="text-xs text-secondary-text">
                        {isDatabaseTopic
                          ? "No external documentation required for this setup guide."
                          : "No documentation links indexed for this module."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: PRACTICAL EVALUATION                                    */}
          {/* ============================================================== */}
          {activeTab === "practice" && (
            <div className="space-y-6 animate-fade-in">
              {isMcqEvaluationTopic ? (() => {
                const mcqQuestions = topic.practice_items || [];
                const mcqTotal = mcqQuestions.length;
                const defaultTestSeconds = mcqTotal <= 25 ? 1800 : 3600;
                const defaultTestMinutes = mcqTotal <= 25 ? 30 : 60;

                const quizMode = mcqQuizMode;
                const setQuizMode = setMcqQuizMode;
                const activeQuestionIndex = mcqActiveQuestionIndex;
                const setActiveQuestionIndex = setMcqActiveQuestionIndex;
                const selectedAnswers = mcqSelectedAnswers;
                const setSelectedAnswers = setMcqSelectedAnswers;
                const isTimerRunning = mcqIsTimerRunning;
                const setIsTimerRunning = setMcqIsTimerRunning;
                const timeLeft = mcqTimeLeft;
                const setTimeLeft = setMcqTimeLeft;
                const isTestSubmitted = mcqIsTestSubmitted;
                const setIsTestSubmitted = setMcqIsTestSubmitted;

                let mcqCorrect = 0;
                let mcqIncorrect = 0;
                let mcqUnattempted = 0;
                let theoryCorrect = 0;
                let theoryTotal = 0;
                let numericalCorrect = 0;
                let numericalTotal = 0;
                let scenarioCorrect = 0;
                let scenarioTotal = 0;

                mcqQuestions.forEach((q, idx) => {
                  const qKey = q.id || idx;
                  const userAns = selectedAnswers[qKey];
                  const correctAns = getCorrectAnswerLetter(q);
                  const isCorrect =
                    userAns === correctAns ||
                    (typeof userAns === "number" &&
                      (["A", "B", "C", "D"][userAns] === correctAns || userAns === q.correct_index));
                  const cat = (q.category || "").toLowerCase();

                  if (cat.includes("theory")) {
                    theoryTotal++;
                    if (isCorrect) theoryCorrect++;
                  } else if (cat.includes("numerical") || cat.includes("memory")) {
                    numericalTotal++;
                    if (isCorrect) numericalCorrect++;
                  } else {
                    scenarioTotal++;
                    if (isCorrect) scenarioCorrect++;
                  }

                  if (userAns === undefined || userAns === null || userAns === "") {
                    mcqUnattempted++;
                  } else if (isCorrect) {
                    mcqCorrect++;
                  } else {
                    mcqIncorrect++;
                  }
                });

                const mcqPercentage = mcqTotal > 0 ? Math.round((mcqCorrect / mcqTotal) * 100) : 0;
                const isTestPassed = mcqPercentage >= 70;
                const answeredCount = Object.keys(selectedAnswers).filter(
                  (k) => selectedAnswers[k] !== undefined && selectedAnswers[k] !== null && selectedAnswers[k] !== ""
                ).length;
                const currentQuestion = mcqQuestions[activeQuestionIndex] || mcqQuestions[0];

                const handleMcqAssessmentSubmit = async () => {
                  setIsTestSubmitted(true);
                  setIsTimerRunning(false);
                  setQuizMode("browse");

                  // Auto-sync attempt to backend quiz engine
                  if (quizData?.quiz?.id) {
                    const formatted = {};
                    if (quizData.questions?.length > 0) {
                      quizData.questions.forEach((q, idx) => {
                        const raw =
                          selectedAnswers[q.id] !== undefined
                            ? selectedAnswers[q.id]
                            : selectedAnswers[idx] !== undefined
                            ? selectedAnswers[idx]
                            : mcqQuestions[idx]?.id
                            ? selectedAnswers[mcqQuestions[idx].id]
                            : undefined;
                        if (raw !== undefined && raw !== null && raw !== "") {
                          if (typeof raw === "number") {
                            formatted[q.id] = raw;
                          } else if (typeof raw === "string") {
                            const optIdx = ["A", "B", "C", "D"].indexOf(raw.trim().toUpperCase());
                            formatted[q.id] = optIdx !== -1 ? optIdx : 0;
                          }
                        }
                      });
                    } else if (mcqQuestions?.length > 0) {
                      mcqQuestions.forEach((q, idx) => {
                        const raw = selectedAnswers[q.id || idx];
                        if (raw !== undefined && raw !== null && raw !== "") {
                          if (typeof raw === "number") {
                            formatted[q.id || idx] = raw;
                          } else if (typeof raw === "string") {
                            const optIdx = ["A", "B", "C", "D"].indexOf(raw.trim().toUpperCase());
                            formatted[q.id || idx] = optIdx !== -1 ? optIdx : 0;
                          }
                        }
                      });
                    }
                    await handleSubmitQuiz(formatted);
                  }
                };

                return (
                  <div className="space-y-6">
                    {/* Aptitude Formal Assessment Gateway (Closed until started) */}
                    {isAptitude && !isAssessmentStarted ? (
                      <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                                <Award className="h-3.5 w-3.5" />
                                <span>Formal Assessment Gateway</span>
                              </span>

                              <span className="text-xs text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle flex items-center gap-1">
                                <Clock className="h-3 w-3 text-brand-600" />
                                ⏱ {defaultTestMinutes} Mins
                              </span>

                              <span className="text-xs text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle flex items-center gap-1">
                                <Target className="h-3 w-3 text-emerald-600" />
                                🎯 70% to Pass
                              </span>

                              <span className="text-xs text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle">
                                {mcqTotal} Questions
                              </span>

                              {/* Previous Attempt Badge */}
                              {(isTestSubmitted || quizData?.latest_attempt || isCompleted) && (
                                <span
                                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                    (isTestSubmitted ? isTestPassed : quizData?.latest_attempt?.passed || isCompleted)
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      : "bg-red-100 text-red-800 border border-red-300"
                                  }`}
                                >
                                  {(isTestSubmitted ? isTestPassed : quizData?.latest_attempt?.passed || isCompleted) ? (
                                    <>
                                      <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                                      <span>Passed{isTestSubmitted ? ` (${mcqPercentage}%)` : quizData?.latest_attempt ? ` (${quizData.latest_attempt.percentage}%)` : ""}</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-3 w-3 text-red-700" />
                                      <span>Failed{isTestSubmitted ? ` (${mcqPercentage}%)` : quizData?.latest_attempt ? ` (${quizData.latest_attempt.percentage}%)` : ""}</span>
                                    </>
                                  )}
                                </span>
                              )}
                            </div>

                            <h2 className="text-xl font-bold text-primary-text">
                              {topic.title || "Topic Assessment"}
                            </h2>
                            <p className="text-xs text-secondary-text leading-relaxed max-w-2xl">
                              {topic.short_description ||
                                "Test your understanding under timed interview conditions. Achieving the passing threshold automatically marks this topic as completed."}
                            </p>
                          </div>

                          <button
                            type="button"
                            id="start-assessment-button"
                            onClick={() => {
                              setIsAssessmentStarted(true);
                              setQuizMode("timed");
                              setActiveQuestionIndex(0);
                              if (!isTestSubmitted) {
                                if (timeLeft === 0) setTimeLeft(defaultTestSeconds);
                              } else {
                                setSelectedAnswers({});
                                setTimeLeft(defaultTestSeconds);
                                setIsTestSubmitted(false);
                              }
                              setIsTimerRunning(true);
                            }}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-subtle hover:shadow-hover cursor-pointer shrink-0"
                          >
                            <Zap className="h-4 w-4" />
                            <span>
                              {isTestSubmitted || quizData?.latest_attempt || isCompleted ? "Retake Assessment" : "Start Assessment"}
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* 1. Header Banner & Mode Controls */}
                        <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-border-subtle">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                              <Zap className="h-3.5 w-3.5" />
                              <span>{isCoreCS ? "Timed Evaluation Test" : "Practical Evaluation Assessment"}</span>
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              {isCoreCS ? "Moderate to Hard (Placement & Competitive Exam Standard)" : "Practical & Architecture Assessment Standard"}
                            </span>
                            <span className="text-xs text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle">
                              {mcqTotal} Questions • {defaultTestMinutes} Mins
                            </span>
                          </div>

                          <h2 className="text-xl sm:text-2xl font-extrabold text-primary-text">
                            {topic.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-secondary-text max-w-2xl leading-relaxed">
                            {isCoreCS
                              ? "Placement & Competitive Exam evaluation covering theoretical concepts, numerical shortcuts, and analytical problem solving."
                              : "Comprehensive practical evaluation covering syntax, architecture, implementation patterns, and industry best practices."}
                          </p>

                          {/* Breakdown Badges */}
                          {isCoreCS && !isAptitude && (
                            <div className="flex items-center gap-2 pt-1 flex-wrap">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                                📘 {theoryTotal || Math.ceil(mcqTotal * 0.5)} Theory & Concepts
                              </span>
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                                🔢 {numericalTotal || Math.floor(mcqTotal * 0.3)} Numerical & Calculations
                              </span>
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ⚙️ {scenarioTotal || Math.floor(mcqTotal * 0.2)} Applications & Shortcuts
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Timer & Mode Controls */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
                          {/* Live Countdown Display */}
                          <div
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border font-mono font-bold text-base tracking-wider shadow-subtle ${isTimerRunning
                                ? timeLeft <= 300
                                  ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                                  : "bg-indigo-50/70 text-indigo-700 border-indigo-200"
                                : "bg-surface text-secondary-text border-border-subtle"
                              }`}
                          >
                            <Clock
                              className={`h-4 w-4 ${isTimerRunning
                                  ? timeLeft <= 300
                                    ? "text-red-600 animate-spin"
                                    : "text-indigo-600"
                                  : "text-secondary-text"
                                }`}
                            />
                            <span>{formatTime(timeLeft)}</span>
                          </div>

                          {/* Mode Actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {quizMode === "timed" && !isTestSubmitted ? (
                              <button
                                type="button"
                                onClick={handleMcqAssessmentSubmit}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-subtle cursor-pointer"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Submit Assessment</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setQuizMode("timed");
                                  setActiveQuestionIndex(0);
                                  if (!isTestSubmitted) {
                                    if (timeLeft === 0) setTimeLeft(defaultTestSeconds);
                                  } else {
                                    setSelectedAnswers({});
                                    setTimeLeft(defaultTestSeconds);
                                    setIsTestSubmitted(false);
                                  }
                                  setIsTimerRunning(true);
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-subtle cursor-pointer"
                              >
                                <Zap className="h-3.5 w-3.5" />
                                <span>{isTestSubmitted ? "Retake Timed Test" : "Start Timed Test"}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                if (quizMode === "timed") {
                                  setQuizMode("browse");
                                  setIsTimerRunning(false);
                                } else {
                                  setQuizMode("timed");
                                  if (!isTestSubmitted) {
                                    if (timeLeft === 0) setTimeLeft(defaultTestSeconds);
                                    setIsTimerRunning(true);
                                  }
                                }
                              }}
                              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${quizMode === "browse"
                                  ? "bg-purple-100 text-purple-900 border-purple-300"
                                  : "bg-surface border-border-subtle text-primary-text hover:bg-background"
                                }`}
                            >
                              {quizMode === "browse" ? "✓ Browse Mode Active" : "Practice / Browse Mode"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Status Bar */}
                      <div className="flex items-center justify-between text-xs text-secondary-text flex-wrap gap-2 pt-1">
                        <span className="font-medium">
                          Answered: <strong className="text-primary-text">{answeredCount}</strong> / {mcqTotal}
                        </span>
                        {isTimerRunning && (
                          <span className="text-amber-600 font-semibold flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Timed Assessment In Progress — Auto-submits when countdown expires.
                          </span>
                        )}
                        {!isTimerRunning && !isTestSubmitted && (
                          <span className="text-purple-600 font-semibold">
                            💡 Self-Paced Browse Mode — Review questions freely or click "Start Timed Test" for timed exam conditions.
                          </span>
                        )}
                        {isTestSubmitted && (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Assessment Submitted — Detailed Scorecard & Answers available below.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. DEDICATED TIMED ASSESSMENT MODE (Single Question Aptitude Runner) */}
                    {quizMode === "timed" && !isTestSubmitted && (
                      <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-6 animate-fade-in">
                        {/* Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-subtle">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                                <Zap className="h-3 w-3" />
                                <span>Timed Assessment</span>
                              </span>
                              <span className="text-xs text-secondary-text font-medium">
                                Passing Score: 70%
                              </span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-extrabold text-primary-text">
                              {topic.title}
                            </h2>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-xs text-secondary-text font-medium hidden sm:inline">
                              Answered: <strong className="text-primary-text">{answeredCount}</strong> / {mcqTotal}
                            </span>
                            <div
                              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-sm tracking-wider shadow-subtle ${timeLeft <= 300
                                  ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                                  : "bg-surface text-primary-text border-border-subtle"
                                }`}
                            >
                              <Clock className={`h-4 w-4 ${timeLeft <= 300 ? "text-red-600 animate-spin" : "text-brand-600"}`} />
                              <span>{formatTime(timeLeft)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Question Navigator Pill Grid */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-secondary-text">
                            <span className="font-semibold text-primary-text">Question Navigator</span>
                            <span>
                              Answered: {answeredCount} / {mcqTotal}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            {mcqQuestions.map((q, idx) => {
                              const qKey = q.id || idx;
                              const isAnswered =
                                selectedAnswers[qKey] !== undefined &&
                                selectedAnswers[qKey] !== null &&
                                selectedAnswers[qKey] !== "";
                              const isActive = activeQuestionIndex === idx;

                              return (
                                <button
                                  key={qKey}
                                  type="button"
                                  onClick={() => setActiveQuestionIndex(idx)}
                                  className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${isActive
                                      ? "bg-indigo-600 text-white font-semibold shadow-sm ring-2 ring-indigo-400 ring-offset-2"
                                      : isAnswered
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-medium"
                                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                  {idx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Active Question Card */}
                        {currentQuestion && (() => {
                          const currentQKey = currentQuestion.id || activeQuestionIndex;
                          const currentAns = selectedAnswers[currentQKey];

                          return (
                            <div className="space-y-5 pt-2">
                              {/* Header */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                    QUESTION {activeQuestionIndex + 1} OF {mcqTotal}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {currentQuestion.category && (
                                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${currentQuestion.category.toLowerCase().includes("theory")
                                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                                          : currentQuestion.category.toLowerCase().includes("numerical") || currentQuestion.category.toLowerCase().includes("memory")
                                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        }`}>
                                        {currentQuestion.category}
                                      </span>
                                    )}
                                    {currentQuestion.difficulty && (
                                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${currentQuestion.difficulty === "Easy"
                                          ? "bg-emerald-100 text-emerald-800"
                                          : currentQuestion.difficulty === "Moderate" || currentQuestion.difficulty === "Medium"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-red-100 text-red-800"
                                        }`}>
                                        {currentQuestion.difficulty}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Question Text */}
                                <div className="pt-2">
                                  <RenderMcqQuestionText text={currentQuestion.question || currentQuestion.title} />
                                </div>
                              </div>

                              {/* Options List */}
                              <div className="space-y-3 pt-2">
                                {(currentQuestion.options || []).map((opt, optIdx) => {
                                  const optLetter = getOptionLetter(opt, optIdx);
                                  const optText = getOptionText(opt);
                                  const isSelected =
                                    currentAns === optLetter ||
                                    currentAns === optIdx ||
                                    currentAns === String(optIdx);

                                  return (
                                    <label
                                      key={optIdx}
                                      onClick={() => {
                                        setSelectedAnswers((prev) => ({
                                          ...prev,
                                          [currentQKey]: optLetter,
                                        }));
                                      }}
                                      className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer select-none ${isSelected
                                          ? "border-indigo-600 bg-indigo-50/50 text-slate-900 shadow-sm ring-1 ring-indigo-500"
                                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                                        }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${currentQKey}`}
                                        id={`question-${currentQKey}-opt-${optIdx}`}
                                        checked={Boolean(isSelected)}
                                        onChange={() => {
                                          setSelectedAnswers((prev) => ({
                                            ...prev,
                                            [currentQKey]: optLetter,
                                          }));
                                        }}
                                        className="sr-only"
                                      />
                                      <div
                                        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSelected
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "bg-slate-100 border border-slate-200 text-slate-600"
                                          }`}
                                      >
                                        {optLetter}
                                      </div>
                                      <span className="text-xs sm:text-sm font-medium leading-relaxed">
                                        {typeof optText === "object" && optText !== null
                                          ? optText.text || optText.label || optText.title || JSON.stringify(optText)
                                          : String(optText)}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>

                              {/* Bottom Navigation Controls */}
                              <div className="flex items-center justify-between gap-4 pt-5 border-t border-border-subtle">
                                <button
                                  type="button"
                                  disabled={activeQuestionIndex === 0}
                                  onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
                                  className="px-4 py-2.5 rounded-xl border border-border-subtle bg-surface text-xs font-bold text-primary-text hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                  Previous
                                </button>

                                <div className="flex items-center gap-3">
                                  {activeQuestionIndex < mcqTotal - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setActiveQuestionIndex((prev) => Math.min(mcqTotal - 1, prev + 1))}
                                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-subtle cursor-pointer"
                                    >
                                      <span>Next →</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={handleMcqAssessmentSubmit}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-subtle cursor-pointer"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Submit Assessment</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* 3. PRACTICE / BROWSE MODE (Full-List View or Submitted Review) */}
                    {(quizMode === "browse" || isTestSubmitted) && (
                      <div className="space-y-6">
                        {/* Scorecard (When Submitted) */}
                        {isTestSubmitted && (
                          <div className={`p-6 sm:p-8 rounded-3xl border shadow-card space-y-5 animate-fade-in ${isTestPassed
                              ? "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-surface border-emerald-300"
                              : "bg-gradient-to-br from-amber-500/10 via-red-500/5 to-surface border-amber-300"
                            }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${isTestPassed
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      : "bg-amber-100 text-amber-900 border border-amber-300"
                                    }`}>
                                    {isTestPassed ? (
                                      <Trophy className="h-3.5 w-3.5 text-emerald-700" />
                                    ) : (
                                      <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                                    )}
                                    <span>
                                      {isTestPassed ? "Evaluation Test Passed & Mastered" : "Test Needs Improvement"}
                                    </span>
                                  </span>
                                  <span className="text-xs text-secondary-text font-medium">
                                    Passing Standard: 70%
                                  </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-text">
                                  Score: {mcqCorrect} / {mcqTotal} ({mcqPercentage}%)
                                </h2>
                                <p className="text-xs sm:text-sm text-secondary-text max-w-2xl">
                                  {isTestPassed
                                    ? "🎉 Outstanding performance! You demonstrated mastery across core concepts, analytical problem solving, and production architectures."
                                    : "You did not reach the 70% passing threshold. Review each question's detailed technical explanation below to solidify your understanding and retake the test."}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex sm:flex-col gap-2.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedAnswers({});
                                    setTimeLeft(defaultTestSeconds);
                                    setIsTestSubmitted(false);
                                    setQuizMode("timed");
                                    setActiveQuestionIndex(0);
                                    setIsTimerRunning(true);
                                  }}
                                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-subtle cursor-pointer"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  <span>Retake Assessment</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuizMode("browse");
                                    const firstCard = document.getElementById("q-card-0");
                                    if (firstCard) firstCard.scrollIntoView({ behavior: "smooth" });
                                  }}
                                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border-subtle hover:bg-background text-xs font-bold text-primary-text transition-all cursor-pointer"
                                >
                                  <span>Review All Questions</span>
                                </button>
                              </div>
                            </div>

                            {/* Section-Wise Scorecard Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                              <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle text-center">
                                <div className="text-[10px] text-secondary-text uppercase font-semibold">Total Score</div>
                                <div className="text-lg font-extrabold text-primary-text mt-0.5">{mcqCorrect} / {mcqTotal}</div>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-surface border border-emerald-200 text-center">
                                <div className="text-[10px] text-emerald-700 uppercase font-semibold">Correct</div>
                                <div className="text-lg font-extrabold text-emerald-600 mt-0.5">{mcqCorrect}</div>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-surface border border-red-200 text-center">
                                <div className="text-[10px] text-red-700 uppercase font-semibold">Incorrect</div>
                                <div className="text-lg font-extrabold text-red-600 mt-0.5">{mcqIncorrect}</div>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-surface border border-border-subtle text-center">
                                <div className="text-[10px] text-secondary-text uppercase font-semibold">Unattempted</div>
                                <div className="text-lg font-extrabold text-secondary-text mt-0.5">{mcqUnattempted}</div>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-surface border border-blue-200 text-center">
                                <div className="text-[10px] text-blue-700 uppercase font-semibold">Theory (25 Qs)</div>
                                <div className="text-lg font-extrabold text-blue-600 mt-0.5">{theoryCorrect} / {theoryTotal}</div>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-surface border border-purple-200 text-center">
                                <div className="text-[10px] text-purple-700 uppercase font-semibold">Numerical (15 Qs)</div>
                                <div className="text-lg font-extrabold text-purple-600 mt-0.5">{numericalCorrect} / {numericalTotal}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Full Vertical List of Questions */}
                        <div className="space-y-5">
                          {mcqQuestions.map((q, idx) => {
                            const qKey = q.id || idx;
                            const userAns = selectedAnswers[qKey];
                            const isExplanationRevealed = isTestSubmitted || Boolean(mcqRevealedExplanations[qKey]);
                            const correctAns = getCorrectAnswerLetter(q);
                            const isUserCorrect =
                              userAns === correctAns ||
                              (typeof userAns === "number" &&
                                (["A", "B", "C", "D"][userAns] === correctAns || userAns === q.correct_index));

                            return (
                              <div
                                key={qKey}
                                id={`q-card-${idx}`}
                                className={`p-6 sm:p-7 rounded-3xl border transition-all space-y-4 shadow-card ${isTestSubmitted
                                    ? isUserCorrect
                                      ? "bg-emerald-50/20 border-emerald-200"
                                      : userAns !== undefined && userAns !== null && userAns !== ""
                                        ? "bg-red-50/20 border-red-200"
                                        : "bg-surface border-border-subtle"
                                    : "bg-surface border-border-subtle"
                                  }`}
                              >
                                {/* Question Header */}
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-extrabold text-primary-text px-2.5 py-1 rounded-xl bg-background border border-border-subtle">
                                      Q{idx + 1}
                                    </span>
                                    {q.category && (
                                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${(q.category || "").toLowerCase().includes("theory")
                                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                                          : (q.category || "").toLowerCase().includes("numerical") || (q.category || "").toLowerCase().includes("memory")
                                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        }`}>
                                        {q.category}
                                      </span>
                                    )}
                                    {q.difficulty && (
                                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${q.difficulty === "Easy"
                                          ? "bg-emerald-100 text-emerald-800"
                                          : q.difficulty === "Moderate" || q.difficulty === "Medium"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-red-100 text-red-800"
                                        }`}>
                                        {q.difficulty}
                                      </span>
                                    )}
                                    {isTestSubmitted && (
                                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${isUserCorrect
                                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                          : userAns !== undefined && userAns !== null && userAns !== ""
                                            ? "bg-red-100 text-red-800 border border-red-300"
                                            : "bg-slate-100 text-slate-700 border border-slate-300"
                                        }`}>
                                        {isUserCorrect ? (
                                          <>
                                            <CheckCircle2 className="h-3 w-3" /> Correct
                                          </>
                                        ) : userAns !== undefined && userAns !== null && userAns !== "" ? (
                                          <>
                                            <XCircle className="h-3 w-3" /> Incorrect
                                          </>
                                        ) : (
                                          <span>Unattempted</span>
                                        )}
                                      </span>
                                    )}
                                  </div>

                                  {/* Browse Mode Explanation Toggle */}
                                  {!isTestSubmitted && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMcqRevealedExplanations((prev) => ({
                                          ...prev,
                                          [qKey]: !prev[qKey],
                                        }));
                                      }}
                                      className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                                    >
                                      <Sparkles className="h-3.5 w-3.5" />
                                      <span>{isExplanationRevealed ? "Hide Explanation" : "Show Answer / Explanation"}</span>
                                    </button>
                                  )}
                                </div>

                                {/* Question Text */}
                                <div className="pt-1">
                                  <RenderMcqQuestionText text={q.question || q.title} />
                                </div>

                                {/* 4 Clickable Option Buttons */}
                                <div className="space-y-2.5 pt-2">
                                  {(q.options || []).map((opt, optIdx) => {
                                    const optLetter = getOptionLetter(opt, optIdx);
                                    const optText = getOptionText(opt);
                                    const isSelected =
                                      userAns === optLetter ||
                                      userAns === optIdx ||
                                      userAns === String(optIdx);
                                    const correctAns = getCorrectAnswerLetter(q);
                                    const isCorrect = (typeof opt === "object" && opt !== null && opt.isCorrect !== undefined)
                                      ? Boolean(opt.isCorrect)
                                      : optLetter === correctAns || optIdx === q.correct_index;

                                    let optClass = "bg-background/60 border-border-subtle hover:border-brand-200 hover:bg-background";
                                    let badge = null;

                                    if (isExplanationRevealed) {
                                      if (isCorrect) {
                                        optClass = "bg-emerald-500/10 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-400";
                                        badge = (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 flex items-center gap-1 shrink-0">
                                            <Check className="h-3 w-3" /> Correct Answer
                                          </span>
                                        );
                                      } else if (isSelected && !isCorrect) {
                                        optClass = "bg-red-500/10 border-red-500 text-red-950 font-semibold ring-1 ring-red-400";
                                        badge = (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-900 flex items-center gap-1 shrink-0">
                                            <XCircle className="h-3 w-3" /> Your Selection
                                          </span>
                                        );
                                      } else {
                                        optClass = "bg-background/40 border-border-subtle/80 text-secondary-text opacity-70";
                                      }
                                    } else if (isSelected) {
                                      optClass = "bg-brand-500/10 border-brand-500 ring-1 ring-brand-400 font-semibold";
                                    }

                                    return (
                                      <label
                                        key={optIdx}
                                        onClick={() => {
                                          if (isTestSubmitted) return;
                                          setSelectedAnswers((prev) => ({
                                            ...prev,
                                            [qKey]: optLetter,
                                          }));
                                          if (quizMode === "browse") {
                                            setMcqRevealedExplanations((prev) => ({
                                              ...prev,
                                              [qKey]: true,
                                            }));
                                          }
                                        }}
                                        className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer select-none transition-all ${optClass}`}
                                      >
                                        <input
                                          type="radio"
                                          name={`question-${qKey}`}
                                          id={`question-${qKey}-opt-${optIdx}`}
                                          checked={Boolean(isSelected)}
                                          onChange={() => {
                                            if (isTestSubmitted) return;
                                            setSelectedAnswers((prev) => ({
                                              ...prev,
                                              [qKey]: optLetter,
                                            }));
                                            if (quizMode === "browse") {
                                              setMcqRevealedExplanations((prev) => ({
                                                ...prev,
                                                [qKey]: true,
                                              }));
                                            }
                                          }}
                                          className="sr-only"
                                        />
                                        <div className="flex items-center gap-3 min-w-0">
                                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSelected
                                              ? "bg-brand-600 text-white"
                                              : isExplanationRevealed && isCorrect
                                                ? "bg-emerald-600 text-white"
                                                : "bg-surface border border-border-subtle text-secondary-text"
                                            }`}>
                                            {optLetter}
                                          </div>
                                          <span className="leading-relaxed">
                                            {typeof optText === "object" && optText !== null
                                              ? optText.text || optText.label || optText.title || JSON.stringify(optText)
                                              : String(optText)}
                                          </span>
                                        </div>
                                        {badge}
                                      </label>
                                    );
                                  })}
                                </div>

                                {/* Technical Explanation Box */}
                                {isExplanationRevealed && q.explanation && (
                                  <div className="mt-4 p-4 rounded-2xl bg-surface border border-emerald-200/80 text-xs sm:text-sm text-secondary-text leading-relaxed shadow-sm">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1.5">
                                      <Sparkles className="h-3.5 w-3.5" />
                                      <span>Option {getCorrectAnswerLetter(q) || q.correctAnswer} — Technical Analysis & Concept Reference:</span>
                                    </div>
                                    <p className="text-primary-text leading-relaxed">{q.explanation}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })() : (
                <>
                  {/* ────────────────────────────────────────────────────────── */}
                  {/* VIEW 1: ACTIVE QUIZ RUNNER                                 */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {quizMode === "active" && quizData?.quiz && (
                    <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-6 animate-fade-in">
                      {/* Top Bar: Title & Live Countdown Timer */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-subtle">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                              <Zap className="h-3 w-3" />
                              <span>Timed Assessment</span>
                            </span>
                            <span className="text-xs text-secondary-text font-medium">
                              Passing Score: {quizData.quiz.passing_percentage}%
                            </span>
                          </div>
                          <h2 className="text-lg sm:text-xl font-extrabold text-primary-text">
                            {quizData.quiz.title}
                          </h2>
                        </div>

                        {/* Live Countdown Timer */}
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-sm tracking-wider shadow-subtle shrink-0 ${timeRemaining <= 60
                            ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                            : "bg-surface text-primary-text border-border-subtle"
                            }`}
                        >
                          <Clock
                            className={`h-4 w-4 ${timeRemaining <= 60 ? "text-red-600 animate-spin" : "text-brand-600"
                              }`}
                          />
                          <span>{formatTime(timeRemaining)}</span>
                        </div>
                      </div>

                      {/* Question Navigator Pills */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-secondary-text">
                          <span className="font-semibold">Question Navigator</span>
                          <span>
                            Answered: {Object.keys(selectedAnswers).length} / {quizData.questions.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {quizData.questions.map((q, idx) => {
                            const qId = q.id || idx;
                            const isAnswered = selectedAnswers[qId] !== undefined;
                            const isActive = activeQuestionIdx === idx;
                            return (
                              <button
                                key={qId}
                                type="button"
                                onClick={() => setActiveQuestionIdx(idx)}
                                className={`h-9 w-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${isActive
                                  ? "bg-brand-600 text-white shadow-subtle ring-2 ring-brand-400 ring-offset-2"
                                  : isAnswered
                                    ? "bg-brand-100 text-brand-800 border border-brand-300"
                                    : "bg-background text-secondary-text border border-border-subtle hover:border-brand-300"
                                  }`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Current Question View */}
                      {quizData.questions[activeQuestionIdx] && (() => {
                        const currentQ = quizData.questions[activeQuestionIdx];
                        const currentQId = currentQ.id || activeQuestionIdx;
                        const selectedOption = selectedAnswers[currentQId];
                        const optionLetters = ["A", "B", "C", "D"];

                        return (
                          <div className="space-y-6 pt-2">
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                                Question {activeQuestionIdx + 1} of {quizData.questions.length}
                              </span>
                              <h3 className="text-base sm:text-lg font-bold text-primary-text leading-snug">
                                {currentQ.question_text}
                              </h3>
                            </div>

                            {/* Options List */}
                            <div className="space-y-3">
                              {currentQ.options.map((optText, optIdx) => {
                                const isSelected = selectedOption === optIdx;

                                return (
                                  <label
                                    key={optIdx}
                                    onClick={() => handleSelectOption(currentQId, optIdx)}
                                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer select-none ${isSelected
                                      ? "bg-brand-50/70 border-brand-400 ring-1 ring-brand-300 shadow-subtle"
                                      : "bg-background/60 border-border-subtle hover:border-brand-200 hover:bg-background"
                                      }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${currentQId}`}
                                      id={`quiz-question-${currentQId}-opt-${optIdx}`}
                                      checked={Boolean(isSelected)}
                                      onChange={() => handleSelectOption(currentQId, optIdx)}
                                      className="sr-only"
                                    />
                                    <div
                                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSelected
                                        ? "bg-brand-600 text-white"
                                        : "bg-surface border border-border-subtle text-secondary-text"
                                        }`}
                                    >
                                      {optionLetters[optIdx]}
                                    </div>
                                    <span
                                      className={`text-xs sm:text-sm font-medium ${isSelected
                                        ? "text-primary-text font-semibold"
                                        : "text-secondary-text"
                                        }`}
                                    >
                                      {typeof optText === "object" && optText !== null
                                        ? optText.text || optText.label || optText.title || JSON.stringify(optText)
                                        : String(optText)}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>

                            {quizError && (
                              <div className="p-3 bg-red-50 text-danger border border-red-200 rounded-xl text-xs flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{quizError}</span>
                              </div>
                            )}

                            {/* Bottom Actions */}
                            <div className="flex items-center justify-between gap-4 pt-4 border-t border-border-subtle">
                              <button
                                type="button"
                                disabled={activeQuestionIdx === 0}
                                onClick={() =>
                                  setActiveQuestionIdx((prev) => Math.max(0, prev - 1))
                                }
                                className="px-4 py-2.5 rounded-xl border border-border-subtle bg-surface text-xs font-bold text-primary-text hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                              >
                                Previous
                              </button>

                              <div className="flex items-center gap-3">
                                {activeQuestionIdx < quizData.questions.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveQuestionIdx((prev) =>
                                        Math.min(quizData.questions.length - 1, prev + 1)
                                      )
                                    }
                                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-subtle cursor-pointer"
                                  >
                                    <span>Next</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  id="submit-quiz-button"
                                  disabled={submittingQuiz}
                                  onClick={() => handleSubmitQuiz(selectedAnswers)}
                                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-subtle cursor-pointer disabled:opacity-60"
                                >
                                  {submittingQuiz ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      <span>Evaluating...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="h-4 w-4" />
                                      <span>Submit Assessment</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* VIEW 2: SCORECARD & REVIEW (POST-SUBMISSION)               */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {quizMode === "review" && quizResult && (
                    <div className="space-y-6 animate-fade-in">
                      {/* Scorecard Hero Banner */}
                      <div
                        className={`p-6 sm:p-8 rounded-3xl border shadow-card space-y-4 ${quizResult.passed
                          ? "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-surface border-emerald-300"
                          : "bg-gradient-to-br from-amber-500/10 via-red-500/5 to-surface border-amber-300"
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${quizResult.passed
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-amber-100 text-amber-900 border border-amber-300"
                                  }`}
                              >
                                {quizResult.passed ? (
                                  <Trophy className="h-3.5 w-3.5 text-emerald-700" />
                                ) : (
                                  <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                                )}
                                <span>
                                  {quizResult.passed
                                    ? "Assessment Passed"
                                    : "Assessment Needs Improvement"}
                                </span>
                              </span>
                              <span className="text-xs text-secondary-text">
                                Pass Threshold: {quizData?.quiz?.passing_percentage || 70}%
                              </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-text">
                              Score: {quizResult.score} / {quizResult.total_questions} ({quizResult.percentage}%)
                            </h2>

                            <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-2xl text-secondary-text">
                              {quizResult.passed
                                ? `🎉 Congratulations! Assessment Passed (${quizResult.percentage}%). Topic marked as completed.`
                                : `Score: ${quizResult.percentage}%. You need at least ${quizData?.quiz?.passing_percentage || 70
                                }% to mark this topic as completed. Review your answers below and try again.`}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex sm:flex-col gap-2.5 shrink-0">
                            <button
                              type="button"
                              id="retake-quiz-button"
                              onClick={handleStartQuiz}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-subtle cursor-pointer"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>Retake Assessment</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuizMode("overview")}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border-subtle hover:bg-background text-xs font-bold text-primary-text transition-all cursor-pointer"
                            >
                              <span>Topic Overview</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Question Review */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-primary-text uppercase tracking-wider">
                            Detailed Question-by-Question Review
                          </h3>
                          <span className="text-xs text-secondary-text font-medium">
                            {quizResult.review?.filter((r) => r.is_correct).length} of{" "}
                            {quizResult.total_questions} Correct
                          </span>
                        </div>

                        <div className="space-y-4">
                          {quizResult.review?.map((rev, qIdx) => {
                            const isExplanationOpen = expandedExplanations[qIdx] !== false;
                            const optionLetters = ["A", "B", "C", "D"];

                            return (
                              <div
                                key={rev.id || qIdx}
                                className={`bg-surface rounded-2xl border p-5 sm:p-6 space-y-4 shadow-subtle ${rev.is_correct ? "border-emerald-200" : "border-red-200"
                                  }`}
                              >
                                {/* Question Header */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-secondary-text">
                                        Q{qIdx + 1}.
                                      </span>
                                      <span
                                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${rev.is_correct
                                          ? "bg-emerald-100 text-emerald-800"
                                          : "bg-red-100 text-red-800"
                                          }`}
                                      >
                                        {rev.is_correct ? (
                                          <>
                                            <CheckCircle2 className="h-3 w-3" />
                                            <span>Correct</span>
                                          </>
                                        ) : (
                                          <>
                                            <XCircle className="h-3 w-3" />
                                            <span>Incorrect</span>
                                          </>
                                        )}
                                      </span>
                                    </div>
                                    <h4 className="text-sm sm:text-base font-bold text-primary-text">
                                      {rev.question_text}
                                    </h4>
                                  </div>
                                </div>

                                {/* Options Breakdown */}
                                <div className="space-y-2">
                                  {rev.options.map((opt, optIdx) => {
                                    const isCorrectAnswer = optIdx === rev.correct_option_index;
                                    const isUserSelection = optIdx === rev.user_answer;

                                    let optClass =
                                      "bg-background/40 border-border-subtle/80 text-secondary-text";
                                    let badge = null;

                                    if (isCorrectAnswer) {
                                      optClass =
                                        "bg-emerald-50 border-emerald-300 text-emerald-950 font-medium";
                                      badge = (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 flex items-center gap-1">
                                          <Check className="h-3 w-3" />
                                          Correct Answer
                                        </span>
                                      );
                                    } else if (isUserSelection && !rev.is_correct) {
                                      optClass =
                                        "bg-red-50 border-red-300 text-red-950 font-medium";
                                      badge = (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-200 text-red-900 flex items-center gap-1">
                                          <XCircle className="h-3 w-3" />
                                          Your Answer
                                        </span>
                                      );
                                    }

                                    return (
                                      <div
                                        key={optIdx}
                                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${optClass}`}
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <span className="font-bold text-xs shrink-0">
                                            {optionLetters[optIdx]}.
                                          </span>
                                          <span>
                                            {typeof opt === "object" && opt !== null
                                              ? opt.text || opt.label || opt.title || JSON.stringify(opt)
                                              : String(opt)}
                                          </span>
                                        </div>
                                        {badge}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Collapsible Explanation Box */}
                                <div className="pt-2 border-t border-border-subtle/60">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedExplanations((prev) => ({
                                        ...prev,
                                        [qIdx]: !isExplanationOpen,
                                      }))
                                    }
                                    className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                                  >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>
                                      {isExplanationOpen
                                        ? "Hide Explanation"
                                        : "View Explanation"}
                                    </span>
                                    {isExplanationOpen ? (
                                      <ChevronUp className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    )}
                                  </button>

                                  {isExplanationOpen && (
                                    <div className="mt-2.5 p-3.5 rounded-xl bg-background border border-border-subtle text-xs text-secondary-text leading-relaxed animate-fade-in">
                                      <p className="font-semibold text-primary-text mb-1">
                                        Technical Explanation & Concept Reference:
                                      </p>
                                      <p>{rev.explanation}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ────────────────────────────────────────────────────────── */}
                  {/* VIEW 3: OVERVIEW MODE (TOPIC ASSESSMENT CARD)             */}
                  {/* ────────────────────────────────────────────────────────── */}
                  {quizMode === "overview" && quizData?.hasQuiz && (
                    <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                              <Award className="h-3.5 w-3.5" />
                              <span>Formal Assessment Gateway</span>
                            </span>

                            <span className="text-xs text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle flex items-center gap-1">
                              <Clock className="h-3 w-3 text-brand-600" />
                              ⏱ {quizData.quiz?.time_limit_minutes || 5} Mins
                            </span>

                            <span className="text-xs text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle flex items-center gap-1">
                              <Target className="h-3 w-3 text-emerald-600" />
                              🎯 {quizData.quiz?.passing_percentage || 70}% to Pass
                            </span>

                            <span className="text-xs text-secondary-text bg-background px-2.5 py-0.5 rounded-full border border-border-subtle">
                              {quizData.questions?.length || 5} Questions
                            </span>

                            {/* Previous Attempt Badge */}
                            {quizData.latest_attempt && (
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${quizData.latest_attempt.passed
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-red-100 text-red-800 border border-red-300"
                                  }`}
                              >
                                {quizData.latest_attempt.passed ? (
                                  <>
                                    <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                                    <span>Passed ({quizData.latest_attempt.percentage}%)</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 text-red-700" />
                                    <span>Failed ({quizData.latest_attempt.percentage}%)</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          <h2 className="text-xl font-bold text-primary-text">
                            {quizData.quiz?.title || "Topic Assessment"}
                          </h2>
                          <p className="text-xs text-secondary-text leading-relaxed max-w-2xl">
                            {quizData.quiz?.description ||
                              "Test your understanding under timed interview conditions. Achieving the passing threshold automatically marks this topic as completed."}
                          </p>
                        </div>

                        <button
                          type="button"
                          id="start-assessment-button"
                          onClick={handleStartQuiz}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-subtle hover:shadow-hover cursor-pointer shrink-0"
                        >
                          <Zap className="h-4 w-4" />
                          <span>
                            {quizData.latest_attempt ? "Retake Assessment" : "Start Assessment"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Pillar Evaluation Interface (Only in overview mode) */}
                  {quizMode === "overview" && (
                    <>
                      {isInterviewQATopic ? (
                        /* Technical Interview Q&A Evaluation */
                        <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
                                <HelpCircle className="h-3.5 w-3.5" />
                                <span>Technical Interview Q&A Round</span>
                              </div>
                              <h2 className="text-xl font-bold text-primary-text">
                                High-Frequency Interview Questions & Solutions
                              </h2>
                              <p className="text-xs text-secondary-text mt-1 max-w-xl">
                                Master these core architectural and conceptual questions frequently asked in placement interviews. Review the detailed solutions and check off items as you master them.
                              </p>
                            </div>
                            {topic.practice_items?.length > 0 && (
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 self-start">
                                {topic.practice_items.filter((prob, idx) => checkedTaskIds.has(`prob_${prob.problemId || prob.id || idx}`)).length} / {topic.practice_items.length} Mastered
                              </span>
                            )}
                          </div>

                          {topic.practice_items?.length > 0 ? (
                            <div className="space-y-4">
                              {topic.practice_items.map((item, pIdx) => {
                                const taskKey = `prob_${item.problemId || item.id || pIdx}`;
                                const isTaskChecked = checkedTaskIds.has(taskKey);
                                const hasUrl = Boolean(
                                  (typeof item.url === "string" && item.url.trim().startsWith("http")) ||
                                  (typeof item.link === "string" && item.link.trim().startsWith("http")) ||
                                  (typeof item.external_url === "string" && item.external_url.trim().startsWith("http"))
                                );
                                const url = item.url || item.link || item.external_url;
                                const answerContent = item.answer || item.description;

                                return (
                                  <div
                                    key={item.id || pIdx}
                                    className={`p-5 rounded-2xl border transition-all space-y-3.5 ${isTaskChecked
                                        ? "bg-emerald-50/40 border-emerald-200"
                                        : "bg-background/60 border-border-subtle hover:border-brand-200"
                                      }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3 min-w-0 flex-1">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleTask(taskKey)}
                                          className="shrink-0 mt-0.5 transition-transform active:scale-90 cursor-pointer"
                                          title={isTaskChecked ? "Mark as uncompleted" : "Mark as mastered"}
                                        >
                                          {isTaskChecked ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                                          ) : (
                                            <Circle className="h-5 w-5 text-secondary-text" />
                                          )}
                                        </button>

                                        <div className="min-w-0 flex-1 space-y-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <h3
                                              className={`text-sm sm:text-base font-bold ${isTaskChecked
                                                  ? "line-through text-emerald-950 opacity-80"
                                                  : "text-primary-text"
                                                }`}
                                            >
                                              {item.title || item.name}
                                            </h3>
                                            {item.difficulty && (
                                              <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.difficulty === "Easy"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : item.difficulty === "Medium"
                                                      ? "bg-amber-100 text-amber-800"
                                                      : "bg-red-100 text-red-800"
                                                  }`}
                                              >
                                                {item.difficulty}
                                              </span>
                                            )}
                                            {item.platform && item.platform !== "Technical Interview QA" && (
                                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                                {item.platform}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {hasUrl && (
                                        <a
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border-subtle hover:bg-background text-xs font-bold text-primary-text transition-all shrink-0 hover:border-brand-300"
                                        >
                                          <span>{item.platform ? `Practice on ${item.platform} ↗` : "Open Link ↗"}</span>
                                          <ExternalLink className="h-3 w-3 text-secondary-text" />
                                        </a>
                                      )}
                                    </div>

                                    {answerContent && (
                                      <div className="pl-8 pt-1">
                                        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border-subtle/80 text-xs sm:text-sm text-secondary-text leading-relaxed">
                                          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-600 mb-2 flex items-center gap-1.5">
                                            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                                            <span>Interview Answer & Technical Explanation</span>
                                          </div>
                                          <SimpleMarkdown content={answerContent} />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-6 rounded-2xl bg-background/60 border border-border-subtle text-center space-y-2">
                              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                              <h3 className="text-sm font-bold text-primary-text">
                                Conceptual Mastery Module
                              </h3>
                              <p className="text-xs text-secondary-text max-w-md mx-auto">
                                Review the architectural notes and syntax reference before proceeding to the next lecture.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : isDatabaseTopic ? (
                        /* Database Evaluation: Curated SQL Problems or Conceptual Notice */
                        <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-6">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
                              <Database className="h-3.5 w-3.5" />
                              <span>Database Practical Evaluation</span>
                            </div>
                            <h2 className="text-xl font-bold text-primary-text">
                              {topic.practice_items?.length > 0
                                ? (topic.slug?.startsWith("mongo-") || topic.track_slug === "mongodb-mastery"
                                  ? "Curated MongoDB Practice Challenge"
                                  : "Curated SQL Problem Solving Challenge")
                                : "Conceptual & Setup Verification"}
                            </h2>
                            <p className="text-xs text-secondary-text mt-1 max-w-xl">
                              {topic.practice_items?.length > 0
                                ? (topic.slug?.startsWith("mongo-") || topic.track_slug === "mongodb-mastery"
                                  ? "Solve the target MongoDB queries on MongoPractice. Verify your edge cases and check off items once completed."
                                  : "Solve the target SQL queries on LeetCode. Verify your edge cases and check off items once completed.")
                                : "Conceptual & Setup Lecture — No coding judge problems required for this topic. Review the architectural notes and syntax reference before proceeding to practical query lectures."}
                            </p>
                          </div>

                          {topic.practice_items?.length > 0 ? (
                            <div className="space-y-3">
                              {topic.practice_items.map((prob, pIdx) => {
                                const taskKey = `prob_${prob.problemId || pIdx}`;
                                const isTaskChecked = checkedTaskIds.has(taskKey);
                                const isGfg = prob.platform === "GeeksforGeeks" || prob.url?.includes("geeksforgeeks.org");

                                return (
                                  <div
                                    key={pIdx}
                                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${isTaskChecked
                                      ? "bg-emerald-50/50 border-emerald-200"
                                      : "bg-background/60 border-border-subtle hover:border-brand-200"
                                      }`}
                                  >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleTask(taskKey)}
                                        className="shrink-0 transition-transform active:scale-90"
                                      >
                                        {isTaskChecked ? (
                                          <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                                        ) : (
                                          <Circle className="h-5 w-5 text-secondary-text" />
                                        )}
                                      </button>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <h4
                                            className={`text-xs sm:text-sm font-bold truncate ${isTaskChecked
                                              ? "line-through text-emerald-900 opacity-80"
                                              : "text-primary-text"
                                              }`}
                                          >
                                            {prob.problemId && !prob.problemId.startsWith("gfg") ? `#${prob.problemId} ` : ""}{prob.title}
                                          </h4>
                                          <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prob.difficulty === "Easy"
                                              ? "bg-emerald-100 text-emerald-800"
                                              : prob.difficulty === "Medium"
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-red-100 text-red-800"
                                              }`}
                                          >
                                            {prob.difficulty || "Easy"}
                                          </span>
                                        </div>
                                        {prob.description && (
                                          <p className="text-[11px] text-secondary-text mt-0.5 line-clamp-1">
                                            {prob.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <a
                                      href={prob.url || prob.link || prob.external_url || (prob.platform === "MongoPractice" || prob.url?.includes("mongopractice.online") ? "https://mongopractice.online" : "https://leetcode.com")}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border-subtle hover:bg-background text-xs font-bold text-primary-text transition-all shrink-0 hover:border-brand-300"
                                    >
                                      <span>
                                        {prob.platform
                                          ? `Solve on ${prob.platform} ↗`
                                          : prob.url?.includes("mongopractice.online")
                                            ? "Solve on MongoPractice ↗"
                                            : isGfg
                                              ? "Solve on GFG ↗"
                                              : "Solve on LeetCode ↗"}
                                      </span>
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-6 rounded-2xl bg-background/60 border border-border-subtle text-center space-y-2">
                              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                              <h3 className="text-sm font-bold text-primary-text">
                                Conceptual Mastery Module
                              </h3>
                              <p className="text-xs text-secondary-text max-w-md mx-auto">
                                Conceptual & Setup Lecture — No coding judge problems required for this topic. Review the architectural notes and syntax reference before proceeding to practical query lectures.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : pillarKey === "dsa" ? (
                        /* DSA Evaluation: Curated LeetCode Problems */
                        <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-6">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
                              <Terminal className="h-3.5 w-3.5" />
                              <span>Coding Interview Practical Round</span>
                            </div>
                            <h2 className="text-xl font-bold text-primary-text">
                              Curated Problem Solving Challenge
                            </h2>
                            <p className="text-xs text-secondary-text mt-1 max-w-xl">
                              Solve the target algorithmic problems on LeetCode. Verify your edge cases and check off items once completed.
                            </p>
                          </div>

                          <div className="space-y-3">
                            {(topic.practice_items?.length > 0
                              ? topic.practice_items
                              : [
                                {
                                  title: `${topic.title} Warmup & Boundary Validation`,
                                  difficulty: "Easy",
                                  url: "https://leetcode.com/problemset/all/",
                                  problemId: "1",
                                },
                                {
                                  title: `${topic.title} Core Interview Pattern`,
                                  difficulty: "Medium",
                                  url: "https://leetcode.com/problemset/all/",
                                  problemId: "2",
                                },
                              ]
                            ).map((prob, pIdx) => {
                              const taskKey = `prob_${prob.problemId || pIdx}`;
                              const isTaskChecked = checkedTaskIds.has(taskKey);

                              return (
                                <div
                                  key={pIdx}
                                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${isTaskChecked
                                    ? "bg-emerald-50/50 border-emerald-200"
                                    : "bg-background/60 border-border-subtle hover:border-brand-200"
                                    }`}
                                >
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleTask(taskKey)}
                                      className="shrink-0 transition-transform active:scale-90"
                                    >
                                      {isTaskChecked ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                                      ) : (
                                        <Circle className="h-5 w-5 text-secondary-text" />
                                      )}
                                    </button>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4
                                          className={`text-xs sm:text-sm font-bold truncate ${isTaskChecked
                                            ? "line-through text-emerald-900 opacity-80"
                                            : "text-primary-text"
                                            }`}
                                        >
                                          {prob.problemId && !prob.problemId.startsWith("gfg") ? `#${prob.problemId} ` : ""}{prob.title}
                                        </h4>
                                        <span
                                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prob.difficulty === "Easy"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : prob.difficulty === "Medium"
                                              ? "bg-amber-100 text-amber-800"
                                              : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                          {prob.difficulty || "Medium"}
                                        </span>
                                      </div>
                                      {prob.description && (
                                        <p className="text-[11px] text-secondary-text mt-0.5 line-clamp-1">
                                          {prob.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <a
                                    href={prob.url || prob.link || prob.external_url || "https://leetcode.com"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border-subtle hover:bg-background text-xs font-bold text-primary-text transition-all shrink-0 hover:border-brand-300"
                                  >
                                    <span>
                                      {prob.platform
                                        ? `Solve on ${prob.platform} ↗`
                                        : prob.url?.includes("geeksforgeeks")
                                          ? "Solve on GFG ↗"
                                          : "Solve on LeetCode ↗"}
                                    </span>
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : pillarKey === "cs" ? (
                        /* CS Fundamentals Evaluation: Flashcards / Screening Questions */
                        <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-6">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                              <Cpu className="h-3.5 w-3.5" />
                              <span>Technical Screening Flashcards</span>
                            </div>
                            <h2 className="text-xl font-bold text-primary-text">
                              Core Interview Q&A Self-Evaluation
                            </h2>
                            <p className="text-xs text-secondary-text mt-1 max-w-xl">
                              Review each key screening question. Test yourself before expanding the answer.
                            </p>
                          </div>

                          <div className="space-y-3">
                            {(topic.practice_items?.length > 0 &&
                            (topic.practice_items[0]?.question || topic.practice_items[0]?.title)
                              ? topic.practice_items
                              : [
                                {
                                  question: `How is "${topic.title}" tested in campus & company placement rounds?`,
                                  answer:
                                    "Interviewers test whether you understand the underlying operating system or runtime mechanism rather than superficial syntax. Be ready to trace execution order and explain resource limits.",
                                  difficulty: "Core Screening",
                                },
                                {
                                  question: "What are the common concurrency and memory pitfalls associated with this concept?",
                                  answer:
                                    "Memory leaks due to lingering event listeners or unclosed streams, thread starvation, and unhandled promise rejections causing process exit in production.",
                                  difficulty: "Classic Interview",
                                },
                                {
                                  question: "How would you optimize this under high-throughput production load?",
                                  answer:
                                    "Implement backpressure handling, utilize clustering or worker threads for CPU spikes, and employ caching layers like Redis to minimize repeat computation.",
                                  difficulty: "Systems Architecture",
                                },
                              ]
                            ).map((qa, qIdx) => {
                              const itemKey = qa.id || qIdx;
                              const isExpanded = expandedQuestionIdx === itemKey;
                              const questionText = qa.question || qa.title;
                              const answerText = qa.answer || qa.description;
                              const difficultyText =
                                qa.difficulty ||
                                (qa.type === "quiz" ? "Technical Screening" : "Core Screening");

                              return (
                                <div
                                  key={itemKey}
                                  className="rounded-2xl border border-border-subtle overflow-hidden bg-background/50 transition-all"
                                >
                                  <div
                                    onClick={() =>
                                      setExpandedQuestionIdx(isExpanded ? null : itemKey)
                                    }
                                    className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-background select-none"
                                  >
                                    <div className="flex items-center gap-3">
                                      <HelpCircle className="h-4 w-4 text-brand-600 shrink-0" />
                                      <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-primary-text">
                                          {questionText}
                                        </h4>
                                        {difficultyText && (
                                          <span className="text-[10px] font-semibold text-secondary-text mt-0.5 inline-block">
                                            {difficultyText}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-xs text-secondary-text font-medium flex items-center gap-1 shrink-0">
                                      {isExpanded ? (
                                        <>
                                          <span>Hide</span>
                                          <ChevronUp className="h-4 w-4" />
                                        </>
                                      ) : (
                                        <>
                                          <span>Show Answer</span>
                                          <ChevronDown className="h-4 w-4" />
                                        </>
                                      )}
                                    </span>
                                  </div>

                                  {isExpanded && (
                                    <div className="px-4 pb-4 pt-1 border-t border-border-subtle/60 text-xs text-secondary-text leading-relaxed bg-surface animate-fade-in">
                                      <p className="font-medium text-primary-text mb-1">
                                        Interview Answer Framework:
                                      </p>
                                      <SimpleMarkdown content={typeof answerText === "string" ? answerText : String(answerText || "")} />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : pillarKey === "apt_sql" ? (
                        /* SQL & Aptitude Evaluation */
                        <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-6">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-2">
                              <Database className="h-3.5 w-3.5" />
                              <span>SQL & Placement Aptitude Challenge</span>
                            </div>
                            <h2 className="text-xl font-bold text-primary-text">
                              Query Scenarios & Quantitative Practice
                            </h2>
                            <p className="text-xs text-secondary-text mt-1 max-w-xl">
                              Solve the target SQL queries and aptitude problems on competitive platforms.
                            </p>
                          </div>

                          <div className="space-y-3">
                            {(topic.practice_items?.length > 0
                              ? topic.practice_items
                              : [
                                {
                                  title: `${topic.title} Core Placement Challenge`,
                                  platform: "Placement Practice",
                                  difficulty: "Medium",
                                  url: "https://leetcode.com/problemset/database/",
                                  description: "Practice core relational queries and analytical calculations.",
                                },
                              ]
                            ).map((item, iIdx) => {
                              const taskKey = `sql_${iIdx}`;
                              const isTaskChecked = checkedTaskIds.has(taskKey);

                              return (
                                <div
                                  key={iIdx}
                                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${isTaskChecked
                                    ? "bg-emerald-50/50 border-emerald-200"
                                    : "bg-background/60 border-border-subtle hover:border-brand-200"
                                    }`}
                                >
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleTask(taskKey)}
                                      className="shrink-0 transition-transform active:scale-90"
                                    >
                                      {isTaskChecked ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                                      ) : (
                                        <Circle className="h-5 w-5 text-secondary-text" />
                                      )}
                                    </button>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4
                                          className={`text-xs sm:text-sm font-bold truncate ${isTaskChecked
                                            ? "line-through text-emerald-900 opacity-80"
                                            : "text-primary-text"
                                            }`}
                                        >
                                          {item.title}
                                        </h4>
                                        {item.platform && (
                                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                            {item.platform}
                                          </span>
                                        )}
                                        {item.difficulty && (
                                          <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.difficulty === "Easy"
                                              ? "bg-emerald-100 text-emerald-800"
                                              : item.difficulty === "Medium"
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-red-100 text-red-800"
                                              }`}
                                          >
                                            {item.difficulty}
                                          </span>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-[11px] text-secondary-text mt-0.5 line-clamp-2">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {item.url && (
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border-subtle hover:bg-background text-xs font-bold text-primary-text transition-all shrink-0 hover:border-brand-300"
                                    >
                                      <span>Solve Challenge ↗</span>
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* Development Evaluation: Assignment Specification & Practical Checklist */
                        <div className="space-y-6">
                          {topic.practice_items?.length > 0 ? (
                            topic.practice_items.map((item, pIdx) => (
                              <div
                                key={pIdx}
                                className="bg-surface rounded-3xl border border-border-subtle shadow-card p-6 sm:p-8 space-y-6"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                  <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
                                      <Target className="h-3.5 w-3.5" />
                                      <span>Practical Engineering Assignment</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-primary-text">
                                      {item.title}
                                    </h2>
                                    <p className="text-xs text-secondary-text mt-1.5 leading-relaxed max-w-2xl">
                                      {item.description}
                                    </p>
                                  </div>

                                  {item.starterCodeUrl && (
                                    <a
                                      href={item.starterCodeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-background border border-border-subtle hover:border-brand-200 text-xs font-bold text-primary-text transition-all shrink-0"
                                    >
                                      <span>Reference Spec</span>
                                      <ExternalLink className="h-3.5 w-3.5 text-secondary-text" />
                                    </a>
                                  )}
                                </div>

                                {/* Assignment Verification Checklist */}
                                {item.checklist?.length > 0 && (
                                  <div className="space-y-3 pt-2">
                                    <h4 className="text-xs font-bold text-primary-text uppercase tracking-wider">
                                      Implementation Milestones:
                                    </h4>

                                    <div className="space-y-2">
                                      {item.checklist.map((step, sIdx) => {
                                        const stepKey = `task_${pIdx}_${sIdx}`;
                                        const isStepChecked = checkedTaskIds.has(stepKey);

                                        return (
                                          <div
                                            key={sIdx}
                                            onClick={() => handleToggleTask(stepKey)}
                                            className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer select-none ${isStepChecked
                                              ? "bg-emerald-50/50 border-emerald-200/80"
                                              : "bg-background/60 border-border-subtle hover:border-brand-200"
                                              }`}
                                          >
                                            <button
                                              type="button"
                                              className="shrink-0 mt-0.5 transition-transform active:scale-90"
                                            >
                                              {isStepChecked ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                                              ) : (
                                                <Circle className="h-4 w-4 text-secondary-text/70" />
                                              )}
                                            </button>
                                            <span
                                              className={`text-xs font-medium ${isStepChecked
                                                ? "text-emerald-950 line-through opacity-80"
                                                : "text-primary-text"
                                                }`}
                                            >
                                              {step}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="bg-surface rounded-3xl border border-border-subtle shadow-card p-8 text-center space-y-4 animate-fade-in">
                              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                                <Sparkles className="h-6 w-6" />
                              </div>
                              <div className="space-y-1.5 max-w-md mx-auto">
                                <h3 className="text-base font-bold text-primary-text">
                                  Self-Paced Comprehensive Masterclass
                                </h3>
                                <p className="text-xs text-secondary-text leading-relaxed">
                                  This is a complete end-to-end masterclass designed for self-directed learning. No mandatory coding assignments or tests are required. Review the lecture modules and mark completed when ready.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Master Confirmation Banner */}
                      <div className="bg-surface rounded-3xl border border-border-subtle p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
                        <div className="space-y-1 text-center sm:text-left">
                          <h3 className="text-sm font-bold text-primary-text">
                            {isCompleted
                              ? "Topic Completed! Ready for next roadmap module."
                              : isLocked
                                ? "Assessment Required: Pass Quiz to Complete"
                                : "Finished practicing this module?"}
                          </h3>
                          <p className="text-xs text-secondary-text">
                            {isLocked
                              ? "You must score at least 70% on the topic assessment before marking this topic as completed."
                              : "Marking this topic as completed synchronizes your progress across your Dashboard and Roadmap."}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={togglingCompletion || isLocked}
                          onClick={handleToggleMasterCompletion}
                          title={isLocked ? "Pass assessment (>=70%) to unlock completion" : undefined}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-subtle shrink-0 ${isLocked
                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-80"
                            : isCompleted
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-hover"
                              : "bg-brand-600 hover:bg-brand-700 text-white cursor-pointer hover:shadow-hover"
                            }`}
                        >
                          {togglingCompletion ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                              <span>Saving...</span>
                            </>
                          ) : isCompleted ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-white" />
                              <span>Marked Complete ✓</span>
                            </>
                          ) : isLocked ? (
                            <>
                              <Lock className="h-4 w-4 text-amber-500" />
                              <span>Pass Quiz to Unlock</span>
                            </>
                          ) : (
                            <>
                              <CheckSquare className="h-4 w-4" />
                              <span>Confirm & Mark Completed</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TopicDetailPage;
