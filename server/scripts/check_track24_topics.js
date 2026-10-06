const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function checkTrack24Topics() {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT id, name, slug, track_id FROM topics WHERE track_id = 24;`);
    console.log('Topics with track_id = 24:', res.rows);

    const ttRes = await client.query(`
      SELECT tt.topic_id, t.name, t.slug, t.track_id
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = 24;
    `);
    console.log('Topics in track_topics for track 24:', ttRes.rows);
  } finally {
    client.release();
    process.exit(0);
  }
}

checkTrack24Topics();
