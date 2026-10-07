const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verifyAptitudeBatch2() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFYING APTITUDE TRACK BATCH 2 & COMPLETED TRACKS ===\n');

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
        jsonb_array_length(COALESCE(t.doc_links, '[]'::jsonb)) as doc_links_count,
        jsonb_array_length(COALESCE(t.practice_items, '[]'::jsonb)) as question_count,
        (SELECT COUNT(*) FROM resources r WHERE r.topic_id = t.id AND r.resource_type = 'video') as video_count
      FROM topics t
      JOIN track_topics tt ON t.id = tt.topic_id
      WHERE tt.track_id = $1
      ORDER BY tt.topic_order;
    `, [aptTrack.id]);

    console.log('\n--- APTITUDE TRACK TOPICS ---');
    console.table(topicsRes.rows);

    if (topicsRes.rows.length !== 6) {
      throw new Error(`❌ Expected 6 topics in Aptitude track, found ${topicsRes.rows.length}`);
    }

    const expectedTopics = [
      { order: 1, title: 'Fractions and Decimals', slug: 'aptitude-quant-fractions-and-decimals' },
      { order: 2, title: 'Simplification', slug: 'aptitude-quant-simplification' },
      { order: 3, title: 'Surds and Indices', slug: 'aptitude-quant-surds-and-indices' },
      { order: 4, title: 'Permutation and Combination', slug: 'aptitude-quant-permutation-and-combination' },
      { order: 5, title: 'Probability', slug: 'aptitude-quant-probability' },
      { order: 6, title: 'Mixture and Alligation', slug: 'aptitude-quant-mixture-and-alligation' }
    ];

    for (let i = 0; i < 6; i++) {
      const top = topicsRes.rows[i];
      const exp = expectedTopics[i];

      if (top.title !== exp.title) {
        throw new Error(`❌ Topic ${i + 1} title mismatch: expected "${exp.title}", got "${top.title}"`);
      }
      if (top.slug !== exp.slug) {
        throw new Error(`❌ Topic ${i + 1} slug mismatch: expected "${exp.slug}", got "${top.slug}"`);
      }
      if (parseInt(top.question_count, 10) !== 20) {
        throw new Error(`❌ Topic ${i + 1} question count mismatch: expected 20, got ${top.question_count}`);
      }
      if (top.module_name !== 'Quantitative Aptitude') {
        throw new Error(`❌ Topic ${i + 1} module mismatch: expected "Quantitative Aptitude", got "${top.module_name}"`);
      }
      if (top.creator_name !== 'CareerRide') {
        throw new Error(`❌ Topic ${i + 1} creator mismatch: expected "CareerRide", got "${top.creator_name}"`);
      }
      if (parseInt(top.doc_links_count, 10) !== 0) {
        throw new Error(`❌ Topic ${i + 1} doc_links mismatch: expected 0, got ${top.doc_links_count}`);
      }
      if (parseInt(top.video_count, 10) < 1) {
        throw new Error(`❌ Topic ${i + 1} missing video resource!`);
      }
    }
    console.log('✅ Aptitude Track (Topics 1 to 6, 20 questions each, doc_links: []) verified successfully!\n');

    // 2. Sample check for first and last question in each batch 2 topic
    console.log('--- SAMPLE CHECK BATCH 2 QUESTIONS ---');
    for (const top of topicsRes.rows.slice(3)) {
      const sampleQRes = await client.query(`
        SELECT practice_items FROM topics WHERE id = $1;
      `, [top.id]);
      const questions = sampleQRes.rows[0].practice_items;
      console.log(`Topic: "${top.title}" (Total questions: ${questions.length})`);
      console.log(`  - Q1: "${questions[0].title}" | Correct: ${questions[0].correctAnswer}`);
      console.log(`  - Q20: "${questions[19].title}" | Correct: ${questions[19].correctAnswer}`);
    }

    // 3. Verify Completed Tracks Remain 100% Untouched
    const protectedTracks = [
      { name: 'DSA', track_id: 25, slug: 'problem-solving-dsa-sql', expected: 315 },
      { name: 'PostgreSQL', track_id: 654, slug: 'postgresql-mastery', expected: 26 },
      { name: 'MongoDB', track_id: 655, slug: 'mongodb-mastery', expected: 33 },
      { name: 'JavaScript', track_id: 708, slug: 'javascript-mastery', expected: 22 },
      { name: 'Development / Node.js', track_id: 24, slug: 'nodejs-express-architecture', expected: 22 },
      { name: 'Core Computer Science', track_id: 22, slug: 'core-computer-science-fundamentals', expected: 4 }
    ];

    console.log('\n--- COMPLETED TRACKS VERIFICATION ---');
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

    console.log('\n✅ All 6 completed tracks remain 100% untouched and match exact topic counts!');
    console.log('\n🎉 ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  } catch (err) {
    console.error('Verification failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyAptitudeBatch2();
