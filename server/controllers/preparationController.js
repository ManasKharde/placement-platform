const pool = require("../config/db");

const getAllPaths = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, slug, description FROM preparation_paths WHERE is_active = TRUE ORDER BY name ASC`
        )
        return res.status(200).json({
            message: "Paths retrieval successful",
            paths: result.rows
        })
    }
    catch (error) {
        console.log("Error while retrieving preparation paths ", error);
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

const getPathById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT id, name, slug, description FROM preparation_paths WHERE id = $1 AND is_active = true`, [id]
        )
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Preparation Path not found"
            })
        }
        const trackResult = await pool.query(
            `SELECT t.id, t.name, t.slug, t.description, pt.track_order
            FROM tracks t
            JOIN path_tracks pt ON t.id = pt.track_id
            WHERE pt.path_id = $1
            ORDER BY pt.track_order ASC`,
            [id]
        )

        return res.status(200).json({
            message: "Tracks retrieved successfully",
            paths: trackResult.rows[0],
            tracks: trackResult.rows,
        })
    }
    catch (error) {
        console.log("Error while retrieving tracks ", error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

const getTrackTopics = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Verify track existence first
        const trackCheck = await pool.query(
            "SELECT id FROM tracks WHERE id = $1",
            [id]
        );

        if (trackCheck.rows.length === 0) {
            return res.status(404).json({ error: "Track not found." });
        }

        // 2. Fetch associated topics
        const topicsResult = await pool.query(
            `SELECT top.id, top.name, top.slug, top.description, tt.topic_order
            FROM topics top
            JOIN track_topics tt ON top.id = tt.topic_id
            WHERE tt.track_id = $1
            ORDER BY tt.topic_order ASC`,
            [id]
        );

        return res.status(200).json({
            trackId: parseInt(id, 10),
            topics: topicsResult.rows,
        });
    }
    catch (error) {
        console.error("Error fetching track topics:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}

// controllers/preparationController.js

// POST /api/user/preparation-path — Save or update user's selected path
const selectUserPath = async (req, res) => {
  const { pathId } = req.body;
  const userId = req.user.id; // Populated by authenticateToken middleware

  // 1. Basic input validation
  if (!pathId || isNaN(pathId)) {
    return res.status(400).json({ error: "A valid pathId integer is required." });
  }

  try {
    // 2. Verify that the requested path actually exists and is active
    const pathCheck = await pool.query(
      "SELECT id, name, slug FROM preparation_paths WHERE id = $1 AND is_active = true",
      [pathId]
    );

    if (pathCheck.rows.length === 0) {
      return res.status(404).json({ error: "Preparation path not found or inactive." });
    }

    // 3. Upsert into user_preparation_paths (insert or update on conflict)
    const upsertQuery = `
      INSERT INTO user_preparation_paths (user_id, path_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET path_id = EXCLUDED.path_id
      RETURNING id, user_id, path_id, created_at;
    `;

    const result = await pool.query(upsertQuery, [userId, pathId]);

    return res.status(200).json({
      message: "Preparation path selected successfully.",
      userPath: result.rows[0],
      selectedPath: pathCheck.rows[0],
    });
  } catch (err) {
    console.error("Error in selectUserPath:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// GET /api/user/preparation-path — Get currently active path for the user
const getUserPath = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT upp.id AS user_path_id, pp.id AS path_id, pp.name, pp.slug, pp.description, upp.created_at
      FROM user_preparation_paths upp
      JOIN preparation_paths pp ON upp.path_id = pp.id
      WHERE upp.user_id = $1;
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        hasSelectedPath: false,
        userPath: null,
      });
    }

    return res.status(200).json({
      hasSelectedPath: true,
      userPath: result.rows[0],
    });
  } catch (err) {
    console.error("Error in getUserPath:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getAllPaths,
  getPathById,
  getTrackTopics,
  selectUserPath,
  getUserPath,
};

