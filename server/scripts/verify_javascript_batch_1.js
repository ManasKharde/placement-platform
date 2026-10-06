const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verifyJSBatch1() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFYING JAVASCRIPT TRACK BATCH 1 (LECTURES 1 TO 11) ===\n');

    // 1. Verify Track
    const trackRes = await client.query(`
      SELECT t.id, t.name, t.slug, COUNT(tt.topic_id) AS topic_count
      FROM tracks t
      LEFT JOIN track_topics tt ON tt.track_id = t.id
      WHERE t.slug = 'javascript-mastery'
      GROUP BY t.id, t.name, t.slug;
    `);

    if (trackRes.rows.length === 0) {
      throw new Error("Track 'javascript-mastery' not found in database.");
    }

    const track = trackRes.rows[0];
    console.log(`[1] Track: [ID:${track.id}] "${track.name}" (${track.slug})`);
    console.log(`    Total Topics in Track Topics: ${track.topic_count}`);
    if (parseInt(track.topic_count, 10) !== 11) {
      throw new Error(`Expected 11 topics, found ${track.topic_count}`);
    }

    // 2. Query all 11 topics in order
    const topicsRes = await client.query(`
      SELECT top.id, top.topic_order, top.title, top.short_description,
             top.summary_markdown, top.practice_problems, top.practice_items,
             top.doc_links, top.video_links, top.official_docs_url,
             top.creator_name, top.creator_channel_url
      FROM topics top
      JOIN track_topics tt ON tt.topic_id = top.id
      WHERE tt.track_id = $1
      ORDER BY top.topic_order ASC;
    `, [track.id]);

    console.log(`\n[2] Checking all 11 Topics: found ${topicsRes.rows.length} rows.`);

    for (const top of topicsRes.rows) {
      const order = top.topic_order;
      console.log(`\n--- Verifying Lecture ${order}: "${top.title.substring(0, 60)}..." ---`);

      // Check short_description
      if (!top.short_description || top.short_description.length < 20 || top.short_description.includes('\n')) {
        console.warn(`  [WARN] short_description: "${top.short_description}"`);
      } else {
        console.log(`  ✓ Clean short_description: "${top.short_description.substring(0, 50)}..."`);
      }

      // Check summary_markdown
      const md = top.summary_markdown || '';
      const mdLen = md.length;
      if (mdLen < 800) {
        throw new Error(`Lecture ${order} summary_markdown too short: ${mdLen} chars`);
      }
      if (md.includes('<think>') || md.includes('</think>')) {
        throw new Error(`Lecture ${order} contains <think> tags!`);
      }

      // Check for raw markdown table pipes outside code blocks
      const lines = md.split('\n');
      let inCode = false;
      let tableDividerFound = false;
      let blockquoteFound = false;
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('```')) inCode = !inCode;
        if (!inCode) {
          if (/^\|[-:\s|]+\|$/.test(t)) tableDividerFound = true;
          if (t.startsWith('>')) blockquoteFound = true;
        }
      }
      if (tableDividerFound) {
        throw new Error(`Lecture ${order} contains raw markdown table pipes!`);
      }
      if (blockquoteFound) {
        throw new Error(`Lecture ${order} contains blockquotes!`);
      }
      console.log(`  ✓ Rich summary_markdown: ${mdLen} chars, 0 raw tables, 0 blockquotes, 0 think tags`);

      // Check official docs URL & doc_links
      const docs = Array.isArray(top.doc_links) ? top.doc_links : [];
      if (docs.length === 0 || !docs[0]?.url?.includes('developer.mozilla.org')) {
        throw new Error(`Lecture ${order} missing verified MDN documentation link in doc_links`);
      }
      console.log(`  ✓ MDN Docs: ${docs[0].title} -> ${docs[0].url}`);

      // Check practice items / questions
      const items = Array.isArray(top.practice_items) ? top.practice_items : [];
      const problems = Array.isArray(top.practice_problems) ? top.practice_problems : [];
      if (items.length !== 6 || problems.length !== 6) {
        throw new Error(`Lecture ${order} expected 6 interview questions, found ${items.length}`);
      }

      for (let i = 0; i < items.length; i++) {
        const q = items[i];
        if (!q.title || !q.title.startsWith('Q')) {
          throw new Error(`Lecture ${order} question #${i + 1} title does not start with 'Q': "${q.title}"`);
        }
        if (!q.answer || q.answer.length < 20) {
          throw new Error(`Lecture ${order} question #${i + 1} has empty or short answer`);
        }
        if (!['Easy', 'Medium', 'Hard'].includes(q.difficulty)) {
          throw new Error(`Lecture ${order} question #${i + 1} invalid difficulty: "${q.difficulty}"`);
        }
        if (q.url !== null || q.link !== null) {
          throw new Error(`Lecture ${order} question #${i + 1} expected url/link = null for interview Q&A`);
        }
      }
      console.log(`  ✓ 6 Technical Interview Q&As with full answers & difficulty badges`);
      console.log(`    Sample: "${items[0].title}" [${items[0].difficulty}]`);

      // Check Creator Attribution
      if (top.creator_name !== 'Coder Army' || !top.creator_channel_url?.includes('CoderArmy9')) {
        throw new Error(`Lecture ${order} missing Coder Army creator attribution`);
      }
      console.log(`  ✓ Creator attribution: ${top.creator_name} (${top.creator_channel_url})`);
    }

    // 3. Verify Existing Tracks Integrity
    console.log(`\n[3] Preserving Existing Tracks:`);

    const dsaRes = await client.query(`SELECT COUNT(topic_id) AS count FROM track_topics WHERE track_id = 25;`);
    const dsaCount = parseInt(dsaRes.rows[0].count, 10);
    console.log(`    DSA Track (id = 25): ${dsaCount} topics (expected: 315)`);
    if (dsaCount !== 315) {
      throw new Error(`DSA track topic count altered! Expected 315, found ${dsaCount}`);
    }

    const pgRes = await client.query(`SELECT COUNT(topic_id) AS count FROM track_topics WHERE track_id = 654;`);
    const pgCount = parseInt(pgRes.rows[0].count, 10);
    console.log(`    PostgreSQL Track (id = 654): ${pgCount} topics (expected: 26)`);
    if (pgCount !== 26) {
      throw new Error(`PostgreSQL track topic count altered! Expected 26, found ${pgCount}`);
    }

    const mongoRes = await client.query(`SELECT COUNT(topic_id) AS count FROM track_topics WHERE track_id = 655;`);
    const mongoCount = parseInt(mongoRes.rows[0].count, 10);
    console.log(`    MongoDB Track (id = 655): ${mongoCount} topics (expected: 33)`);
    if (mongoCount !== 33) {
      throw new Error(`MongoDB track topic count altered! Expected 33, found ${mongoCount}`);
    }

    console.log('\n======================================================');
    console.log('🎉 ALL JAVASCRIPT BATCH 1 VERIFICATION CHECKS PASSED!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌ Verification Failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyJSBatch1();
