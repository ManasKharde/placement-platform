const pool = require("../config/db");

// Helper to calculate pacing and metrics for a user's active preparation path
const calculateUserMetrics = async (userId) => {
  const pathResult = await pool.query(
    `SELECT upp.path_id, upp.daily_hours, upp.daily_study_time_minutes, pp.name AS path_name
     FROM user_preparation_paths upp
     JOIN preparation_paths pp ON upp.path_id = pp.id
     WHERE upp.user_id = $1`,
    [userId]
  );

  if (pathResult.rows.length === 0) {
    return null;
  }

  const {
    path_id: pathId,
    daily_hours: userDailyHours,
    daily_study_time_minutes: dailyMinutes,
    path_name: pathName,
  } = pathResult.rows[0];

  const effectiveMinutes = dailyMinutes || (userDailyHours ? userDailyHours * 60 : 120);
  const effectiveHours = userDailyHours || Math.round(effectiveMinutes / 60);

  // 1. Overall counts for the path
  const countsQuery = `
    SELECT 
      COUNT(DISTINCT top.id)::int AS total_topics,
      COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN top.id END)::int AS completed_topics
    FROM path_tracks pt
    JOIN tracks t ON pt.track_id = t.id
    JOIN track_topics tt ON t.id = tt.track_id
    JOIN topics top ON tt.topic_id = top.id
    LEFT JOIN user_progress up ON top.id = up.topic_id AND up.user_id = $1
    WHERE pt.path_id = $2;
  `;
  const countsResult = await pool.query(countsQuery, [userId, pathId]);
  const totalTopics = countsResult.rows[0]?.total_topics || 0;
  const completedTopics = countsResult.rows[0]?.completed_topics || 0;
  const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // 2. Remaining minutes for uncompleted topics
  const remainingQuery = `
    SELECT 
      COALESCE(SUM(r.estimated_minutes), 0)::int AS remaining_minutes,
      COUNT(DISTINCT top.id)::int AS remaining_topics
    FROM path_tracks pt
    JOIN tracks t ON pt.track_id = t.id
    JOIN track_topics tt ON t.id = tt.track_id
    JOIN topics top ON tt.topic_id = top.id
    LEFT JOIN user_progress up ON top.id = up.topic_id AND up.user_id = $1
    LEFT JOIN resources r ON top.id = r.topic_id
    WHERE pt.path_id = $2 
      AND (up.status IS NULL OR up.status != 'completed');
  `;
  const remainingResult = await pool.query(remainingQuery, [userId, pathId]);
  const remainingMinutes = remainingResult.rows[0]?.remaining_minutes || 0;
  const remainingTopics = remainingResult.rows[0]?.remaining_topics || 0;
  const remainingHours = parseFloat((remainingMinutes / 60).toFixed(1));
  const projectedDaysToComplete = effectiveMinutes > 0 ? Math.ceil(remainingMinutes / effectiveMinutes) : 0;

  return {
    pathId,
    pathName,
    dailyHours: effectiveHours,
    dailyStudyTimeMinutes: effectiveMinutes,
    totalTopics,
    completedTopics,
    percentage,
    remainingTopics,
    remainingMinutes,
    remainingHours,
    projectedDaysToComplete,
  };
};

// POST /api/user/topics/:topicId/toggle or POST /api/progress/toggle
// Atomic toggle or set topic completion status
const toggleTopicProgress = async (req, res) => {
  const rawTopicId = req.params.topicId || req.body.topicId;
  const { status } = req.body; // optional: 'completed', 'in_progress', or 'not_started'
  const userId = req.user.id;

  const topicId = parseInt(rawTopicId, 10);
  if (!topicId || isNaN(topicId)) {
    return res.status(400).json({ error: "Valid numeric topicId is required." });
  }

  try {
    // 1. Verify topic exists
    const topicCheck = await pool.query("SELECT id, name FROM topics WHERE id = $1", [topicId]);
    if (topicCheck.rows.length === 0) {
      return res.status(404).json({ error: "Topic not found." });
    }

    // 2. Determine target status
    let targetStatus = status;
    if (!targetStatus) {
      // Check current status to perform atomic toggle
      const currentProgress = await pool.query(
        "SELECT status FROM user_progress WHERE user_id = $1 AND topic_id = $2",
        [userId, topicId]
      );

      if (currentProgress.rows.length > 0 && currentProgress.rows[0].status === "completed") {
        targetStatus = "not_started";
      } else {
        targetStatus = "completed";
      }
    }

    const validStatuses = ["not_started", "in_progress", "completed"];
    if (!validStatuses.includes(targetStatus)) {
      return res.status(400).json({
        error: "Invalid status value. Must be 'not_started', 'in_progress', or 'completed'.",
      });
    }

    // 2b. Quiz Completion Enforcement Gateway
    if (targetStatus === "completed") {
      const quizCheck = await pool.query(
        "SELECT id, passing_percentage FROM quizzes WHERE topic_id = $1",
        [topicId]
      );

      if (quizCheck.rows.length > 0) {
        const quizId = quizCheck.rows[0].id;
        const passCheck = await pool.query(
          "SELECT id FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2 AND passed = true LIMIT 1",
          [userId, quizId]
        );

        if (passCheck.rows.length === 0) {
          return res.status(403).json({
            error: "Assessment Required: You must score at least 70% on the topic assessment before marking this topic as completed.",
          });
        }
      }
    }

    // 3. Atomic UPSERT into user_progress with completed_at timestamp
    const upsertQuery = `
      INSERT INTO user_progress (user_id, topic_id, status, completed_at, updated_at)
      VALUES (
        $1, 
        $2, 
        $3::progress_status, 
        CASE WHEN $3::progress_status = 'completed' THEN NOW() ELSE NULL END,
        NOW()
      )
      ON CONFLICT (user_id, topic_id)
      DO UPDATE SET 
        status = EXCLUDED.status,
        completed_at = EXCLUDED.completed_at,
        updated_at = NOW()
      RETURNING id, user_id, topic_id, status, completed_at, updated_at;
    `;

    const result = await pool.query(upsertQuery, [userId, topicId, targetStatus]);
    const updatedRecord = result.rows[0];

    // 4. Calculate recalculated metrics
    const metrics = await calculateUserMetrics(userId);

    return res.status(200).json({
      message: `Topic marked as ${targetStatus}.`,
      progress: {
        id: updatedRecord.id,
        userId: updatedRecord.user_id,
        topicId: updatedRecord.topic_id,
        status: updatedRecord.status,
        completedAt: updatedRecord.completed_at,
        updatedAt: updatedRecord.updated_at,
      },
      metrics,
    });
  } catch (err) {
    console.error("Error updating topic progress:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// GET /api/progress or GET /api/user/progress — Fetch all progress records for active user
const getUserProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT topic_id, status, completed_at, updated_at 
      FROM user_progress 
      WHERE user_id = $1;
    `;

    const result = await pool.query(query, [userId]);
    const completedTopicIds = result.rows
      .filter((row) => row.status === "completed")
      .map((row) => row.topic_id);

    const metrics = await calculateUserMetrics(userId);

    return res.status(200).json({
      completedTopicIds,
      progressList: result.rows,
      metrics,
    });
  } catch (err) {
    console.error("Error fetching user progress:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  toggleTopicProgress,
  getUserProgress,
  calculateUserMetrics,
};