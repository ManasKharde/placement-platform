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

  // Databases (PostgreSQL / MongoDB / Relational & Document DBs)
  if (
    tTrack.includes("database") ||
    tTrack.includes("postgres") ||
    tTrack.includes("mongodb") ||
    tTrack.includes("sql-mastery") ||
    tTopic.includes("pg-lecture") ||
    tTopic.includes("mongo-") ||
    tTopic.includes("postgres") ||
    tTopic.includes("mongodb")
  ) {
    return {
      key: "databases",
      name: "Databases",
      badge: "Relational & Document Databases",
    };
  }

  // 3. Aptitude & SQL
  if (
    tTrack.includes("quantitative") ||
    tTrack.includes("aptitude") ||
    tTopic.includes("quantitative") ||
    tTopic.includes("speed-distance") ||
    tTopic.includes("relational-sql") ||
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
        t.short_description,
        t.official_docs_url,
        t.subtrack,
        t.summary_markdown,
        t.theory_summary,
        t.doc_links,
        t.video_links,
        t.practice_items,
        t.creator_name,
        t.creator_channel_url,
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
        t.id, t.name, t.slug, t.description, t.short_description, t.official_docs_url, t.subtrack, t.summary_markdown, t.theory_summary, t.doc_links, 
        t.video_links, t.practice_items, t.creator_name, t.creator_channel_url, tr.id, tr.name, tr.slug, pp.id, pp.name, pp.slug, 
        up.status, up.completed_at
      LIMIT 1;
    `;

    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Topic not found." });
    }

    const row = result.rows[0];
    const pillar = determinePillar(row.track_slug, row.track_name, row.slug, row.name);

    const isDbTrack =
      pillar.key === "databases" ||
      row.track_slug === "postgresql-mastery" ||
      row.track_slug === "mongodb-mastery" ||
      row.track_slug === "databases" ||
      (row.slug && (row.slug.startsWith("pg-") || row.slug.startsWith("mongo-")));

    // Also fetch associated resources from resources table to supplement if needed
    const resourcesRes = await pool.query(
      `SELECT id, title, url, resource_type, estimated_minutes 
       FROM resources WHERE topic_id = $1 ORDER BY id ASC`,
      [id]
    );

    let docLinks = Array.isArray(row.doc_links) ? row.doc_links : [];
    let videoLinks = Array.isArray(row.video_links) ? row.video_links : [];

    // Official Docs logic
    if (isDbTrack) {
      if (row.official_docs_url) {
        const docBrand =
          row.slug?.startsWith("mongo-") || row.track_slug === "mongodb-mastery"
            ? "MongoDB Official Manual"
            : "PostgreSQL Official Documentation";
        docLinks = [
          {
            title: docBrand,
            url: row.official_docs_url,
          },
        ];
      } else if (docLinks.length === 0) {
        // Only use documentation/article resources if they are authentic to this topic
        const dbArticles = resourcesRes.rows
          .filter(
            (r) =>
              (r.resource_type === "documentation" || r.resource_type === "article") &&
              !r.url?.includes("remzi/OSTEP") &&
              !r.url?.includes("geeksforgeeks.org/operating-systems")
          )
          .map((r) => ({ title: r.title, url: r.url }));
        docLinks = dbArticles;
      }
    } else if (docLinks.length === 0) {
      docLinks = resourcesRes.rows
        .filter((r) => r.resource_type === "documentation" || r.resource_type === "article")
        .map((r) => ({ title: r.title, url: r.url }));
    }

    // Fallback: If videoLinks is empty OR contains search query placeholders, prioritize real video from resources
    const hasRealVideo = videoLinks.some((v) => v.url && !v.url.includes("search_query"));
    if (!hasRealVideo) {
      const realVideoRes = resourcesRes.rows.filter(
        (r) => r.resource_type === "video" && !r.url.includes("search_query")
      );
      if (realVideoRes.length > 0) {
        videoLinks = realVideoRes.map((r) => ({
          title: r.title,
          url: r.url,
          duration: `${r.estimated_minutes || 20}m`,
        }));
      }
    }

    // Default theory summary if empty
    const theorySummary =
      row.summary_markdown ||
      row.theory_summary ||
      `### 🎯 ${row.name}\n\n${row.description || "Core placement module designed for engineering preparation."}\n\n- Master foundational principles and core architecture.\n- Practice production implementations and boundary edge-cases.\n- Prepare for technical interview discussion points.`;

    let practiceItems = Array.isArray(row.practice_items) ? row.practice_items : [];

    // Fallback: If practice_items is empty or only has a single generic placeholder assignment,
    // but the resources table has real practice problems, use the resources
    const hasOnlyPlaceholderAssignment =
      practiceItems.length <= 1 &&
      practiceItems[0]?.type === "assignment";

    const practiceResources = resourcesRes.rows.filter(
      (r) => r.resource_type === "practice" || r.resource_type === "problem"
    );

    if (isDbTrack) {
      if (Array.isArray(row.practice_items)) {
        // Filter out any dummy placeholder items
        const validDbProblems = row.practice_items.filter(
          (p) =>
            p &&
            p.title !== "Top 5 Technical Screening Interview Questions" &&
            p.type !== "cs" &&
            p.type !== "assignment"
        );

        practiceItems = validDbProblems.map((p, idx) => {
          const isMongo =
            row.slug?.startsWith("mongo-") ||
            row.track_slug === "mongodb-mastery" ||
            p.url?.includes("mongopractice.online") ||
            p.platform === "MongoPractice";
          const defaultPlatform = isMongo ? "MongoPractice" : "LeetCode";
          const defaultTarget = isMongo ? "MongoPractice using MongoDB" : "LeetCode using PostgreSQL";

          return {
            ...p,
            id: p.id || `${row.slug || "db"}-prob-${idx + 1}`,
            problemId: p.problemId || p.id || `${idx + 1}`,
            title: p.title || p.name || "Practice Problem",
            url: p.url || p.link || p.external_url,
            link: p.url || p.link || p.external_url,
            external_url: p.url || p.link || p.external_url,
            difficulty: p.difficulty || "Easy",
            platform: p.platform || defaultPlatform,
            description: p.description || `Solve "${p.title || p.name}" on ${defaultTarget}.`,
          };
        });
      } else if (practiceResources.length > 0) {
        practiceItems = practiceResources.map((r, idx) => {
          let title = r.title || "Practice Problem";
          let difficulty = r.difficulty || "Medium";

          if (title.includes("(Easy)")) difficulty = "Easy";
          else if (title.includes("(Hard)")) difficulty = "Hard";
          else if (title.includes("(Medium)")) difficulty = "Medium";

          title = title
            .replace(/^\[(LeetCode|GeeksforGeeks|GFG|Practice|MongoPractice)\]\s*/i, "")
            .replace(/\s*\((Easy|Medium|Hard)\)$/i, "")
            .trim();

          const isMongo = r.url?.includes("mongopractice.online") || row.slug?.startsWith("mongo-");
          const platform = isMongo ? "MongoPractice" : "LeetCode";

          return {
            id: `${row.slug || "db"}-prob-${idx + 1}`,
            problemId: `${idx + 1}`,
            title,
            platform,
            difficulty,
            url: r.url,
            link: r.url,
            external_url: r.url,
            description: `Solve "${title}" on ${platform}.`,
          };
        });
      }
    } else if ((practiceItems.length === 0 || hasOnlyPlaceholderAssignment) && practiceResources.length > 0) {
      practiceItems = practiceResources.map((r, idx) => {
        const isGfg = r.url?.includes("geeksforgeeks.org");
        const platform = isGfg ? "GeeksforGeeks" : "LeetCode";

        let title = r.title || "Practice Problem";
        let difficulty = "Medium";

        if (title.includes("(Easy)")) difficulty = "Easy";
        else if (title.includes("(Hard)")) difficulty = "Hard";
        else if (title.includes("(Medium)")) difficulty = "Medium";

        title = title
          .replace(/^\[(LeetCode|GeeksforGeeks|GFG|Practice)\]\s*/i, "")
          .replace(/\s*\((Easy|Medium|Hard)\)$/i, "")
          .trim();

        return {
          title,
          problemId: `${idx + 1}`,
          platform,
          difficulty,
          url: r.url,
          description: `Solve on ${platform}`,
        };
      });
    }

    const topicData = {
      id: row.id,
      title: row.name,
      name: row.name,
      slug: row.slug,
      video_url: videoLinks[0]?.url || null,
      subtrack: row.subtrack,
      description: row.description,
      short_description: row.short_description || row.description,
      official_docs_url: row.official_docs_url || null,
      creator_name: row.creator_name || videoLinks[0]?.creator_name || null,
      creator_channel_url: row.creator_channel_url || videoLinks[0]?.creator_channel_url || null,
      estimated_minutes: row.id === 22262 ? 3775 : (row.estimated_minutes || 45),
      duration: row.id === 22262 ? "62:55:08" : (videoLinks[0]?.duration || null),
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
      practice_items: practiceItems,
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
