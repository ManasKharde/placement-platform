const pool = require("../config/db");
const { calculateUserReadiness } = require("../services/readinessEngine");

// GET /api/preparation-paths — Fetch all available active preparation paths with stats
const getAllPaths = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        pp.id, 
        pp.name, 
        pp.slug, 
        pp.description,
        COUNT(DISTINCT pt.track_id)::int AS total_tracks,
        COUNT(DISTINCT tt.topic_id)::int AS total_topics,
        ROUND(COALESCE(SUM(r.estimated_minutes), 0) / 60.0, 1)::float AS total_estimated_hours
      FROM preparation_paths pp
      LEFT JOIN path_tracks pt ON pp.id = pt.path_id
      LEFT JOIN tracks t ON pt.track_id = t.id
      LEFT JOIN track_topics tt ON t.id = tt.track_id
      LEFT JOIN topics top ON tt.topic_id = top.id
      LEFT JOIN resources r ON top.id = r.topic_id
      WHERE pp.is_active = TRUE
      GROUP BY pp.id, pp.name, pp.slug, pp.description
      ORDER BY pp.id ASC;
    `);

    return res.status(200).json({
      message: "Paths retrieval successful",
      paths: result.rows,
    });
  } catch (error) {
    console.error("Error while retrieving preparation paths:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// GET /api/preparation-paths/:id — Fetch a specific path and its ordered tracks
const getPathById = async (req, res) => {
  const { id } = req.params;

  try {
    const pathResult = await pool.query(
      `SELECT id, name, slug, description FROM preparation_paths WHERE id = $1 AND is_active = true`,
      [id]
    );

    if (pathResult.rows.length === 0) {
      return res.status(404).json({
        message: "Preparation Path not found",
      });
    }

    const trackResult = await pool.query(
      `SELECT t.id, t.name, t.slug, t.description, pt.track_order
       FROM tracks t
       JOIN path_tracks pt ON t.id = pt.track_id
       WHERE pt.path_id = $1
       ORDER BY pt.track_order ASC`,
      [id]
    );

    return res.status(200).json({
      message: "Tracks retrieved successfully",
      path: pathResult.rows[0],
      tracks: trackResult.rows,
    });
  } catch (error) {
    console.error("Error while retrieving tracks:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// GET /api/tracks/:id/topics — Fetch all topics for a track
const getTrackTopics = async (req, res) => {
  const { id } = req.params;
  try {
    const trackCheck = await pool.query("SELECT id FROM tracks WHERE id = $1", [id]);

    if (trackCheck.rows.length === 0) {
      return res.status(404).json({ error: "Track not found." });
    }

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
  } catch (error) {
    console.error("Error fetching track topics:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// POST /api/user/preparation-path — Save or update user's selected path & daily commitment
const selectUserPath = async (req, res) => {
  const { pathId, dailyHours, daily_hours, dailyMinutes } = req.body;
  const userId = req.user.id;

  if (!pathId || isNaN(pathId)) {
    return res.status(400).json({ error: "A valid pathId integer is required." });
  }

  // Parse daily study hours commitment (default to existing or 2 hours if not specified)
  const rawHours = dailyHours || daily_hours || (dailyMinutes ? Math.round(dailyMinutes / 60) : null);
  const parsedHours = rawHours ? parseInt(rawHours, 10) : null;
  const validatedHours = parsedHours && !isNaN(parsedHours) && parsedHours > 0 ? Math.min(Math.max(parsedHours, 1), 12) : null;
  const validatedMinutes = validatedHours ? validatedHours * 60 : null;

  try {
    const pathCheck = await pool.query(
      "SELECT id, name, slug, description FROM preparation_paths WHERE id = $1 AND is_active = true",
      [pathId]
    );

    if (pathCheck.rows.length === 0) {
      return res.status(404).json({ error: "Preparation path not found or inactive." });
    }

    const upsertQuery = `
      INSERT INTO user_preparation_paths (user_id, path_id, daily_hours, daily_study_time_minutes)
      VALUES ($1, $2, COALESCE($3, 2), COALESCE($4, 120))
      ON CONFLICT (user_id)
      DO UPDATE SET 
        path_id = EXCLUDED.path_id,
        daily_hours = COALESCE($3, user_preparation_paths.daily_hours, 2),
        daily_study_time_minutes = COALESCE($4, user_preparation_paths.daily_study_time_minutes, 120)
      RETURNING id, user_id, path_id, daily_hours, daily_study_time_minutes, created_at;
    `;

    const result = await pool.query(upsertQuery, [userId, pathId, validatedHours, validatedMinutes]);

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

// GET /api/user/preparation-path — Get currently active path & daily study commitment for user
const getUserPath = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT 
        upp.id AS user_path_id, 
        pp.id AS path_id, 
        pp.name, 
        pp.slug, 
        pp.description,
        upp.daily_hours,
        upp.daily_study_time_minutes,
        upp.created_at
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

// GET /api/tracks — Fetch all top-level tracks with nested sub-tracks
const getAllTracks = async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id,
        COALESCE(t.name, t.title) AS name,
        COALESCE(t.title, t.name) AS title,
        t.slug,
        t.description,
        t.track_order,
        t.evaluation_type,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'id', sub.id,
              'name', COALESCE(sub.name, sub.title),
              'title', COALESCE(sub.title, sub.name),
              'slug', sub.slug,
              'description', sub.description,
              'track_order', sub.track_order,
              'evaluation_type', sub.evaluation_type,
              'topics_count', (
                SELECT COUNT(*) FROM track_topics tt WHERE tt.track_id = sub.id
              )
            ) ORDER BY sub.track_order ASC
          ) FROM tracks sub WHERE sub.parent_track_id = t.id),
          '[]'
        ) AS sub_tracks
      FROM tracks t
      WHERE t.parent_track_id IS NULL AND (t.is_published = true OR t.is_published IS NULL)
      ORDER BY t.track_order ASC;
    `;
    const result = await pool.query(query);
    return res.status(200).json({
      success: true,
      tracks: result.rows,
    });
  } catch (err) {
    console.error("Error fetching tracks:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// GET /api/user/roadmap — High-performance complete roadmap retrieval
const getUserRoadmap = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Fetch user's active path and mapped top-level tracks in a single JOIN
    const roadmapQuery = `
      SELECT 
        pp.id AS path_id,
        pp.name AS path_name,
        pp.slug AS path_slug,
        pp.description AS path_description,
        upp.daily_hours,
        upp.daily_study_time_minutes,
        t.id AS track_id,
        COALESCE(t.name, t.title) AS track_name,
        COALESCE(t.title, t.name) AS track_title,
        t.slug AS track_slug,
        t.description AS track_description,
        t.evaluation_type,
        t.parent_track_id,
        COALESCE(t.track_order, pt.track_order, 1) AS track_order
      FROM user_preparation_paths upp
      JOIN preparation_paths pp ON upp.path_id = pp.id AND pp.is_active = true
      JOIN path_tracks pt ON pp.id = pt.path_id
      JOIN tracks t ON pt.track_id = t.id
      WHERE upp.user_id = $1 AND t.parent_track_id IS NULL
      ORDER BY COALESCE(t.track_order, pt.track_order, 1) ASC;
    `;

    const roadmapResult = await pool.query(roadmapQuery, [userId]);

    if (roadmapResult.rows.length === 0) {
      return res.status(200).json({
        success: false,
        hasSelectedPath: false,
        message: "No active preparation path selected.",
        roadmap: null,
      });
    }

    const firstRow = roadmapResult.rows[0];
    const pathInfo = {
      id: firstRow.path_id,
      name: firstRow.path_name,
      slug: firstRow.path_slug,
      description: firstRow.path_description,
      dailyHours: firstRow.daily_hours || 2,
      dailyStudyTimeMinutes: firstRow.daily_study_time_minutes || 120,
    };

    const tracks = [];
    const parentTrackIds = [];

    roadmapResult.rows.forEach((row) => {
      parentTrackIds.push(row.track_id);
      tracks.push({
        id: row.track_id,
        name: row.track_name,
        title: row.track_title,
        slug: row.track_slug,
        description: row.track_description,
        order: row.track_order,
        evaluationType: row.evaluation_type || "practice",
        topics: [],
        sub_tracks: [],
        subTracks: [],
      });
    });

    // 2. Fetch nested sub-tracks for these parent tracks
    const subTracksResult = await pool.query(
      `SELECT 
        sub.id,
        COALESCE(sub.name, sub.title) AS name,
        COALESCE(sub.title, sub.name) AS title,
        sub.slug,
        sub.description,
        sub.parent_track_id,
        sub.track_order,
        sub.evaluation_type,
        sub.icon,
        sub.level
      FROM tracks sub
      WHERE sub.parent_track_id = ANY($1::int[]) AND (sub.is_published = true OR sub.is_published IS NULL)
      ORDER BY sub.parent_track_id ASC, sub.track_order ASC;`,
      [parentTrackIds]
    );

    const subTracks = subTracksResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      title: row.title,
      slug: row.slug,
      description: row.description,
      parentTrackId: row.parent_track_id,
      order: row.track_order,
      evaluationType: row.evaluation_type || "practice",
      icon: row.icon,
      level: row.level,
      topics: [],
    }));

    const subTrackMap = new Map(subTracks.map((st) => [st.id, st]));
    const allQueryTrackIds = [...parentTrackIds, ...subTracks.map((st) => st.id)];

    // 3. Batch fetch ALL topics with user completion status for ALL tracks & sub-tracks
    const topicsQuery = `
      SELECT 
        top.id,
        top.name,
        top.slug,
        top.description,
        top.subtrack,
        tt.track_id,
        tt.topic_order,
        COALESCE(up.status, 'not_started') AS status,
        COALESCE(SUM(r.estimated_minutes), 0)::int AS estimated_minutes,
        EXISTS(SELECT 1 FROM quizzes q WHERE q.topic_id = top.id) AS has_quiz,
        EXISTS(
          SELECT 1 FROM quizzes q 
          JOIN quiz_attempts qa ON q.id = qa.quiz_id 
          WHERE q.topic_id = top.id AND qa.user_id = $1 AND qa.passed = true
        ) AS quiz_passed
      FROM topics top
      JOIN track_topics tt ON top.id = tt.topic_id
      LEFT JOIN user_progress up ON top.id = up.topic_id AND up.user_id = $1
      LEFT JOIN resources r ON top.id = r.topic_id
      WHERE tt.track_id = ANY($2::int[])
      GROUP BY top.id, top.name, top.slug, top.description, top.subtrack, tt.track_id, tt.topic_order, up.status
      ORDER BY tt.track_id ASC, tt.topic_order ASC;
    `;

    const topicsResult = await pool.query(topicsQuery, [userId, allQueryTrackIds]);
    const trackMap = new Map(tracks.map((t) => [t.id, t]));

    topicsResult.rows.forEach((topic) => {
      const topicObj = {
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        subtrack: topic.subtrack,
        order: topic.topic_order,
        status: topic.status,
        estimatedMinutes: topic.estimated_minutes,
        hasQuiz: Boolean(topic.has_quiz),
        quizPassed: Boolean(topic.quiz_passed),
      };

      const subTrack = subTrackMap.get(topic.track_id);
      if (subTrack) {
        subTrack.topics.push(topicObj);
        // Also aggregate into parent track topics for overall path counting
        const parentTrack = trackMap.get(subTrack.parentTrackId);
        if (parentTrack && !parentTrack.topics.some((tp) => tp.id === topic.id)) {
          parentTrack.topics.push(topicObj);
        }
      } else {
        const track = trackMap.get(topic.track_id);
        if (track) {
          track.topics.push(topicObj);
        }
      }
    });

    // Calculate metrics for sub-tracks
    subTracks.forEach((st) => {
      const total = st.topics.length;
      const completed = st.topics.filter((tp) => tp.status === "completed").length;
      st.totalTopics = total;
      st.topics_count = total;
      st.completedTopics = completed;
      st.progressPercentage = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0;
    });

    // Attach sub_tracks to their respective parent tracks
    tracks.forEach((track) => {
      const children = subTracks.filter((st) => st.parentTrackId === track.id);
      track.sub_tracks = children;
      track.subTracks = children;
    });

    // 4. Calculate dynamic track metrics and overall path progress
    let totalPathTopics = 0;
    let completedPathTopics = 0;

    tracks.forEach((track) => {
      const total = track.topics.length;
      const completed = track.topics.filter((top) => top.status === "completed").length;
      const progressPercentage = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0;

      track.totalTopics = total;
      track.completedTopics = completed;
      track.progressPercentage = progressPercentage;

      totalPathTopics += total;
      completedPathTopics += completed;
    });

    const overallProgress =
      totalPathTopics > 0 ? Math.round((completedPathTopics / totalPathTopics) * 1000) / 10 : 0;

    return res.status(200).json({
      success: true,
      hasSelectedPath: true,
      path: pathInfo,
      totalTopics: totalPathTopics,
      completedTopics: completedPathTopics,
      overallProgress,
      tracks,
      roadmap: {
        path: pathInfo,
        tracks,
      },
    });
  } catch (err) {
    console.error("Error fetching user roadmap:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// GET /api/user/readiness or GET /api/readiness — Composite Job Role Readiness Breakdown
const getUserReadiness = async (req, res) => {
  const userId = req.user.id;
  try {
    const readiness = await calculateUserReadiness(userId);
    return res.status(200).json({
      success: true,
      ...readiness,
    });
  } catch (err) {
    console.error("Error calculating user readiness:", err);
    return res.status(500).json({ error: "Failed to calculate job role readiness." });
  }
};

module.exports = {
  getAllPaths,
  getPathById,
  getAllTracks,
  getTrackTopics,
  selectUserPath,
  getUserPath,
  getUserRoadmap,
  getUserReadiness,
};
