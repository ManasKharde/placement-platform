const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function inspectTracks() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT t.id, t.slug, t.name, t.title, t.track_order, COUNT(tt.topic_id) as topic_count
      FROM tracks t
      LEFT JOIN track_topics tt ON t.id = tt.track_id
      GROUP BY t.id, t.slug, t.name, t.title, t.track_order
      ORDER BY t.id;
    `);
    console.log('--- ALL TRACKS ---');
    console.table(res.rows);

    const pathTracks = await client.query(`
      SELECT pt.path_id, p.name as path_name, pt.track_id, t.name as track_name, t.slug, pt.track_order
      FROM path_tracks pt
      JOIN tracks t ON pt.track_id = t.id
      JOIN preparation_paths p ON pt.path_id = p.id
      ORDER BY pt.path_id, pt.track_order;
    `);
    console.log('\n--- PATH TRACKS MAPPINGS ---');
    console.table(pathTracks.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

inspectTracks();
