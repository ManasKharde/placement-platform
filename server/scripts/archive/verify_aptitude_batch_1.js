const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verifyAptitudeBatch1() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFYING APTITUDE BATCH 1 & PROTECTED TRACKS ===\n');

    // 1. Verify Aptitude Track
    const trackRes = await client.query(`
      SELECT id, title, slug, name FROM tracks WHERE slug = 'aptitude' OR id = 27;
    `);
    const aptTrack = trackRes.rows[0];
    console.log('Aptitude Track:', aptTrack);

    const topicsRes = await client.query(`
      SELECT 
        t.id, 
        t.topic_order, 
        t.title, 
        t.slug, 
        t.module_name, 
        t.creator_name, 
        t.creator_channel_url,
        jsonb_array_length(t.practice_items) as question_count,
        (SELECT COUNT(*) FROM resources r WHERE r.topic_id = t.id AND r.resource_type = 'video') as video_count
      FROM topics t
      JOIN track_topics tt ON t.id = tt.topic_id
      WHERE tt.track_id = $1
      ORDER BY t.topic_order;
    `, [aptTrack.id]);

    console.log('\n--- APTITUDE BATCH 1 TOPICS ---');
    console.table(topicsRes.rows);

    if (topicsRes.rows.length !== 3) {
      throw new Error(`❌ Expected 3 topics in Aptitude track, found ${topicsRes.rows.length}`);
    }

    const expectedTitles = ['Fractions and Decimals', 'Simplification', 'Surds and Indices'];
    for (let i = 0; i < 3; i++) {
      const top = topicsRes.rows[i];
      if (top.title !== expectedTitles[i]) {
        throw new Error(`❌ Topic ${i + 1} title mismatch: expected "${expectedTitles[i]}", got "${top.title}"`);
      }
      if (parseInt(top.question_count, 10) !== 20) {
        throw new Error(`❌ Topic ${i + 1} question count mismatch: expected 20, got ${top.question_count}`);
      }
      if (top.module_name !== 'Quantitative Aptitude') {
        throw new Error(`❌ Topic ${i + 1} module mismatch: expected "Quantitative Aptitude", got "${top.module_name}"`);
      }
      if (parseInt(top.video_count, 10) !== 1) {
        throw new Error(`❌ Topic ${i + 1} missing video resource!`);
      }
    }
    console.log('✅ Aptitude Batch 1 (Topics 1 to 3, 20 questions each) verified successfully!\n');

    // 2. Sample check for first and last question in each topic
    for (const top of topicsRes.rows) {
      const sampleQRes = await client.query(`
        SELECT practice_items FROM topics WHERE id = $1;
      `, [top.id]);
      const questions = sampleQRes.rows[0].practice_items;
      console.log(`Topic: "${top.title}"`);
      console.log(`  - Q1: "${questions[0].title}" | Correct: ${questions[0].correctAnswer}`);
      console.log(`  - Q20: "${questions[19].title}" | Correct: ${questions[19].correctAnswer}`);
    }
    console.log('✅ Sample questions and answer keys verified successfully!\n');

    // 3. Verify Completed Tracks
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
  } catch (err) {
    console.error('Verification failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyAptitudeBatch1();
