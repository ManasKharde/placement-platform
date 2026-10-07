const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verify() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFYING APTITUDE TRACK BATCH 8 & PROTECTED TRACKS ===\n');

    // 1. Check Aptitude Track
    const aptTrackRes = await client.query(`
      SELECT *
      FROM tracks
      WHERE slug = 'aptitude' OR id = 27;
    `);
    console.log('Aptitude Track Record:', aptTrackRes.rows[0]);

    // 2. Check Topics in Aptitude Track
    const aptTopicsRes = await client.query(`
      SELECT 
        tt.topic_order,
        t.id,
        t.title,
        t.slug,
        t.module_name,
        t.creator_name,
        t.creator_channel_url,
        jsonb_array_length(COALESCE(t.doc_links, '[]'::jsonb)) as doc_links_count,
        jsonb_array_length(COALESCE(t.practice_items, '[]'::jsonb)) as practice_count,
        r.url as video_url
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      LEFT JOIN resources r ON r.topic_id = t.id AND r.resource_type = 'video'
      WHERE tt.track_id = $1
      ORDER BY tt.topic_order ASC;
    `, [aptTrackRes.rows[0].id]);

    console.log(`\nFound ${aptTopicsRes.rowCount} topics in Aptitude Track:`);
    let allValid = true;
    for (const row of aptTopicsRes.rows) {
      console.log(`- Topic ${row.topic_order}: "${row.title}" (${row.slug}) | Questions: ${row.practice_count} | Doc links: ${row.doc_links_count} | Creator: ${row.creator_name}`);
      if (row.practice_count !== 20) {
        console.error(`  ❌ Error: Expected 20 questions, got ${row.practice_count}`);
        allValid = false;
      }
      if (row.doc_links_count !== 0) {
        console.error(`  ❌ Error: Expected 0 doc links, got ${row.doc_links_count}`);
        allValid = false;
      }
    }

    if (aptTopicsRes.rowCount !== 24) {
      console.error(`❌ Error: Expected 24 topics in Aptitude track, found ${aptTopicsRes.rowCount}`);
      allValid = false;
    } else {
      console.log('\n✅ Aptitude Track has exactly 24 topics with 20 questions each (480 questions total)!');
    }

    // 3. Verify Protected Tracks
    console.log('\n--- Checking Protected Tracks ---');
    const protectedTracks = [
      { name: 'DSA', query: 'SELECT COUNT(*) FROM track_topics WHERE track_id = 25;', expected: 315 },
      { name: 'PostgreSQL', query: 'SELECT COUNT(*) FROM track_topics WHERE track_id = 654;', expected: 26 },
      { name: 'MongoDB', query: 'SELECT COUNT(*) FROM track_topics WHERE track_id = 655;', expected: 33 },
      { name: 'JavaScript', query: "SELECT COUNT(*) FROM track_topics tt JOIN tracks tr ON tt.track_id = tr.id WHERE tr.slug = 'javascript-mastery';", expected: 22 },
      { name: 'Development / Node.js', query: "SELECT COUNT(*) FROM track_topics tt JOIN tracks tr ON tt.track_id = tr.id WHERE tr.slug = 'nodejs-express-architecture' OR tr.id = 24;", expected: 22 },
      { name: 'Core CS', query: "SELECT COUNT(*) FROM track_topics tt JOIN tracks tr ON tt.track_id = tr.id WHERE tr.slug = 'core-computer-science-fundamentals' OR tr.id = 22;", expected: 4 }
    ];

    for (const pt of protectedTracks) {
      const res = await client.query(pt.query);
      const count = parseInt(res.rows[0].count, 10);
      const ok = count === pt.expected;
      console.log(`- ${pt.name}: ${count} topics (Expected: ${pt.expected}) ${ok ? '✅' : '❌'}`);
      if (!ok) allValid = false;
    }

    if (allValid) {
      console.log('\n🎉 ALL VERIFICATION CHECKS PASSED PERFECTLY!');
    } else {
      console.error('\n❌ SOME VERIFICATION CHECKS FAILED!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Verification error:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

verify();
