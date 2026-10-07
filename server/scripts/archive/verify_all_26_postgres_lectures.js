const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');
const { getTopicDetail } = require('../controllers/resourceController');

async function testTopic(id) {
  return new Promise((resolve, reject) => {
    const req = { params: { id }, user: { id: 1 } };
    const res = {
      status: (code) => ({
        json: (data) => {
          if (code >= 400) reject(new Error(`HTTP ${code}: ${JSON.stringify(data)}`));
          else resolve(data.topic);
        }
      })
    };
    getTopicDetail(req, res).catch(reject);
  });
}

async function verifyAll26Lectures() {
  console.log('=== Comprehensive Verification for All 26 PostgreSQL Lectures ===\n');

  const topicsRes = await pool.query(`
    SELECT id, topic_order, slug, title, name
    FROM topics
    WHERE track_id = 654 OR slug LIKE 'pg-lecture-%'
    ORDER BY topic_order ASC;
  `);

  if (topicsRes.rows.length !== 26) {
    throw new Error(`Expected 26 topics, found ${topicsRes.rows.length}`);
  }

  let allPassed = true;

  for (const row of topicsRes.rows) {
    const topic = await testTopic(row.id);
    const order = row.topic_order;

    // Checks
    const md = topic.summary_markdown || '';
    const mdLenValid = md.length > 400;
    const isCleanMdTest = md.trim() === 'Clean markdown';
    const hasThinkTag = md.includes('<think>');
    const hasRawPipeTable = md.split('\n').some(line => {
      const trimmed = line.trim();
      return (trimmed.startsWith('|') && trimmed.endsWith('|')) || /^\|[-:\s|]+\|$/.test(trimmed);
    });
    const hasHorizontalRule = md.split('\n').some(line => {
      const trimmed = line.trim();
      return trimmed === '---' || trimmed === '***' || trimmed === '___';
    });
    const hasBlockquote = /^>/m.test(md);

    const probs = topic.practice_items || [];
    const probCountValid = probs.length === 10;
    const allUrlsValid = probs.length > 0 && probs.every(p => {
      const url = p.url || p.link;
      return typeof url === 'string' && url.startsWith('https://leetcode.com/problems/');
    });

    const status = mdLenValid && !isCleanMdTest && !hasThinkTag && !hasRawPipeTable && !hasHorizontalRule && !hasBlockquote && probCountValid && allUrlsValid;

    if (!status) {
      allPassed = false;
      console.error(`❌ FAILED Lecture ${order}: ${row.slug}`);
      if (!mdLenValid) console.error(`   - Markdown length too short: ${md.length}`);
      if (isCleanMdTest) console.error(`   - Markdown is literal "Clean markdown" placeholder!`);
      if (hasThinkTag) console.error(`   - Markdown contains <think> tags!`);
      if (hasRawPipeTable) console.error(`   - Markdown contains raw table pipe row (|...|)!`);
      if (hasHorizontalRule) console.error(`   - Markdown contains horizontal rule (---)!`);
      if (hasBlockquote) console.error(`   - Markdown contains blockquote line (> )!`);
      if (!probCountValid) console.error(`   - Practice items count: ${probs.length} (expected 10)`);
      if (!allUrlsValid) {
        console.error(`   - Invalid problem URLs detected:`, probs.map(p => p.url));
      }
    } else {
      console.log(`✅ Lecture ${order.toString().padStart(2, ' ')}: "${(topic.title || topic.name).slice(0, 45)}..." | MdLen: ${md.length} | Probs: ${probs.length}/10 valid URLs`);
    }
  }

  console.log('\n--- Verifying DSA Track Preservation (track_id = 25) ---');
  const dsaCountRes = await pool.query('SELECT count(*) FROM topics t JOIN track_topics tt ON t.id = tt.topic_id WHERE tt.track_id = 25');
  const dsaCount = parseInt(dsaCountRes.rows[0].count, 10);
  console.log(`DSA Topic Count: ${dsaCount} (Expected: 315)`);

  if (dsaCount !== 315) {
    allPassed = false;
    console.error('❌ DSA Track topic count modified!');
  } else {
    console.log('✅ DSA Track perfectly preserved (315 topics).');
  }

  if (allPassed) {
    console.log('\n🎉 ALL 26 POSTGRESQL LECTURES & DSA PRESERVATION VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('\n❌ Verification failed.');
    process.exit(1);
  }
}

verifyAll26Lectures().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
