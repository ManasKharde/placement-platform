const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Track Hierarchy & Ordering Migration ---');
    await client.query('BEGIN');

    // 1. Add parent_track_id to tracks table if it does not exist
    await client.query(`
      ALTER TABLE tracks 
      ADD COLUMN IF NOT EXISTS parent_track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
      ADD COLUMN IF NOT EXISTS track_order INTEGER DEFAULT 1;
    `);

    // 2. Upsert the top-level "Databases" track
    const dbTrackRes = await client.query(`
      INSERT INTO tracks (name, title, slug, description, track_order, parent_track_id, is_published)
      VALUES (
        'Databases',
        'Databases',
        'databases',
        'Master relational database engineering, advanced SQL, indexing, and NoSQL document architecture.',
        2,
        NULL,
        true
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = 'Databases',
        title = 'Databases',
        track_order = 2,
        parent_track_id = NULL,
        is_published = true
      RETURNING id;
    `);
    const databasesTrackId = dbTrackRes.rows[0].id;
    console.log(`Top-level "Databases" track configured with ID: ${databasesTrackId}`);

    // 3. Nest PostgreSQL and MongoDB under the "Databases" parent track
    await client.query(`
      UPDATE tracks
      SET parent_track_id = $1, track_order = 1
      WHERE slug = 'postgresql-mastery';
    `, [databasesTrackId]);

    await client.query(`
      UPDATE tracks
      SET parent_track_id = $1, track_order = 2
      WHERE slug = 'mongodb-mastery';
    `, [databasesTrackId]);
    console.log('PostgreSQL and MongoDB nested under parent track "Databases".');

    // Link topics to 654 and 655 if not already linked
    await client.query(`
      INSERT INTO track_topics (track_id, topic_id, topic_order) VALUES
      (654, 9, 1),
      (654, 10, 2),
      (654, 11, 3),
      (654, 51, 4),
      (654, 40, 5),
      (655, 41, 1)
      ON CONFLICT DO NOTHING;
    `);

    // 4. Set exact rank order for all top-level tracks
    // Rank 1: DSA
    await client.query(`
      UPDATE tracks 
      SET track_order = 1, parent_track_id = NULL 
      WHERE slug LIKE '%dsa%' OR slug LIKE '%problem-solving%' OR title ILIKE '%Problem Solving%';
    `);

    // Rank 2: Databases (already set to 2)

    // Rank 3: Development
    await client.query(`
      UPDATE tracks 
      SET track_order = 3, parent_track_id = NULL 
      WHERE (slug LIKE '%dev%' OR slug LIKE '%node%' OR title ILIKE '%Development%' OR title ILIKE '%Full Stack%')
        AND parent_track_id IS NULL;
    `);

    // Rank 4: Quantitative Aptitude & Logical Reasoning
    await client.query(`
      UPDATE tracks 
      SET track_order = 4, parent_track_id = NULL 
      WHERE slug LIKE '%aptitude%' OR title ILIKE '%Aptitude%' OR title ILIKE '%Reasoning%';
    `);

    // Rank 5: System Design & Deployment
    await client.query(`
      UPDATE tracks 
      SET track_order = 5, parent_track_id = NULL 
      WHERE slug LIKE '%system-design%' OR title ILIKE '%System Design%';
    `);

    // 5. Cleanly map path_tracks for Path 3 (Node.js Backend Developer)
    // Remove previous path_tracks for path 3 to rebuild clean unique ordering
    await client.query(`DELETE FROM path_tracks WHERE path_id = 3`);

    // Insert only the exact 5 top-level tracks for Path 3:
    // Rank 1: DSA (track 25)
    // Rank 2: Databases (databasesTrackId)
    // Rank 3: Node.js & Express Architecture (track 24)
    // Rank 4: Quantitative Aptitude & Logical Reasoning (track 27)
    // Rank 5: System Design & Deployment (track 28)
    await client.query(`
      INSERT INTO path_tracks (path_id, track_id, track_order) VALUES
      (3, 25, 1),
      (3, $1, 2),
      (3, 24, 3),
      (3, 27, 4),
      (3, 28, 5)
    `, [databasesTrackId]);

    // Also clean up and map Path 6 (Full Stack Web Developer)
    await client.query(`DELETE FROM path_tracks WHERE path_id = 6`);
    await client.query(`
      INSERT INTO path_tracks (path_id, track_id, track_order) VALUES
      (6, 25, 1),
      (6, $1, 2),
      (6, 18, 3),
      (6, 27, 4),
      (6, 28, 5)
    `, [databasesTrackId]);

    await client.query('COMMIT');
    console.log('--- Migration Completed Successfully ---');

    // Print current top-level tracks and sub-tracks for verification
    const topTracks = await client.query(`
      SELECT id, title, name, slug, track_order 
      FROM tracks 
      WHERE parent_track_id IS NULL 
      ORDER BY track_order ASC;
    `);
    console.log('\nTop-Level Tracks Order:');
    console.table(topTracks.rows);

    const subTracks = await client.query(`
      SELECT id, title, name, slug, parent_track_id, track_order 
      FROM tracks 
      WHERE parent_track_id IS NOT NULL 
      ORDER BY parent_track_id, track_order ASC;
    `);
    console.log('\nNested Sub-Tracks:');
    console.table(subTracks.rows);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();
