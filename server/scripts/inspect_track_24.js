const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function inspectTrack24() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT t.id, t.slug, t.title, t.name, tt.topic_order, t.short_description
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = 24
      ORDER BY tt.topic_order;
    `);
    console.log('--- TOPICS IN TRACK 24 (Node.js & Express Architecture) ---');
    console.table(res.rows);

    const subTracks = await client.query(`
      SELECT * FROM sub_tracks WHERE parent_track_id IN (24, 660, 3) OR sub_track_id IN (24, 3, 5, 6);
    `);
    console.log('--- SUB TRACKS ---');
    console.table(subTracks.rows);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

inspectTrack24();
