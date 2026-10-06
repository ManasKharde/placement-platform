const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function inspectUserPaths() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT upp.user_id, u.email, upp.path_id, p.name as path_name
      FROM user_preparation_paths upp
      JOIN users u ON upp.user_id = u.id
      JOIN preparation_paths p ON upp.path_id = p.id;
    `);
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

inspectUserPaths();
