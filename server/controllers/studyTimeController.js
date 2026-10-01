const pool = require("../config/db");

// PUT /api/user/study-time — Set daily available study hours / minutes
const setStudyTime = async (req, res) => {
  const userId = req.user.id;
  const { dailyMinutes, dailyHours, daily_hours } = req.body;

  let minutes = null;
  let hours = null;

  if (dailyHours !== undefined || daily_hours !== undefined) {
    const rawH = parseInt(dailyHours !== undefined ? dailyHours : daily_hours, 10);
    if (isNaN(rawH) || rawH <= 0 || rawH > 16) {
      return res.status(400).json({ error: "Please provide valid daily study hours between 1 and 16." });
    }
    hours = rawH;
    minutes = hours * 60;
  } else if (dailyMinutes !== undefined) {
    const rawM = parseInt(dailyMinutes, 10);
    if (isNaN(rawM) || rawM <= 0 || rawM > 960) {
      return res.status(400).json({ error: "Please provide a valid daily study time in minutes (between 1 and 960)." });
    }
    minutes = rawM;
    hours = Math.max(1, Math.round(minutes / 60));
  } else {
    return res.status(400).json({ error: "Please provide dailyHours (e.g., 1, 2, or 3) or dailyMinutes." });
  }

  try {
    const result = await pool.query(
      `UPDATE user_preparation_paths 
       SET daily_study_time_minutes = $1, daily_hours = $2 
       WHERE user_id = $3 
       RETURNING path_id, daily_hours, daily_study_time_minutes`,
      [minutes, hours, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No active preparation path found for this user." });
    }

    return res.status(200).json({
      message: "Daily study commitment updated successfully.",
      dailyHours: result.rows[0].daily_hours,
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
      `SELECT upp.path_id, upp.daily_hours, upp.daily_study_time_minutes, pp.name AS path_name
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

    const {
      path_id: pathId,
      daily_hours: userDailyHours,
      daily_study_time_minutes: dailyMinutes,
      path_name: pathName,
    } = pathResult.rows[0];

    const effectiveMinutes = dailyMinutes || (userDailyHours ? userDailyHours * 60 : 120);
    const effectiveHours = userDailyHours || Math.round(effectiveMinutes / 60);

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
    const projectedDaysToComplete = effectiveMinutes > 0 ? Math.ceil(remainingMinutes / effectiveMinutes) : null;

    return res.status(200).json({
      hasSelectedPath: true,
      pathName,
      dailyHours: effectiveHours,
      dailyStudyTimeMinutes: effectiveMinutes,
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