const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function fixAllPreparationPaths() {
  const client = await pool.connect();
  try {
    console.log('--- Mapping "Databases" Track Across All Preparation Paths ---');
    await client.query('BEGIN');

    // 1. Find the Databases parent track and its sub-tracks
    const dbTrackRes = await client.query(`SELECT id FROM tracks WHERE slug = 'databases' LIMIT 1;`);
    if (dbTrackRes.rows.length === 0) {
      throw new Error('Databases parent track not found!');
    }
    const databasesTrackId = dbTrackRes.rows[0].id;

    // Ensure PostgreSQL (654) and MongoDB (655) have parent_track_id = databasesTrackId
    await client.query(`
      UPDATE tracks SET parent_track_id = $1, track_order = 1 WHERE slug = 'postgresql-mastery';
    `, [databasesTrackId]);
    await client.query(`
      UPDATE tracks SET parent_track_id = $1, track_order = 2 WHERE slug = 'mongodb-mastery';
    `, [databasesTrackId]);

    // Remove child sub-tracks from top-level path_tracks if present
    await client.query(`
      DELETE FROM path_tracks 
      WHERE track_id IN (SELECT id FROM tracks WHERE parent_track_id IS NOT NULL);
    `);

    // 2. Get all preparation paths
    const pathsRes = await client.query(`SELECT id, name FROM preparation_paths ORDER BY id ASC;`);

    for (const prepPath of pathsRes.rows) {
      // Step A: Temporarily set track_order = -id to avoid unique_path_track_order collision
      await client.query(`UPDATE path_tracks SET track_order = -id WHERE path_id = $1;`, [prepPath.id]);

      // Ensure Databases parent track is linked to this preparation path
      await client.query(`
        INSERT INTO path_tracks (path_id, track_id, track_order)
        VALUES ($1, $2, -9999)
        ON CONFLICT (path_id, track_id) DO UPDATE SET track_order = -9999;
      `, [prepPath.id, databasesTrackId]);

      // Enforce consistent ordering across all tracks in this path:
      // 1: DSA (25)
      await client.query(`UPDATE path_tracks SET track_order = 1 WHERE path_id = $1 AND track_id = 25;`, [prepPath.id]);
      // 2: Databases (660)
      await client.query(`UPDATE path_tracks SET track_order = 2 WHERE path_id = $1 AND track_id = $2;`, [prepPath.id, databasesTrackId]);
      // 3: Development (24 or 18)
      await client.query(`UPDATE path_tracks SET track_order = 3 WHERE path_id = $1 AND track_id IN (24, 18);`, [prepPath.id]);
      // 4: Aptitude (27)
      await client.query(`UPDATE path_tracks SET track_order = 4 WHERE path_id = $1 AND track_id = 27;`, [prepPath.id]);
      // 5: System Design (28)
      await client.query(`UPDATE path_tracks SET track_order = 5 WHERE path_id = $1 AND track_id = 28;`, [prepPath.id]);

      // For any other tracks in this path (e.g. Core CS or legacy tracks), assign sequential orders starting at 6
      const remainingRes = await client.query(`
        SELECT id, track_id FROM path_tracks 
        WHERE path_id = $1 AND track_order < 0
        ORDER BY id ASC;
      `, [prepPath.id]);

      let nextOrder = 6;
      for (const rem of remainingRes.rows) {
        await client.query(`UPDATE path_tracks SET track_order = $1 WHERE id = $2;`, [nextOrder++, rem.id]);
      }

      console.log(`Updated path_tracks ordering for path: "${prepPath.name}" (ID: ${prepPath.id})`);
    }

    // Also update global track_order on tracks table
    await client.query(`UPDATE tracks SET track_order = 1 WHERE id = 25;`);
    await client.query(`UPDATE tracks SET track_order = 2 WHERE id = $1;`, [databasesTrackId]);
    await client.query(`UPDATE tracks SET track_order = 3 WHERE id IN (24, 18);`);
    await client.query(`UPDATE tracks SET track_order = 4 WHERE id = 27;`);
    await client.query(`UPDATE tracks SET track_order = 5 WHERE id = 28;`);
    await client.query(`UPDATE tracks SET track_order = 6 WHERE id NOT IN (25, $1, 24, 18, 27, 28) AND parent_track_id IS NULL;`, [databasesTrackId]);

    await client.query('COMMIT');
    console.log('--- All Preparation Paths Updated Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating preparation paths:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

fixAllPreparationPaths();
