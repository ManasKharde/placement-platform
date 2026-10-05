const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');
const { getTopicDetail } = require('../controllers/resourceController');

async function testTopic(slug) {
  const tRes = await pool.query('SELECT id FROM topics WHERE slug = $1', [slug]);
  if (tRes.rows.length === 0) throw new Error('Topic not found: ' + slug);
  const id = tRes.rows[0].id;

  return new Promise((resolve) => {
    const req = { params: { id }, user: { id: 1 } };
    const res = {
      status: () => ({
        json: (data) => resolve(data.topic)
      })
    };
    getTopicDetail(req, res);
  });
}

async function verify() {
  console.log('--- Verifying Lecture 1 ---');
  const t1 = await testTopic('pg-lecture-1-rdbms-and-sql-foundations');
  console.log('Subtitle:', t1.short_description);
  console.log('Pillar Name:', t1.pillar_name, '| Key:', t1.pillar?.key);
  console.log('Has raw pipes in markdown:', t1.summary_markdown.includes('|'));
  console.log('Has --- in markdown:', t1.summary_markdown.includes('---'));
  console.log('Has blockquote lines starting with > in markdown:', /^>/m.test(t1.summary_markdown));
  console.log('Has <think> in markdown:', t1.summary_markdown.includes('<think>'));
  console.log('Practice items count:', t1.practice_items.length, t1.practice_items);
  console.log('Official docs:', t1.doc_links);

  console.log('\n--- Verifying Lecture 5 ---');
  const t5 = await testTopic('pg-lecture-5-select-aliases-distinct-expressions');
  console.log('Subtitle:', t5.short_description);
  console.log('Practice items count:', t5.practice_items.length);
  console.log('Official docs:', t5.doc_links);

  console.log('\n--- Verifying Lecture 17 ---');
  const t17 = await testTopic('pg-lecture-17-left-join-vs-right-join-anti-joins');
  console.log('Subtitle:', t17.short_description);
  console.log('Practice items count:', t17.practice_items.length);
  console.log('Official docs:', t17.doc_links);

  console.log('\n--- Verifying Lecture 16 ---');
  const t16 = await testTopic('pg-lecture-16-pgadmin4-browser-performance-optimization');
  console.log('Subtitle:', t16.short_description);
  console.log('Practice items count:', t16.practice_items.length, t16.practice_items);
  console.log('Official docs count:', t16.doc_links.length, t16.doc_links);

  console.log('\n--- Verifying DSA Track Preservation (track_id = 25) ---');
  const dsaCount = await pool.query('SELECT count(*) FROM topics t JOIN track_topics tt ON t.id = tt.topic_id WHERE tt.track_id = 25');
  console.log('DSA Topic Count:', dsaCount.rows[0].count);

  process.exit(0);
}

verify().catch(e => { console.error(e); process.exit(1); });
