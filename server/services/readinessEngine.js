const pool = require("../config/db");

const MARKET_ROLES = [
  {
    roleId: "backend-software-engineer",
    roleName: "Backend Software Engineer",
    targetLevel: "SDE-1 / Junior Backend Engineer",
    tagline: "High-throughput APIs, Distributed Systems, Relational Data Architecture & Core CS",
    requiredTracks: [
      { slug: "nodejs-express-architecture", weight: 35, required: true },
      { slug: "problem-solving-dsa-sql", weight: 30, required: true },
      { slug: "core-computer-science-fundamentals", weight: 20, required: true },
      { slug: "system-design-deployment", weight: 15, required: false },
    ],
  },
  {
    roleId: "fullstack-software-engineer",
    roleName: "Full-Stack Software Engineer",
    targetLevel: "Full-Stack Engineer (MERN / Polyglot)",
    tagline: "End-to-End Web Applications, State Management, REST APIs & SQL Modeling",
    requiredTracks: [
      { slug: "nodejs-express-architecture", weight: 30, required: true },
      { slug: "problem-solving-dsa-sql", weight: 30, required: true },
      { slug: "core-computer-science-fundamentals", weight: 25, required: true },
      { slug: "system-design-deployment", weight: 15, required: false },
    ],
  },
  {
    roleId: "campus-sde-general",
    roleName: "Campus SDE / Graduate Trainee",
    targetLevel: "Top Campus Recruitment & Technical Screening",
    tagline: "LeetCode Problem Solving, Systems Fundamentals & Preliminary Quantitative Logic",
    requiredTracks: [
      { slug: "problem-solving-dsa-sql", weight: 40, required: true },
      { slug: "core-computer-science-fundamentals", weight: 35, required: true },
      { slug: "quantitative-aptitude-logical-reasoning", weight: 15, required: true },
      { slug: "nodejs-express-architecture", weight: 10, required: false },
    ],
  },
  {
    roleId: "database-systems-engineer",
    roleName: "Database & Backend Systems Engineer",
    targetLevel: "Data Infrastructure & Backend Performance",
    tagline: "Advanced SQL Optimization, ACID Guarantees, Indexing (B-Trees) & Distributed Cache",
    requiredTracks: [
      { slug: "problem-solving-dsa-sql", weight: 45, required: true },
      { slug: "core-computer-science-fundamentals", weight: 35, required: true },
      { slug: "system-design-deployment", weight: 20, required: true },
    ],
  },
];

/**
 * Calculates percentage readiness for market roles based on completed modular tracks
 * @param {number} userId - The student's user ID
 * @returns {Promise<Object>} Aggregated market role readiness breakdown
 */
const calculateUserReadiness = async (userId) => {
  // 1. Fetch all tracks and their topics with completion status for this user
  const trackQuery = `
    SELECT 
      t.id AS track_id,
      t.name AS track_name,
      t.slug AS track_slug,
      t.evaluation_type,
      top.id AS topic_id,
      top.name AS topic_name,
      top.slug AS topic_slug,
      tt.topic_order,
      COALESCE(up.status, 'not_started') AS topic_status
    FROM tracks t
    JOIN track_topics tt ON t.id = tt.track_id
    JOIN topics top ON tt.topic_id = top.id
    LEFT JOIN user_progress up ON top.id = up.topic_id AND up.user_id = $1
    ORDER BY t.id, tt.topic_order ASC;
  `;

  const trackResult = await pool.query(trackQuery, [userId]);

  // Group by track slug
  const trackMap = new Map();
  for (const row of trackResult.rows) {
    if (!trackMap.has(row.track_slug)) {
      trackMap.set(row.track_slug, {
        trackId: row.track_id,
        trackName: row.track_name,
        trackSlug: row.track_slug,
        evaluationType: row.evaluation_type || "practice",
        topics: [],
        totalTopics: 0,
        completedTopics: 0,
      });
    }

    const t = trackMap.get(row.track_slug);
    const isCompleted = row.topic_status === "completed";
    t.totalTopics++;
    if (isCompleted) t.completedTopics++;
    t.topics.push({
      id: row.topic_id,
      name: row.topic_name,
      slug: row.topic_slug,
      order: row.topic_order,
      isCompleted,
    });
  }

  // Precompute track percentages
  trackMap.forEach((t) => {
    t.progressPercentage =
      t.totalTopics > 0 ? Math.round((t.completedTopics / t.totalTopics) * 1000) / 10 : 0;
  });

  // 2. Evaluate each Market Role
  const rolesBreakdown = MARKET_ROLES.map((role) => {
    let totalWeight = 0;
    let weightedScoreSum = 0;
    let totalRoleTopics = 0;
    let completedRoleTopics = 0;

    const evaluatedTracks = [];
    let recommendedNextTopic = null;

    for (const req of role.requiredTracks) {
      const trackData = trackMap.get(req.slug);
      const trackProgress = trackData ? trackData.progressPercentage : 0;
      const totalTopics = trackData ? trackData.totalTopics : 0;
      const completedTopics = trackData ? trackData.completedTopics : 0;

      totalWeight += req.weight;
      weightedScoreSum += trackProgress * req.weight;
      totalRoleTopics += totalTopics;
      completedRoleTopics += completedTopics;

      evaluatedTracks.push({
        trackName: trackData ? trackData.trackName : req.slug,
        trackSlug: req.slug,
        evaluationType: trackData ? trackData.evaluationType : "practice",
        weight: req.weight,
        isRequired: req.required,
        totalTopics,
        completedTopics,
        progressPercentage: trackProgress,
      });

      // Find first uncompleted topic in the highest-weight incomplete track
      if (!recommendedNextTopic && trackData) {
        const nextIncomplete = trackData.topics.find((tp) => !tp.isCompleted);
        if (nextIncomplete) {
          recommendedNextTopic = {
            id: nextIncomplete.id,
            name: nextIncomplete.name,
            slug: nextIncomplete.slug,
            trackName: trackData.trackName,
            trackSlug: trackData.trackSlug,
          };
        }
      }
    }

    const readinessScore =
      totalWeight > 0 ? Math.round((weightedScoreSum / totalWeight) * 10) / 10 : 0;

    // Status and UI badges
    let status = "Getting Started";
    let statusBadge = "Orientation Stage";
    let statusColor = "slate";

    if (readinessScore >= 80) {
      status = "Interview Ready";
      statusBadge = "Ready for Technical Screening";
      statusColor = "emerald";
    } else if (readinessScore >= 50) {
      status = "Shortlist Competitive";
      statusBadge = "Competitive for Placement Screening";
      statusColor = "indigo";
    } else if (readinessScore >= 20) {
      status = "Foundations Building";
      statusBadge = "Core Skills in Progress";
      statusColor = "amber";
    }

    return {
      roleId: role.roleId,
      roleName: role.roleName,
      targetLevel: role.targetLevel,
      tagline: role.tagline,
      readinessScore,
      status,
      statusBadge,
      statusColor,
      totalTopics: totalRoleTopics,
      completedTopics: completedRoleTopics,
      requiredTracks: evaluatedTracks,
      recommendedNextTopic,
    };
  });

  // Sort roles by highest readiness
  rolesBreakdown.sort((a, b) => b.readinessScore - a.readinessScore);

  const averageReadiness =
    rolesBreakdown.length > 0
      ? Math.round(
        (rolesBreakdown.reduce((sum, r) => sum + r.readinessScore, 0) /
          rolesBreakdown.length) *
        10
      ) / 10
      : 0;

  return {
    userId,
    averageReadiness,
    topRole: rolesBreakdown[0] || null,
    roles: rolesBreakdown,
    calculatedAt: new Date().toISOString(),
  };
};

module.exports = {
  calculateUserReadiness,
  MARKET_ROLES,
};
