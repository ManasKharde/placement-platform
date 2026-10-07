const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verifyTracks() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFYING TRACK COUNTS AND APTITUDE TRACK ARCHITECTURE ===\n');

    // 1. Aptitude track check
    const aptRes = await client.query(`
      SELECT 
        t.id, 
        t.title, 
        t.name, 
        t.slug, 
        t.description,
        (SELECT COUNT(*) FROM topics top WHERE top.track_id = t.id) AS topic_count_direct,
        (SELECT COUNT(*) FROM track_topics tt WHERE tt.track_id = t.id) AS topic_count_tt
      FROM tracks t
      WHERE t.id = 27 OR t.slug = 'aptitude';
    `);

    console.log('--- APTITUDE TRACK ---');
    console.table(aptRes.rows);

    const aptTrack = aptRes.rows[0];
    if (!aptTrack) {
      throw new Error('❌ Aptitude track not found!');
    }
    if (aptTrack.title !== 'Aptitude' || aptTrack.slug !== 'aptitude') {
      throw new Error(`❌ Aptitude track title/slug mismatch! Found title: ${aptTrack.title}, slug: ${aptTrack.slug}`);
    }
    if (parseInt(aptTrack.topic_count_direct, 10) !== 0 || parseInt(aptTrack.topic_count_tt, 10) !== 0) {
      throw new Error(`❌ Aptitude track is not empty! Found direct: ${aptTrack.topic_count_direct}, tt: ${aptTrack.topic_count_tt}`);
    }
    console.log('✅ Aptitude track verified: Title="Aptitude", Slug="aptitude", Total Topics=0\n');

    // 2. Check all protected tracks
    const protectedTracks = [
      { name: 'DSA', track_id: 25, slug: 'problem-solving-dsa-sql', expected: 315 },
      { name: 'PostgreSQL', track_id: 654, slug: 'postgresql-mastery', expected: 26 },
      { name: 'MongoDB', track_id: 655, slug: 'mongodb-mastery', expected: 33 },
      { name: 'JavaScript', track_id: 708, slug: 'javascript-mastery', expected: 22 },
      { name: 'Development / Node.js', track_id: 24, slug: 'nodejs-express-architecture', expected: 22 },
      { name: 'Core Computer Science', track_id: 22, slug: 'core-computer-science-fundamentals', expected: 4 }
    ];

    console.log('--- COMPLETED TRACKS VERIFICATION ---');
    let allPassed = true;

    for (const pt of protectedTracks) {
      const res = await client.query(`
        SELECT 
          t.id, 
          t.title, 
          t.slug,
          (SELECT COUNT(*) FROM topics top WHERE top.track_id = t.id) AS topic_count_direct,
          (SELECT COUNT(*) FROM track_topics tt WHERE tt.track_id = t.id) AS topic_count_tt
        FROM tracks t
        WHERE t.id = $1;
      `, [pt.track_id]);

      const row = res.rows[0];
      const count = row ? Math.max(parseInt(row.topic_count_direct, 10), parseInt(row.topic_count_tt, 10)) : 0;
      const isMatch = count === pt.expected;
      if (!isMatch) allPassed = false;

      console.log(
        `${isMatch ? '✅' : '❌'} ${pt.name.padEnd(25)} [ID: ${String(pt.track_id).padEnd(4)}] Expected: ${String(pt.expected).padStart(3)}, Found Direct: ${String(row?.topic_count_direct).padStart(3)}, Found TT: ${String(row?.topic_count_tt).padStart(3)}`
      );
    }

    if (!allPassed) {
      throw new Error('❌ One or more completed tracks did not match expected counts!');
    }

    console.log('\n✅ All completed tracks remain 100% untouched and match exact topic counts!');

    // 3. Check path_tracks for Aptitude
    const pathTracksRes = await client.query(`
      SELECT pt.path_id, p.name as path_name, pt.track_id, t.name as track_name, t.slug, pt.track_order
      FROM path_tracks pt
      JOIN tracks t ON pt.track_id = t.id
      JOIN preparation_paths p ON pt.path_id = p.id
      WHERE t.id = 27
      ORDER BY pt.path_id;
    `);

    console.log('\n--- PATH_TRACKS MAPPINGS FOR APTITUDE ---');
    console.table(pathTracksRes.rows);

  } catch (err) {
    console.error('Verification failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyTracks();
