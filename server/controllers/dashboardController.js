const pool = require("../config/db");

// GET /api/user/dashboard — Single aggregated payload for student home screen
const getStudentDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Fetch user profile + active preparation path
    const userResult = await pool.query(
      `SELECT u.id, u.username, u.email, u.avatar_url,
              pp.id AS path_id, pp.name AS path_name, pp.slug AS path_slug,
              upp.daily_hours, upp.daily_study_time_minutes
       FROM users u
       LEFT JOIN user_preparation_paths upp ON u.id = upp.user_id
       LEFT JOIN preparation_paths pp ON upp.path_id = pp.id AND pp.is_active = true
       WHERE u.id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = userResult.rows[0];

    if (!user.path_id) {
      return res.status(200).json({
        hasSelectedPath: false,
        message: "No active preparation path selected.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar_url,
        },
        dashboard: null,
      });
    }

    // 2. Aggregate track-by-track progress and total progress in ONE SQL query
    const progressQuery = `
      WITH path_topics AS (
        SELECT 
          t.id AS track_id,
          t.name AS track_name,
          t.slug AS track_slug,
          pt.track_order,
          top.id AS topic_id,
          top.name AS topic_name,
          tt.topic_order,
          up.status AS progress_status
        FROM path_tracks pt
        JOIN tracks t ON pt.track_id = t.id
        JOIN track_topics tt ON t.id = tt.track_id
        JOIN topics top ON tt.topic_id = top.id
        LEFT JOIN user_progress up ON top.id = up.topic_id AND up.user_id = $1
        WHERE pt.path_id = $2
      )
      SELECT 
        track_id,
        track_name,
        track_slug,
        track_order,
        COUNT(topic_id)::int AS total_track_topics,
        COUNT(CASE WHEN progress_status = 'completed' THEN 1 END)::int AS completed_track_topics
      FROM path_topics
      GROUP BY track_id, track_name, track_slug, track_order
      ORDER BY track_order ASC;
    `;

    const progressResult = await pool.query(progressQuery, [userId, user.path_id]);

    // 3. Process track metrics and overall totals
    let totalPathTopics = 0;
    let completedPathTopics = 0;

    const tracksProgress = progressResult.rows.map((row) => {
      const total = row.total_track_topics;
      const completed = row.completed_track_topics;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      totalPathTopics += total;
      completedPathTopics += completed;

      return {
        trackId: row.track_id,
        trackName: row.track_name,
        trackSlug: row.track_slug,
        order: row.track_order,
        totalTopics: total,
        completedTopics: completed,
        percentage: percentage,
      };
    });

    const overallPercentage =
      totalPathTopics > 0 ? Math.round((completedPathTopics / totalPathTopics) * 100) : 0;

    return res.status(200).json({
      hasSelectedPath: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url,
      },
      dashboard: {
        activePath: {
          id: user.path_id,
          name: user.path_name,
          slug: user.path_slug,
        },
        dailyHours: user.daily_hours || 2,
        dailyStudyTimeMinutes: user.daily_study_time_minutes || 120,
        overallProgress: {
          totalTopics: totalPathTopics,
          completedTopics: completedPathTopics,
          percentage: overallPercentage,
        },
        trackBreakdown: tracksProgress,
      },
    });
  } catch (err) {
    console.error("Error fetching student dashboard:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getStudentDashboard,
};