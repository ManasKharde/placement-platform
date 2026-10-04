const pool = require("../config/db");

const seedModularTracks = async () => {
  console.log("🚀 Starting Dynamic Modular Tracks & Unified DSA+SQL Migration...");

  // 1. Ensure evaluation_type column exists on tracks
  await pool.query(`
    ALTER TABLE tracks 
    ADD COLUMN IF NOT EXISTS evaluation_type VARCHAR(50) DEFAULT 'practice';
  `);
  console.log("✅ Column 'evaluation_type' verified on tracks table.");

  // 2. Define the unified modular tracks
  const modularTracks = [
    {
      name: "Node.js & Express Architecture",
      slug: "nodejs-express-architecture",
      description: "Event Loop concurrency, streams, Express middleware pipeline, input validation, authentication, and REST API design.",
      evaluationType: "practice",
      trackOrder: 1,
      topicSlugs: [
        "event-loop-libuv-concurrency",
        "streams-buffers-fs",
        "event-emitter-process-errors",
        "middleware-pipeline-lifecycle",
        "validation-sanitization-security",
        "standardized-error-handling",
        "bcrypt-hashing-salting",
        "jwt-rotation-http-cookies",
        "google-oauth2-passport",
      ],
    },
    {
      name: "Problem Solving: DSA & SQL",
      slug: "problem-solving-dsa-sql",
      description: "Algorithmic data structures, problem-solving patterns, and advanced relational query optimization.",
      evaluationType: "practice",
      trackOrder: 2,
      // Note: Topic population is delegated to dedicated batch seeders (seed_dsa_batch_*.js)
    },
    {
      name: "Core Computer Science",
      slug: "core-computer-science-fundamentals",
      description: "Operating Systems concurrency, virtual memory, DBMS internals, indexing, and Computer Networks protocols.",
      evaluationType: "quiz",
      trackOrder: 3,
      topicSlugs: [
        "os-concurrency-deadlocks-memory",
        "dbms-acid-indexing-transactions",
        "networks-tcp-http-websockets-dns",
      ],
    },
    {
      name: "Quantitative Aptitude & Logical Reasoning",
      slug: "quantitative-aptitude-logical-reasoning",
      description: "Preliminary campus placement screening tests, time-speed-distance, work efficiency, and logic puzzles.",
      evaluationType: "quiz",
      trackOrder: 4,
      topicSlugs: [
        "quantitative-aptitude-speed-distance-work",
      ],
    },
    {
      name: "System Design & Deployment",
      slug: "system-design-deployment",
      description: "Distributed caching with Redis, message queues, background job processing, and horizontal scalability.",
      evaluationType: "practice",
      trackOrder: 5,
      topicSlugs: [
        "redis-caching-patterns",
        "message-queues-background-jobs",
        "scalability-load-balancing",
      ],
    },
  ];

  // 3. Upsert each track and re-link its topics in track_topics
  const seededTrackMap = new Map();

  for (const trackDef of modularTracks) {
    const trackRes = await pool.query(
      `INSERT INTO tracks (name, slug, description, evaluation_type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         evaluation_type = EXCLUDED.evaluation_type
       RETURNING id, name, slug, evaluation_type;`,
      [trackDef.name, trackDef.slug, trackDef.description, trackDef.evaluationType]
    );

    const track = trackRes.rows[0];
    seededTrackMap.set(track.slug, { ...track, trackOrder: trackDef.trackOrder });

    // For tracks that delegate topic population (e.g. problem-solving-dsa-sql),
    // skip wiping or managing track_topics here so batch seeders remain authoritative.
    if (!trackDef.topicSlugs || trackDef.slug === "problem-solving-dsa-sql") {
      console.log(`✅ Track ensured: "${track.name}" (${trackDef.evaluationType}) — topic management delegated to batch seeders.`);
      continue;
    }

    // Clear old track_topics for this track to rebuild cleanly
    await pool.query("DELETE FROM track_topics WHERE track_id = $1", [track.id]);

    let topicOrder = 1;
    for (const slug of trackDef.topicSlugs) {
      const topicRes = await pool.query(
        "SELECT id, name FROM topics WHERE slug = $1 LIMIT 1",
        [slug]
      );

      if (topicRes.rows.length > 0) {
        const topic = topicRes.rows[0];
        await pool.query(
          `INSERT INTO track_topics (track_id, topic_id, topic_order)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING;`,
          [track.id, topic.id, topicOrder]
        );
        topicOrder++;
      } else {
        console.warn(`⚠️ Topic slug '${slug}' not found for track '${track.name}'.`);
      }
    }

    console.log(`✅ Track configured: "${track.name}" (${trackDef.evaluationType}) with ${topicOrder - 1} topics.`);
  }

  // 4. Link modular tracks to active path "Node.js Backend Developer"
  const pathRes = await pool.query(
    `SELECT id, name FROM preparation_paths 
     WHERE slug = 'nodejs-backend-developer' 
        OR name ILIKE '%Node.js Backend Developer%' 
     LIMIT 1;`
  );

  if (pathRes.rows.length > 0) {
    const pathId = pathRes.rows[0].id;
    console.log(`\n📌 Linking modular tracks to Path: "${pathRes.rows[0].name}" (ID: ${pathId})`);

    // Clear old path_tracks for this path
    await pool.query("DELETE FROM path_tracks WHERE path_id = $1", [pathId]);

    // Insert 5 tracks in order
    for (const trackDef of modularTracks) {
      const track = seededTrackMap.get(trackDef.slug);
      if (track) {
        await pool.query(
          `INSERT INTO path_tracks (path_id, track_id, track_order)
           VALUES ($1, $2, $3);`,
          [pathId, track.id, trackDef.trackOrder]
        );
      }
    }
    console.log("✅ Successfully linked all 5 modular tracks to Node.js Backend Developer path.");
  } else {
    console.warn("⚠️ Path 'Node.js Backend Developer' not found.");
  }

  // 5. Ensure all existing tracks have evaluation_type populated
  await pool.query(`
    UPDATE tracks 
    SET evaluation_type = CASE 
      WHEN slug ILIKE '%quiz%' OR slug ILIKE '%cs%' OR slug ILIKE '%aptitude%' OR slug ILIKE '%computer-science%' THEN 'quiz'
      ELSE 'practice'
    END
    WHERE evaluation_type IS NULL;
  `);

  console.log("🎉 Dynamic Modular Tracks & Unified DSA+SQL Seeding Completed Successfully!");
};

if (require.main === module) {
  seedModularTracks()
    .then(() => pool.end())
    .catch((err) => {
      console.error("Migration failed:", err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { seedModularTracks };
