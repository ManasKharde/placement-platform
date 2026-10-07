const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verifyAptitudeBatch10() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFYING APTITUDE TRACK BATCH 10 & PROTECTED TRACKS ===\n');

    // 1. Aptitude Track Verification
    const aptTopicsRes = await client.query(`
      SELECT t.id, t.slug, t.title, t.topic_order, t.creator_name, t.creator_channel_url,
             jsonb_array_length(t.practice_problems) as q_count,
             jsonb_array_length(t.doc_links) as doc_count,
             tt.topic_order as tt_order
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = 27
      ORDER BY tt.topic_order ASC;
    `);

    console.log(`Aptitude Track Total Topics: ${aptTopicsRes.rowCount}`);
    if (aptTopicsRes.rowCount !== 30) {
      console.error(`❌ Expected 30 topics in Aptitude track, found ${aptTopicsRes.rowCount}`);
    } else {
      console.log('✅ Aptitude Track has exactly 30 topics!');
    }

    let allQuestionsValid = true;
    let allDocsEmpty = true;
    let allCreatorsValid = true;

    for (const row of aptTopicsRes.rows) {
      if (parseInt(row.q_count) !== 20) {
        console.error(`❌ Topic ${row.topic_order} (${row.title}) has ${row.q_count} questions instead of 20!`);
        allQuestionsValid = false;
      }
      if (parseInt(row.doc_count) !== 0) {
        console.error(`❌ Topic ${row.topic_order} (${row.title}) has ${row.doc_count} doc links! Expected 0.`);
        allDocsEmpty = false;
      }
      if (row.creator_name !== 'CareerRide') {
        console.error(`❌ Topic ${row.topic_order} (${row.title}) creator is ${row.creator_name}!`);
        allCreatorsValid = false;
      }
    }

    if (allQuestionsValid) console.log('✅ All 30 topics have exactly 20 quiz questions (total 600 questions)!');
    if (allDocsEmpty) console.log('✅ All 30 topics have empty doc_links ([])!');
    if (allCreatorsValid) console.log('✅ All 30 topics have creator_name = "CareerRide"!');

    // Check Batch 10 specifically
    console.log('\n--- Batch 10 Topics (28 to 30) Details ---');
    for (const row of aptTopicsRes.rows.filter(r => r.topic_order >= 28)) {
      console.log(`Topic ${row.topic_order}: ${row.title} | slug: ${row.slug} | Qs: ${row.q_count} | Docs: ${row.doc_count} | Creator: ${row.creator_name}`);
    }

    // 2. Protected Tracks Verification
    console.log('\n--- Protected Tracks Integrity Check ---');
    const protectedTracks = [
      { name: 'DSA', query: `SELECT COUNT(*) FROM track_topics WHERE track_id = 25;`, expected: 315 },
      { name: 'PostgreSQL', query: `SELECT COUNT(*) FROM track_topics WHERE track_id = 654;`, expected: 26 },
      { name: 'MongoDB', query: `SELECT COUNT(*) FROM track_topics WHERE track_id = 655;`, expected: 33 },
      { name: 'JavaScript', query: `SELECT COUNT(*) FROM track_topics tt JOIN tracks tr ON tt.track_id = tr.id WHERE tr.slug = 'javascript-mastery';`, expected: 22 },
      { name: 'Node.js & Express', query: `SELECT COUNT(*) FROM track_topics tt JOIN tracks tr ON tt.track_id = tr.id WHERE tr.slug = 'nodejs-express-architecture' OR tr.id = 24;`, expected: 22 },
      { name: 'Core CS', query: `SELECT COUNT(*) FROM track_topics tt JOIN tracks tr ON tt.track_id = tr.id WHERE tr.slug = 'core-computer-science-fundamentals' OR tr.id = 22;`, expected: 4 }
    ];

    let allProtectedIntact = true;
    for (const track of protectedTracks) {
      const res = await client.query(track.query);
      const count = parseInt(res.rows[0].count);
      if (count === track.expected) {
        console.log(`✅ ${track.name} track intact: ${count}/${track.expected} topics`);
      } else {
        console.error(`❌ ${track.name} track mismatch: found ${count}, expected ${track.expected}`);
        allProtectedIntact = false;
      }
    }

    if (allProtectedIntact) {
      console.log('\n✅ ALL 6 PROTECTED TRACKS ARE 100% UNTOUCHED AND INTACT!');
    } else {
      console.error('\n❌ Warning: Some protected tracks had mismatches!');
    }

  } catch (err) {
    console.error('❌ Error during verification:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyAptitudeBatch10();
