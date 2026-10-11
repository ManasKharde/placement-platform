const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = require('../config/db');

(async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update resources table so SUM(r.estimated_minutes) evaluates to 3775
    await client.query(`
      UPDATE resources 
      SET estimated_minutes = 3775 
      WHERE topic_id = 22262;
    `);

    // Ensure duration_minutes column exists on topics, and update both fields + preserve empty practice_items
    await client.query(`
      ALTER TABLE topics ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
    `);

    await client.query(`
      UPDATE topics 
      SET duration_minutes = 3775, estimated_minutes = 3775, practice_items = '[]'::jsonb 
      WHERE id = 22262;
    `);

    await client.query('COMMIT');
    console.log('Database synced successfully: topic 22262 duration set to 3775 mins and practice_items cleared.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating duration:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
})();
