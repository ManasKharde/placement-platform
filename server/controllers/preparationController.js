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

module.exports = {
  getAllPaths,
  getPathById,
  getTrackTopics,
};

