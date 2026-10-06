const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function inspectDevTracks() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT t.id, t.slug, t.name, t.title, t.track_order, COUNT(tt.topic_id) as topic_count
      FROM tracks t
      LEFT JOIN track_topics tt ON t.id = tt.track_id
      GROUP BY t.id, t.slug, t.name, t.title, t.track_order
      ORDER BY t.id;
    `);
    for (const r of res.rows) {
      console.log(`[ID:${r.id}] slug="${r.slug}" | name="${r.name}" | topics=${r.topic_count}`);
    }

    // Inspect topics in tracks related to node or express
    const topicsRes = await client.query(`
      SELECT t.id, t.slug, t.name, t.title, t.track_id, tt.track_id as tt_track_id, tt.topic_order
      FROM topics t
      LEFT JOIN track_topics tt ON t.id = tt.topic_id
      WHERE t.track_id IN (3, 18, 24) OR t.slug LIKE '%node%' OR t.slug LIKE '%express%'
      ORDER BY t.track_id, tt.topic_order;
    `);
    console.log('\n--- TOPICS IN NODE/EXPRESS TRACKS ---');
    for (const top of topicsRes.rows) {
      console.log(`  Topic [ID:${top.id}] track_id=${top.track_id} tt_track_id=${top.tt_track_id} order=${top.topic_order} slug="${top.slug}" title="${top.title}"`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

inspectDevTracks();
