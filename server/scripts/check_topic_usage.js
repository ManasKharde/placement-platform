const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function checkTopicUsage() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT tt.track_id, t.name as track_name, tt.topic_id, top.name as topic_name, top.slug
      FROM track_topics tt
      JOIN tracks t ON tt.track_id = t.id
      JOIN topics top ON tt.topic_id = top.id
      WHERE tt.topic_id IN (3, 4, 5, 6, 7, 8, 12, 13, 14)
      ORDER BY tt.topic_id, tt.track_id;
    `);
    console.table(res.rows);

    const tracks24 = await client.query(`SELECT * FROM tracks WHERE id = 24;`);
    console.log('Track 24 row:', tracks24.rows[0]);

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

checkTopicUsage();
