const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function inspect() {
  const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'topics' ORDER BY ordinal_position");
  console.log('Topics columns:', cols.rows.map(r => r.column_name).join(', '));
  await pool.end();
}

inspect();
