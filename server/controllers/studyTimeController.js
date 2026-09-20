const pool = require("../config/db");

// PUT /api/user/study-time — Set daily available study minutes
const setStudyTime = async (req, res) => {
  const userId = req.user.id;
  const { dailyMinutes } = req.body;

  if (!dailyMinutes || isNaN(dailyMinutes) || dailyMinutes <= 0) {
    return res.status(400).json({ error: "Please provide a valid daily study time in minutes (> 0)." });
  }

  try {
    const result = await pool.query(
      `UPDATE user_preparation_paths 
       SET daily_study_time_minutes = $1 
       WHERE user_id = $2 
       RETURNING path_id, daily_study_time_minutes`,
      [dailyMinutes, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No active preparation path found for this user." });
    }

    return res.status(200).json({
      message: "Daily study time updated successfully.",
      dailyStudyTimeMinutes: result.rows[0].daily_study_time_minutes,
    });
  } catch (err) {
    console.error("Error updating study time:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// GET /api/user/pacing — Get remaining path estimated hours and projected completion days
const getPathPacing = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Fetch user's active path & daily study target
    const pathResult = await pool.query(
      `SELECT upp.path_id, upp.daily_study_time_minutes, pp.name AS path_name
       FROM user_preparation_paths upp
       JOIN preparation_paths pp ON upp.path_id = pp.id
       WHERE upp.user_id = $1`,
      [userId]
    );

    if (pathResult.rows.length === 0) {
      return res.status(200).json({
        hasSelectedPath: false,
        message: "No active preparation path selected.",
      });
    }

    const { path_id: pathId, daily_study_time_minutes: dailyMinutes, path_name: pathName } = pathResult.rows[0];

    // 2. Aggregate remaining resource time for uncompleted topics
    const timeQuery = `
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

    const timeResult = await pool.query(timeQuery, [userId, pathId]);
    const { remaining_minutes: remainingMinutes, remaining_topics: remainingTopics } = timeResult.rows[0];

    const remainingHours = (remainingMinutes / 60).toFixed(1);
    const projectedDaysToComplete = dailyMinutes > 0 ? Math.ceil(remainingMinutes / dailyMinutes) : null;

    return res.status(200).json({
      hasSelectedPath: true,
      pathName,
      dailyStudyTimeMinutes: dailyMinutes,
      pacing: {
        remainingTopics,
        remainingMinutes,
        remainingHours: parseFloat(remainingHours),
        projectedDaysToComplete,
      },
    });
  } catch (err) {
    console.error("Error fetching path pacing:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  setStudyTime,
  getPathPacing,
};