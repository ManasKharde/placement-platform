const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verify() {
  console.log('=== VERIFICATION RUN: CORE CS DBMS ===');

  // 1. Core CS Track (ID 22)
  const trackRes = await pool.query('SELECT id, name, slug FROM tracks WHERE id = 22');
  console.log('Track 22:', trackRes.rows[0]);

  const topicsRes = await pool.query(`
    SELECT t.id, t.slug, t.title, tt.topic_order, length(t.summary_markdown) as summary_len,
           jsonb_array_length(t.practice_items) as practice_len,
           t.creator_name, t.creator_channel_url, t.official_docs_url
    FROM topics t
    JOIN track_topics tt ON t.id = tt.topic_id
    WHERE tt.track_id = 22
    ORDER BY tt.topic_order ASC
  `);
  console.log('Track 22 topics count:', topicsRes.rows.length, '(Expected: 2)');
  console.log('Track 22 topics:', topicsRes.rows.map(r => ({
    id: r.id,
    order: r.topic_order,
    slug: r.slug,
    title: r.title,
    summary_len: r.summary_len,
    practice_len: r.practice_len
  })));

  // Verify DBMS topic specifically
  const dbmsTopic = await pool.query(`
    SELECT summary_markdown, practice_items, doc_links, video_links
    FROM topics WHERE slug = 'cs-dbms-complete-oneshot-mastery'
  `);
  const row = dbmsTopic.rows[0];
  const md = row.summary_markdown;
  const items = row.practice_items;

  console.log('\nDBMS Study Markdown length:', md.length, '(Expected: > 5000)');
  console.log('Has pipe table line:', md.split('\n').some(l => l.trim().startsWith('|') && l.trim().endsWith('|')));
  console.log('Has --- separator line:', md.split('\n').some(l => /^[-*_]{3,}$/.test(l.trim())));
  console.log('Has blockquote > line:', md.split('\n').some(l => l.trim().startsWith('>')));

  console.log('\nDBMS Questions count:', items.length, '(Expected: 50)');
  const theoryCount = items.filter(i => i.category === 'Theory & Concept').length;
  const numCount = items.filter(i => i.category === 'Numerical & Calculation').length;
  const scenCount = items.filter(i => i.category === 'Real-World Engineering Scenario').length;
  console.log('Category Breakdown:', { theoryCount, numCount, scenCount });

  const allHave4Options = items.every(i => Array.isArray(i.options) && i.options.length === 4);
  const allHaveAnswer = items.every(i => typeof i.correctAnswer === 'string' && ['A','B','C','D'].includes(i.correctAnswer));
  const allHaveExplanation = items.every(i => typeof i.explanation === 'string' && i.explanation.length > 10);
  console.log('All questions valid format:', { allHave4Options, allHaveAnswer, allHaveExplanation });

  // 2. Safeguard verification of OOP topic and all other completed tracks
  const oopCount = await pool.query("SELECT count(*) FROM topics WHERE slug = 'cs-oop-complete-oneshot-mastery'");
  const dsaCount = await pool.query('SELECT count(*) FROM track_topics WHERE track_id = 25');
  const pgCount = await pool.query('SELECT count(*) FROM track_topics WHERE track_id = 654');
  const mongoCount = await pool.query('SELECT count(*) FROM track_topics WHERE track_id = 655');
  const jsTrack = await pool.query("SELECT id FROM tracks WHERE slug = 'javascript-mastery'");
  const jsCount = await pool.query('SELECT count(*) FROM track_topics WHERE track_id = $1', [jsTrack.rows[0].id]);
  const devCount = await pool.query('SELECT count(*) FROM track_topics WHERE track_id = 24');

  console.log('\n--- Protected Tracks & OOP Topic Verification ---');
  console.log('Core CS OOP Topic (topic 1):', oopCount.rows[0].count, '(Expected: 1)');
  console.log('DSA (track 25):', dsaCount.rows[0].count, '(Expected: 315)');
  console.log('PostgreSQL (track 654):', pgCount.rows[0].count, '(Expected: 26)');
  console.log('MongoDB (track 655):', mongoCount.rows[0].count, '(Expected: 33)');
  console.log('JavaScript Mastery (track ' + jsTrack.rows[0].id + '):', jsCount.rows[0].count, '(Expected: 22)');
  console.log('Development (track 24):', devCount.rows[0].count, '(Expected: 22)');

  process.exit(0);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
