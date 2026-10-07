const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function finalRoadmapVerify() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFICATION: TRACKS TABLE (ORDER 1 THROUGH 8) ===');
    const tracksRes = await client.query(`
      SELECT id, name, title, slug, track_order 
      FROM tracks 
      WHERE id IN (25, 660, 708, 24, 709, 28, 22, 27)
      ORDER BY track_order ASC;
    `);
    console.table(tracksRes.rows);

    console.log('\n=== VERIFICATION: PATH_TRACKS (NODE.JS BACKEND DEVELOPER - PATH 3) ===');
    const path3Res = await client.query(`
      SELECT 
        pt.track_order,
        t.id AS track_id,
        COALESCE(t.name, t.title) AS track_name,
        t.slug AS track_slug,
        t.evaluation_type,
        t.total_topics
      FROM path_tracks pt
      JOIN tracks t ON pt.track_id = t.id
      WHERE pt.path_id = 3
      ORDER BY pt.track_order ASC;
    `);
    console.table(path3Res.rows);

    console.log('\n=== VERIFICATION: EXACT USER ROADMAP QUERY (USER ID 1) ===');
    const userRoadmap = await client.query(`
      SELECT 
        pp.name AS path_name,
        t.id AS track_id,
        COALESCE(t.name, t.title) AS track_name,
        t.slug AS track_slug,
        t.evaluation_type,
        COALESCE(pt.track_order, t.track_order, 1) AS track_order
      FROM user_preparation_paths upp
      JOIN preparation_paths pp ON upp.path_id = pp.id AND pp.is_active = true
      JOIN path_tracks pt ON pp.id = pt.path_id
      JOIN tracks t ON pt.track_id = t.id
      WHERE upp.user_id = 1 AND t.parent_track_id IS NULL
      ORDER BY COALESCE(pt.track_order, t.track_order, 1) ASC;
    `);
    console.table(userRoadmap.rows);

  } finally {
    client.release();
    process.exit(0);
  }
}

finalRoadmapVerify();
