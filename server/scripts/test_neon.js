const pool = require('../config/db');

async function testConnection() {
  try {
    console.log('Testing connection to Neon...');
    const res = await pool.query('SELECT NOW() as current_time, version()');
    console.log('SUCCESS! Connected to Neon.');
    console.log('Database Time:', res.rows[0].current_time);
    console.log('Postgres Version:', res.rows[0].version.split(' ')[0], res.rows[0].version.split(' ')[1]);
  } catch (err) {
    console.error('CONNECTION FAILED:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();