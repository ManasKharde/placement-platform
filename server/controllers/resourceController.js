const pool = require("../config/db");

// GET /api/topics/:id/resources — Fetch all learning materials for a specific topic
const getTopicResources = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid topic ID format." });
  }

  try {
    // 1. Verify topic exists
    const topicResult = await pool.query(
      "SELECT id, name, slug, description FROM topics WHERE id = $1",
      [id]
    );

    if (topicResult.rows.length === 0) {
      return res.status(404).json({ error: "Topic not found." });
    }

    // 2. Fetch resources from existing resources table
    const resourcesResult = await pool.query(
      `SELECT id, title, url, resource_type, estimated_minutes, created_at
       FROM resources
       WHERE topic_id = $1
       ORDER BY id ASC`,
      [id]
    );

    return res.status(200).json({
      topic: topicResult.rows[0],
      resources: resourcesResult.rows,
    });
  } catch (err) {
    console.error("Error fetching topic resources:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getTopicResources
};