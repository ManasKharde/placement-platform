const pool = require("../config/db");

// POST /api/progress/toggle — Atomic toggle/update for topic completion status
const toggleTopicProgress = async (req, res) => {
  const { topicId, status } = req.body; // status: 'completed', 'in_progress', or 'not_started'
  const userId = req.user.id;

  if (!topicId || isNaN(topicId)) {
    return res.status(400).json({ error: "Valid numeric topicId is required." });
  }

  const validStatuses = ["not_started", "in_progress", "completed"];
  const targetStatus = status || "completed";

  if (!validStatuses.includes(targetStatus)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    // Check if topic exists
    const topicCheck = await pool.query("SELECT id FROM topics WHERE id = $1", [topicId]);
    if (topicCheck.rows.length === 0) {
      return res.status(404).json({ error: "Topic not found." });
    }

    // Atomic UPSERT query
    const upsertQuery = `
      INSERT INTO user_progress (user_id, topic_id, status)
    VALUES ($1, $2, $3::progress_status)
    ON CONFLICT (user_id, topic_id)
    DO UPDATE SET 
    status = $3::progress_status,
    completed_at = CASE 
        WHEN $3::progress_status = 'completed' THEN NOW() 
        ELSE NULL 
    END
    RETURNING id, user_id, topic_id, status, completed_at;
    `;

    const result = await pool.query(upsertQuery, [userId, topicId, targetStatus]);

    return res.status(200).json({
      message: "Topic progress updated successfully.",
      progress: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating topic progress:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// GET /api/progress — Fetch all completed topic IDs for the active user
const getUserProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT topic_id, status, completed_at 
      FROM user_progress 
      WHERE user_id = $1 AND status = 'completed';
    `;

    const result = await pool.query(query, [userId]);

    return res.status(200).json({
      completedTopicIds: result.rows.map((row) => row.topic_id),
      details: result.rows,
    });
  } catch (err) {
    console.error("Error fetching user progress:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  toggleTopicProgress,
  getUserProgress,
};