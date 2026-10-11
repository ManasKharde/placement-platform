const pool = require("../config/db");

// Sole Composite Role Definition
const MARKET_ROLES = [
  {
    roleId: "software-engineer",
    roleName: "Software Engineer",
    badge: "CORE ROLE",
    targetLevel: "Comprehensive Full-Stack & Systems Readiness",
    tagline: "Comprehensive Full-Stack & Systems Readiness (Frontend + Backend)",
  },
];

/**
 * Stage label helper based on combined percentage
 * @param {number|string} percentage 
 * @returns {string} Stage description
 */
const getStageLabel = (percentage) => {
  const p = typeof percentage === "string" ? parseFloat(percentage) : percentage;
  if (p >= 80) return "Ready for Technical Screening";
  if (p >= 50) return "Competitive for Placement Screening";
  if (p >= 20) return "Core Skills in Progress";
  return "Orientation Stage";
};

/**
 * Status helper based on combined percentage
 * @param {number|string} percentage 
 * @returns {string} Status title
 */
const getStatus = (percentage) => {
  const p = typeof percentage === "string" ? parseFloat(percentage) : percentage;
  if (p >= 80) return "Interview Ready";
  if (p >= 50) return "Shortlist Competitive";
  if (p >= 20) return "Foundations Building";
  return "Getting Started";
};

/**
 * Status color helper
 * @param {number|string} percentage 
 * @returns {string} Color token
 */
const getStatusColor = (percentage) => {
  const p = typeof percentage === "string" ? parseFloat(percentage) : percentage;
  if (p >= 80) return "emerald";
  if (p >= 50) return "indigo";
  if (p >= 20) return "amber";
  return "slate";
};

/**
 * Combines Frontend and Backend statistics to produce the single Software Engineer readiness role
 * @param {Object} frontendStats - { totalTopics, completedTopics, percentage }
 * @param {Object} backendStats - { totalTopics, completedTopics, percentage }
 * @returns {Array<Object>} Single composite role object array
 */
const calculateSoftwareEngineerReadiness = (frontendStats, backendStats) => {
  const totalCompleted = (frontendStats.completedTopics || 0) + (backendStats.completedTopics || 0);
  const totalTopics = (frontendStats.totalTopics || 0) + (backendStats.totalTopics || 0);
  const percentage = totalTopics > 0 ? ((totalCompleted / totalTopics) * 100).toFixed(1) : "0.0";
  const numPercentage = parseFloat(percentage);

  const stage = getStageLabel(numPercentage);
  const status = getStatus(numPercentage);
  const statusColor = getStatusColor(numPercentage);

  return [
    {
      id: "software-engineer",
      roleId: "software-engineer",
      role_name: "Software Engineer",
      roleName: "Software Engineer",
      badge: "CORE ROLE",
      targetLevel: "Comprehensive Full-Stack & Systems Readiness",
      description: "Comprehensive Full-Stack & Systems Readiness (Frontend + Backend)",
      tagline: "Comprehensive Full-Stack & Systems Readiness (Frontend + Backend)",
      percentage: numPercentage,
      readinessScore: numPercentage,
      completed_topics: totalCompleted,
      completedTopics: totalCompleted,
      total_topics: totalTopics,
      totalTopics: totalTopics,
      stage: stage,
      status: status,
      statusBadge: stage,
      statusColor: statusColor,
      frontend: {
        totalTopics: frontendStats.totalTopics || 0,
        completedTopics: frontendStats.completedTopics || 0,
        percentage: frontendStats.percentage || 0,
      },
      backend: {
        totalTopics: backendStats.totalTopics || 0,
        completedTopics: backendStats.completedTopics || 0,
        percentage: backendStats.percentage || 0,
      },
    },
  ];
};

/**
 * Calculates percentage readiness for market roles based on completed modular tracks
 * Combines progress across both Frontend and Backend paths/tracks into a single Software Engineer composite role.
 * @param {number} userId - The student's user ID
 * @returns {Promise<Object>} Aggregated market role readiness breakdown
 */
const calculateUserReadiness = async (userId) => {
  // 1. Determine User's Active Preparation Path if set
  const userPathRes = await pool.query(
    `SELECT upp.path_id, pp.slug, pp.name 
     FROM user_preparation_paths upp 
     JOIN preparation_paths pp ON upp.path_id = pp.id 
     WHERE upp.user_id = $1`,
    [userId]
  );
  const userPath = userPathRes.rows[0];

  // 2. Query Frontend Path Metrics (React.js Frontend Developer)
  const feRes = await pool.query(
    `SELECT 
       COUNT(DISTINCT top.id)::int AS total_topics,
       COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN top.id END)::int AS completed_topics
     FROM path_tracks pt
     JOIN preparation_paths pp ON pt.path_id = pp.id
     JOIN track_topics tt ON pt.track_id = tt.track_id
     JOIN topics top ON tt.topic_id = top.id
     LEFT JOIN user_progress up ON top.id = up.topic_id AND up.user_id = $1
     WHERE pp.slug ILIKE '%frontend%' OR pp.slug ILIKE '%react%';`,
    [userId]
  );

  // 3. Query Backend Path Metrics (Active backend path if user selected backend, otherwise nodejs-backend-developer)
  let backendPathFilter = "pp.slug = 'nodejs-backend-developer' OR pp.id = 3";
  if (userPath && (userPath.slug.includes("backend") || userPath.slug.includes("java") || userPath.slug.includes("python"))) {
    backendPathFilter = `pp.id = ${parseInt(userPath.path_id, 10)}`;
  }

  const beRes = await pool.query(
    `SELECT 
       COUNT(DISTINCT top.id)::int AS total_topics,
       COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN top.id END)::int AS completed_topics
     FROM path_tracks pt
     JOIN preparation_paths pp ON pt.path_id = pp.id
     JOIN track_topics tt ON pt.track_id = tt.track_id
     JOIN topics top ON tt.topic_id = top.id
     LEFT JOIN user_progress up ON top.id = up.topic_id AND up.user_id = $1
     WHERE ${backendPathFilter};`,
    [userId]
  );

  const feTotal = feRes.rows[0]?.total_topics || 0;
  const feCompleted = feRes.rows[0]?.completed_topics || 0;
  const fePct = feTotal > 0 ? parseFloat(((feCompleted / feTotal) * 100).toFixed(1)) : 0;

  const beTotal = beRes.rows[0]?.total_topics || 0;
  const beCompleted = beRes.rows[0]?.completed_topics || 0;
  const bePct = beTotal > 0 ? parseFloat(((beCompleted / beTotal) * 100).toFixed(1)) : 0;

  const frontendStats = {
    totalTopics: feTotal,
    completedTopics: feCompleted,
    percentage: fePct,
  };

  const backendStats = {
    totalTopics: beTotal,
    completedTopics: beCompleted,
    percentage: bePct,
  };

  // 4. Calculate Single Composite Role "Software Engineer"
  const roles = calculateSoftwareEngineerReadiness(frontendStats, backendStats);
  const primaryRole = roles[0];

  return {
    userId,
    averageReadiness: primaryRole.readinessScore,
    topRole: primaryRole,
    roles,
    calculatedAt: new Date().toISOString(),
  };
};

module.exports = {
  calculateUserReadiness,
  calculateSoftwareEngineerReadiness,
  MARKET_ROLES,
};
