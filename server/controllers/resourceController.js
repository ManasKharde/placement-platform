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

function determinePillar(trackSlug, trackName, topicSlug, topicName) {
  const tTrack = `${trackSlug || ""} ${trackName || ""}`.toLowerCase();
  const tTopic = `${topicSlug || ""} ${topicName || ""}`.toLowerCase();

  // 1. Problem Solving (DSA)
  if (
    tTrack.includes("data-structures") ||
    tTrack.includes("dsa") ||
    tTrack.includes("algo") ||
    tTrack.includes("problem solving") ||
    tTopic.includes("dsa") ||
    tTopic.includes("algo") ||
    tTopic.includes("array") ||
    tTopic.includes("pointer") ||
    tTopic.includes("sliding window") ||
    tTopic.includes("linked-list") ||
    tTopic.includes("tree") ||
    tTopic.includes("leetcode")
  ) {
    return {
      key: "dsa",
      name: "Pillar 2: Problem Solving (DSA)",
      badge: "Coding Interview Rounds",
    };
  }

  // 2. CS Fundamentals
  if (
    tTrack.includes("core-computer-science") ||
    tTrack.includes("computer science") ||
    tTrack.includes("cs fundamentals") ||
    tTopic.includes("os-") ||
    tTopic.includes("operating system") ||
    tTopic.includes("concurrency") ||
    tTopic.includes("deadlock") ||
    tTopic.includes("virtual memory") ||
    tTopic.includes("networks-tcp") ||
    tTopic.includes("dbms-acid")
  ) {
    return {
      key: "cs",
      name: "Pillar 3: CS Fundamentals",
      badge: "Technical Screening Core",
    };
  }

  // 3. Aptitude & SQL
  if (
    tTrack.includes("quantitative") ||
    tTrack.includes("aptitude") ||
    tTopic.includes("quantitative") ||
    tTopic.includes("speed-distance") ||
    tTopic.includes("relational-sql") ||
    tTrack.includes("database-engineering") ||
    tTopic.includes("schema-design")
  ) {
    return {
      key: "apt_sql",
      name: "Pillar 4: Aptitude & SQL",
      badge: "Placement Test Essentials",
    };
  }

  return {
    key: "dev",
    name: "Pillar 1: Development",
    badge: "Core Engineering",
  };
}

// GET /api/topics/:id — Fetch full topic metadata, theory, resources, and evaluation tasks
const getTopicDetail = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid topic ID format." });
  }

  try {
    const query = `
      SELECT 
        t.id,
        t.name,
        t.slug,
        t.description,
        t.subtrack,
        t.summary_markdown,
        t.theory_summary,
        t.doc_links,
        t.video_links,
        t.practice_items,
        tr.id AS track_id,
        tr.name AS track_name,
        tr.slug AS track_slug,
        pp.id AS path_id,
        pp.name AS path_name,
        pp.slug AS path_slug,
        COALESCE(SUM(r.estimated_minutes), 0)::int AS estimated_minutes,
        COALESCE(up.status, 'not_started') AS status,
        up.completed_at
      FROM topics t
      LEFT JOIN track_topics tt ON t.id = tt.topic_id
      LEFT JOIN tracks tr ON tt.track_id = tr.id
      LEFT JOIN path_tracks pt ON tr.id = pt.track_id
      LEFT JOIN preparation_paths pp ON pt.path_id = pp.id
      LEFT JOIN resources r ON t.id = r.topic_id
      LEFT JOIN user_progress up ON t.id = up.topic_id AND up.user_id = $2
      WHERE t.id = $1
      GROUP BY 
        t.id, t.name, t.slug, t.description, t.subtrack, t.summary_markdown, t.theory_summary, t.doc_links, 
        t.video_links, t.practice_items, tr.id, tr.name, tr.slug, pp.id, pp.name, pp.slug, 
        up.status, up.completed_at
      LIMIT 1;
    `;

    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Topic not found." });
    }

    const row = result.rows[0];
    const pillar = determinePillar(row.track_slug, row.track_name, row.slug, row.name);

    // Also fetch associated resources from resources table to supplement if needed
    const resourcesRes = await pool.query(
      `SELECT id, title, url, resource_type, estimated_minutes 
       FROM resources WHERE topic_id = $1 ORDER BY id ASC`,
      [id]
    );

    let docLinks = Array.isArray(row.doc_links) ? row.doc_links : [];
    let videoLinks = Array.isArray(row.video_links) ? row.video_links : [];

    // Fallback: If docLinks is empty, pull documentation/article resources
    if (docLinks.length === 0) {
      docLinks = resourcesRes.rows
        .filter((r) => r.resource_type === "documentation" || r.resource_type === "article")
        .map((r) => ({ title: r.title, url: r.url }));
    }

    // Fallback: If videoLinks is empty, pull video resources
    if (videoLinks.length === 0) {
      videoLinks = resourcesRes.rows
        .filter((r) => r.resource_type === "video")
        .map((r) => ({
          title: r.title,
          url: r.url,
          duration: `${r.estimated_minutes || 20}m`,
        }));
    }

    // Default theory summary if empty
    const theorySummary =
      row.summary_markdown ||
      row.theory_summary ||
      `### 🎯 ${row.name}\n\n${row.description || "Core placement module designed for engineering preparation."}\n\n- Master foundational principles and core architecture.\n- Practice production implementations and boundary edge-cases.\n- Prepare for technical interview discussion points.`;

    const topicData = {
      id: row.id,
      title: row.name,
      name: row.name,
      slug: row.slug,
      subtrack: row.subtrack,
      description: row.description,
      estimated_minutes: row.estimated_minutes || 45,
      status: row.status,
      completed_at: row.completed_at,
      track_id: row.track_id,
      track_name: row.track_name || "Engineering Track",
      track_slug: row.track_slug,
      path_id: row.path_id,
      path_name: row.path_name,
      pillar_name: pillar.name,
      pillar: pillar,
      summary_markdown: row.summary_markdown || theorySummary,
      theory_summary: theorySummary,
      doc_links: docLinks,
      video_links: videoLinks,
      practice_items: Array.isArray(row.practice_items) ? row.practice_items : [],
      resources: resourcesRes.rows,
    };

    return res.status(200).json({
      topic: topicData,
    });
  } catch (err) {
    console.error("Error fetching topic detail:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getTopicResources,
  getTopicDetail,
};
