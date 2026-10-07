const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verifyBatch3() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFYING MONGODB TRACK BATCH 3 (LECTURES 23 TO 33) ===\n');

    // 1. Verify track topics count
    const trackRes = await client.query(`
      SELECT t.id, t.name, t.slug, COUNT(tt.topic_id) AS topic_count
      FROM tracks t
      LEFT JOIN track_topics tt ON tt.track_id = t.id
      WHERE t.slug = 'mongodb-mastery'
      GROUP BY t.id, t.name, t.slug;
    `);

    const track = trackRes.rows[0];
    console.log(`[1] Track: [ID:${track.id}] "${track.name}" (${track.slug})`);
    console.log(`    Total Topics in Track Topics: ${track.topic_count}`);
    if (parseInt(track.topic_count, 10) !== 33) {
      throw new Error(`Expected 33 topics, found ${track.topic_count}`);
    }

    // 2. Query all 33 topics in order
    const topicsRes = await client.query(`
      SELECT top.id, top.topic_order, top.title, top.short_description,
             top.summary_markdown, top.practice_problems, top.practice_items,
             top.doc_links, top.video_links, top.official_docs_url
      FROM topics top
      JOIN track_topics tt ON tt.topic_id = top.id
      WHERE tt.track_id = $1
      ORDER BY top.topic_order ASC;
    `, [track.id]);

    console.log(`\n[2] Checking all 33 Topics: found ${topicsRes.rows.length} rows.`);

    const allAssignedProblemIds = new Set();
    const duplicateIds = [];

    for (const top of topicsRes.rows) {
      const order = top.topic_order;
      const probs = Array.isArray(top.practice_problems) ? top.practice_problems : [];

      for (const p of probs) {
        if (p.url) {
          const pId = p.url.split('/').filter(Boolean).pop();
          if (allAssignedProblemIds.has(pId)) {
            duplicateIds.push({ order, pId, title: p.title });
          }
          allAssignedProblemIds.add(pId);
        }
      }

      // Check Batch 3 specific criteria (orders 23 to 33)
      if (order >= 23 && order <= 33) {
        console.log(`\n--- Verifying Lecture ${order}: "${top.title.substring(0, 60)}..." ---`);

        // Check short_description
        if (!top.short_description || top.short_description.length < 20 || top.short_description.includes('\n')) {
          console.warn(`  [WARN] short_description might not be a single clean sentence: "${top.short_description}"`);
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

        // Check official docs URL
        if (!top.official_docs_url || !top.official_docs_url.includes('mongodb.com')) {
          throw new Error(`Lecture ${order} missing official mongodb.com documentation link`);
        }
        console.log(`  ✓ Official docs URL: ${top.official_docs_url}`);

        // Check practice problems count
        const isZeroLec = [29, 31, 32, 33].includes(order);
        if (isZeroLec) {
          if (probs.length !== 0) {
            throw new Error(`Lecture ${order} is administrative and should have 0 problems, but has ${probs.length}`);
          }
          console.log(`  ✓ 0 practice items (Administrative / Storage / CLI Lecture)`);
        } else {
          if (probs.length < 10 || probs.length > 12) {
            throw new Error(`Lecture ${order} expected 10-12 practice problems, found ${probs.length}`);
          }
          console.log(`  ✓ ${probs.length} MongoPractice problems:`);
          for (const p of probs) {
            if (!p.title.startsWith('Problem #')) {
              throw new Error(`Lecture ${order} problem title doesn't start with 'Problem #': "${p.title}"`);
            }
            if (!p.url.startsWith('https://mongopractice.online/mongodb-practice-questions/')) {
              throw new Error(`Lecture ${order} problem URL format invalid: "${p.url}"`);
            }
            if (p.platform !== 'MongoPractice') {
              throw new Error(`Lecture ${order} problem platform is not 'MongoPractice': "${p.platform}"`);
            }
          }
          console.log(`    Sample: "${probs[0].title}" -> ${probs[0].url}`);
        }
      }
    }

    // 3. Verify global problem uniqueness across all 33 lectures
    console.log(`\n[3] Global MongoPractice Problem ID Uniqueness:`);
    console.log(`    Total unique problem IDs assigned across all 33 lectures: ${allAssignedProblemIds.size}`);
    if (duplicateIds.length > 0) {
      console.error('    DUPLICATES DETECTED:', duplicateIds);
      throw new Error(`Found ${duplicateIds.length} duplicate problem assignments!`);
    } else {
      console.log(`    ✓ Zero duplicate problem IDs across all 33 lectures!`);
    }

    // 4. Verify DSA and PostgreSQL tracks remain untouched
    console.log(`\n[4] Preserving Existing Tracks:`);
    const dsaRes = await client.query(`
      SELECT COUNT(tt.topic_id) AS count
      FROM track_topics tt
      WHERE tt.track_id = 25;
    `);
    const dsaCount = parseInt(dsaRes.rows[0].count, 10);
    console.log(`    DSA Track (id = 25): ${dsaCount} topics (expected: 315)`);
    if (dsaCount !== 315) {
      throw new Error(`DSA track topic count altered! Expected 315, found ${dsaCount}`);
    }

    const pgRes = await client.query(`
      SELECT COUNT(tt.topic_id) AS count
      FROM track_topics tt
      WHERE tt.track_id = 654;
    `);
    const pgCount = parseInt(pgRes.rows[0].count, 10);
    console.log(`    PostgreSQL Track (id = 654): ${pgCount} topics (expected: 26)`);
    if (pgCount !== 26) {
      throw new Error(`PostgreSQL track topic count altered! Expected 26, found ${pgCount}`);
    }

    console.log('\n======================================================');
    console.log('🎉 ALL BATCH 3 VERIFICATION CHECKS PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌ Verification Failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyBatch3();
