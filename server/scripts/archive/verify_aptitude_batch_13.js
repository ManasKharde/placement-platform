const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verifyAptitudeBatch13() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFYING APTITUDE BATCH 13 (TOPICS 37 TO 39) ===\n');

    // 1. Check Aptitude track topics count
    const aptRes = await client.query(`
      SELECT t.id, t.title, t.slug,
             COUNT(tt.topic_id) as topic_count
      FROM tracks t
      LEFT JOIN track_topics tt ON t.id = tt.track_id
      WHERE t.id = 27 OR t.slug = 'aptitude'
      GROUP BY t.id, t.title, t.slug;
    `);

    console.log('Aptitude Track Status:');
    aptRes.rows.forEach(r => {
      console.log(`- Track ID: ${r.id}, Title: "${r.title}", Slug: "${r.slug}", Topics count: ${r.topic_count}`);
    });

    // 2. Check Topics 37, 38, 39 details
    const topicsRes = await client.query(`
      SELECT tt.topic_order, t.id, t.title, t.slug, t.creator_name, t.creator_channel_url,
             jsonb_array_length(t.practice_problems) as practice_count,
             jsonb_array_length(t.doc_links) as doc_count,
             jsonb_array_length(t.video_links) as video_count
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = 27 AND tt.topic_order IN (37, 38, 39)
      ORDER BY tt.topic_order ASC;
    `);

    console.log('\nBatch 13 Topics (37, 38, 39):');
    topicsRes.rows.forEach(r => {
      console.log(`- Order ${r.topic_order}: "${r.title}" (Slug: ${r.slug}) | Questions: ${r.practice_count} | Doc links: ${r.doc_count} | Creator: ${r.creator_name}`);
    });

    // 3. Check total questions across all 39 aptitude topics
    const totalQRes = await client.query(`
      SELECT SUM(jsonb_array_length(t.practice_problems)) as total_questions,
             COUNT(t.id) as total_topics
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = 27;
    `);
    console.log(`\nTotal Aptitude Topics: ${totalQRes.rows[0].total_topics}, Total Questions: ${totalQRes.rows[0].total_questions}`);

    // 4. Verify other tracks are completely untouched
    console.log('\nChecking Protected Tracks:');
    const tracksRes = await client.query(`
      SELECT t.id, t.title, t.slug, COUNT(tt.topic_id) as topic_count
      FROM tracks t
      LEFT JOIN track_topics tt ON t.id = tt.track_id
      WHERE t.id IN (25, 654, 655, 24, 22) OR t.slug = 'javascript-mastery'
      GROUP BY t.id, t.title, t.slug
      ORDER BY t.id;
    `);

    tracksRes.rows.forEach(r => {
      console.log(`- Track ID: ${r.id}, Slug: "${r.slug}", Title: "${r.title}" -> Topics: ${r.topic_count}`);
    });

    console.log('\n✅ Verification Complete!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyAptitudeBatch13();
