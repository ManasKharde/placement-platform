const pool = require("../config/db");

// GET /api/user/missions — Generate rule-based "Today's Missions" recommendations
const getTodaysMissions = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Fetch user's active preparation path
    const pathResult = await pool.query(
      `SELECT path_id FROM user_preparation_paths WHERE user_id = $1`,
      [userId]
    );

    if (pathResult.rows.length === 0) {
      return res.status(200).json({
        hasSelectedPath: false,
        message: "No active preparation path selected.",
        missions: [],
      });
    }

    const pathId = pathResult.rows[0].path_id;

    // 2. Fetch recommended next uncompleted/in-progress topics in sequential order
    const missionsQuery = `
      SELECT 
        top.id AS topic_id,
        top.name AS topic_name,
        top.slug AS topic_slug,
        top.description AS topic_description,
        t.id AS track_id,
        t.name AS track_name,
        pt.track_order,
        tt.topic_order,
        COALESCE(up.status, 'not_started') AS current_status,
        COUNT(r.id)::int AS resource_count
      FROM path_tracks pt
      JOIN tracks t ON pt.track_id = t.id
      JOIN track_topics tt ON t.id = tt.track_id
      JOIN topics top ON tt.topic_id = top.id
      LEFT JOIN user_progress up ON top.id = up.topic_id AND up.user_id = $1
      LEFT JOIN resources r ON top.id = r.topic_id
      WHERE pt.path_id = $2 
        AND (up.status IS NULL OR up.status IN ('not_started', 'in_progress'))
      GROUP BY top.id, top.name, top.slug, top.description, t.id, t.name, pt.track_order, tt.topic_order, up.status
      ORDER BY 
        CASE WHEN up.status = 'in_progress' THEN 1 ELSE 2 END, -- Priority to in-progress topics
        pt.track_order ASC, 
        tt.topic_order ASC
      LIMIT 3;
    `;

    const missionsResult = await pool.query(missionsQuery, [userId, pathId]);

    const missions = missionsResult.rows.map((row) => ({
      topicId: row.topic_id,
      topicName: row.topic_name,
      topicSlug: row.topic_slug,
      description: row.topic_description,
      trackId: row.track_id,
      trackName: row.track_name,
      status: row.current_status,
      resourceCount: row.resource_count,
    }));

    return res.status(200).json({
      hasSelectedPath: true,
      count: missions.length,
      missions: missions,
    });
  } catch (err) {
    console.error("Error generating Today's Missions:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getTodaysMissions,
};