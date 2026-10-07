const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verifyMongoBatch2() {
  console.log('=== Comprehensive Verification for MongoDB Track Batch 2 (Lectures 1 to 22) ===\n');

  // 1. Query Topics for mongodb-mastery (track_id = 655)
  const topicsRes = await pool.query(`
    SELECT t.id, t.slug, t.title, t.name, t.topic_order, t.description, t.short_description,
           t.summary_markdown, t.theory_summary, t.practice_items, t.practice_problems,
           t.doc_links, t.video_links, t.creator_name, t.creator_channel_url, t.official_docs_url,
           tt.topic_order AS tt_order
    FROM topics t
    JOIN track_topics tt ON t.id = tt.topic_id
    WHERE tt.track_id = 655
    ORDER BY tt.topic_order ASC;
  `);

  const topics = topicsRes.rows;
  console.log(`[TOPICS] Total topics in mongodb-mastery: ${topics.length} (Expected: 22)`);
  if (topics.length !== 22) {
    throw new Error(`Expected exactly 22 topics in mongodb-mastery, but found ${topics.length}`);
  }

  const expectedCounts = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 6, 6: 8, 7: 0, 8: 12, 9: 10, 10: 12, 11: 12,
    12: 10, 13: 10, 14: 10, 15: 10, 16: 12, 17: 12, 18: 10, 19: 10, 20: 10, 21: 10, 22: 10
  };

  const allProblemUrls = new Set();
  const allProblemIds = new Set();

  for (let i = 0; i < topics.length; i++) {
    const t = topics[i];
    const order = t.tt_order;
    const expectedCount = expectedCounts[order];

    // Check slug pattern
    if (!t.slug.startsWith(`mongo-lecture-${order}-`)) {
      throw new Error(`Topic order ${order} has unexpected slug: ${t.slug}`);
    }

    // Check markdown length
    if (!t.summary_markdown || t.summary_markdown.length < 800) {
      throw new Error(`Lecture ${order} summary_markdown length is too short: ${t.summary_markdown?.length}`);
    }

    // Check markdown hygiene: zero pipe tables, zero ---, zero >, zero <think>
    const mdLines = t.summary_markdown.split('\n');
    for (const line of mdLines) {
      const trimmed = line.trim();
      if (/^\|[-:\s|]+\|$/.test(trimmed) || (trimmed.startsWith('|') && trimmed.endsWith('|') && !trimmed.includes('SELECT'))) {
        throw new Error(`Lecture ${order} contains raw markdown pipe table: "${trimmed}"`);
      }
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        throw new Error(`Lecture ${order} contains horizontal rule: "${trimmed}"`);
      }
      if (trimmed.startsWith('> ') || trimmed.startsWith('>\t')) {
        throw new Error(`Lecture ${order} contains raw blockquote: "${trimmed}"`);
      }
      if (trimmed.includes('<think>') || trimmed.includes('</think>')) {
        throw new Error(`Lecture ${order} contains think tags!`);
      }
    }

    // Check 1-sentence short_description
    if (!t.short_description || t.short_description.includes('\n') || t.short_description.length > 350) {
      throw new Error(`Lecture ${order} short_description is invalid: "${t.short_description}"`);
    }

    // Check docs link
    if (!t.official_docs_url || !t.official_docs_url.includes('mongodb.com/docs')) {
      throw new Error(`Lecture ${order} official_docs_url is invalid: ${t.official_docs_url}`);
    }

    // Check practice problems
    const problems = Array.isArray(t.practice_items) ? t.practice_items : [];
    if (problems.length !== expectedCount) {
      throw new Error(`Lecture ${order} expected ${expectedCount} practice items, but found ${problems.length}`);
    }

    if (expectedCount > 0) {
      for (const p of problems) {
        if (!p.title.startsWith('Problem #')) {
          throw new Error(`Lecture ${order} problem title doesn't start with "Problem #": ${p.title}`);
        }
        if (!p.url.startsWith('https://mongopractice.online/mongodb-practice-questions/')) {
          throw new Error(`Lecture ${order} problem url is invalid: ${p.url}`);
        }
        if (p.platform !== 'MongoPractice') {
          throw new Error(`Lecture ${order} problem platform is not MongoPractice: ${p.platform}`);
        }
        const probId = p.url.split('/').filter(Boolean).pop();
        if (allProblemUrls.has(p.url) || allProblemIds.has(probId)) {
          throw new Error(`Lecture ${order} problem duplicated across lectures: ${p.url}`);
        }
        allProblemUrls.add(p.url);
        allProblemIds.add(probId);
      }
    }

    // Check creator attribution
    if (t.creator_name !== 'Yahoo Baba') {
      throw new Error(`Lecture ${order} creator_name is not Yahoo Baba: ${t.creator_name}`);
    }

    console.log(`✅ Lecture ${String(order).padStart(2)}: "${t.title.slice(0, 48)}..." | MdLen: ${t.summary_markdown.length} | Probs: ${problems.length}/${expectedCount}`);
  }

  console.log(`\nAll 22 lectures passed validation. Total unique MongoPractice problems assigned: ${allProblemUrls.size}`);

  // 2. Verify Track Preservation
  console.log('\n--- Verifying Track Preservation ---');
  const dsaRes = await pool.query('SELECT COUNT(*) FROM topics WHERE track_id = 25');
  const dsaCount = parseInt(dsaRes.rows[0].count, 10);
  console.log(`DSA Track (track_id = 25): ${dsaCount} topics (Expected: 315)`);
  if (dsaCount !== 315) {
    throw new Error(`DSA track topic count modified! Current: ${dsaCount}, Expected: 315`);
  }

  const pgRes = await pool.query('SELECT COUNT(*) FROM topics WHERE track_id = 654');
  const pgCount = parseInt(pgRes.rows[0].count, 10);
  console.log(`PostgreSQL Track (track_id = 654): ${pgCount} topics (Expected: 26)`);
  if (pgCount !== 26) {
    throw new Error(`PostgreSQL track topic count modified! Current: ${pgCount}, Expected: 26`);
  }

  console.log('\n🎉 ALL 22 MONGODB LECTURES & TRACK PRESERVATIONS PASSED WITH 100% SUCCESS!');
  await pool.end();
}

verifyMongoBatch2().catch(err => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
