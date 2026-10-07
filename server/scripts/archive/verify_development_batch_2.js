const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function verifyDevelopmentBatch2() {
  const client = await pool.connect();
  try {
    console.log('=== VERIFYING DEVELOPMENT TRACK (LECTURES 1 TO 17) & ALL CORE TRACKS ===\n');
    let hasErrors = false;

    // 1. Verify Track Counts
    const trackCounts = await client.query(`
      SELECT 
        t.id, 
        t.slug, 
        t.name, 
        COUNT(tt.topic_id) as total_topics
      FROM tracks t
      LEFT JOIN track_topics tt ON t.id = tt.track_id
      WHERE t.id IN (24, 25, 654, 655, 708)
      GROUP BY t.id, t.slug, t.name
      ORDER BY t.id;
    `);

    console.log('📊 Core Tracks Topic Counts:');
    for (const r of trackCounts.rows) {
      console.log(`  - [ID:${r.id}] ${r.name} (${r.slug}): ${r.total_topics} topics`);
    }

    const devTrack = trackCounts.rows.find(r => r.id === 24);
    const dsaTrack = trackCounts.rows.find(r => r.id === 25);
    const pgTrack = trackCounts.rows.find(r => r.id === 654);
    const mongoTrack = trackCounts.rows.find(r => r.id === 655);
    const jsTrack = trackCounts.rows.find(r => r.id === 708);

    if (!devTrack || parseInt(devTrack.total_topics, 10) !== 17) {
      console.error(`❌ ERROR: Development track expected 17 topics, got ${devTrack ? devTrack.total_topics : 'null'}`);
      hasErrors = true;
    } else {
      console.log(`✅ Development Track has exactly 17 topics (Lectures 1 to 17).`);
    }

    if (!dsaTrack || parseInt(dsaTrack.total_topics, 10) !== 315) {
      console.error(`❌ ERROR: DSA track expected 315 topics, got ${dsaTrack ? dsaTrack.total_topics : 'null'}`);
      hasErrors = true;
    } else {
      console.log(`✅ DSA Track has exactly 315 topics.`);
    }

    if (!pgTrack || parseInt(pgTrack.total_topics, 10) !== 26) {
      console.error(`❌ ERROR: PostgreSQL track expected 26 topics, got ${pgTrack ? pgTrack.total_topics : 'null'}`);
      hasErrors = true;
    } else {
      console.log(`✅ PostgreSQL Track has exactly 26 topics.`);
    }

    if (!mongoTrack || parseInt(mongoTrack.total_topics, 10) !== 33) {
      console.error(`❌ ERROR: MongoDB track expected 33 topics, got ${mongoTrack ? mongoTrack.total_topics : 'null'}`);
      hasErrors = true;
    } else {
      console.log(`✅ MongoDB Track has exactly 33 topics.`);
    }

    if (!jsTrack || parseInt(jsTrack.total_topics, 10) !== 22) {
      console.error(`❌ ERROR: JavaScript track expected 22 topics, got ${jsTrack ? jsTrack.total_topics : 'null'}`);
      hasErrors = true;
    } else {
      console.log(`✅ JavaScript Track has exactly 22 topics.`);
    }

    // 2. Check for zero demo topics
    const nonLectureTopics = await client.query(`
      SELECT tt.topic_id, t.name, t.slug 
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = 24 AND t.slug NOT LIKE 'node-lecture-%';
    `);

    if (nonLectureTopics.rows.length > 0) {
      console.error(`❌ ERROR: Found ${nonLectureTopics.rows.length} leftover demo topics!`, nonLectureTopics.rows);
      hasErrors = true;
    } else {
      console.log(`✅ Zero leftover demo topics in Development Track.`);
    }

    // 3. Inspect all 17 Development Topics
    const devTopics = await client.query(`
      SELECT 
        t.id, 
        t.slug, 
        t.title, 
        tt.topic_order,
        t.short_description,
        t.description,
        t.summary_markdown,
        t.theory_summary,
        t.practice_items,
        t.practice_problems,
        t.doc_links,
        t.creator_name,
        t.creator_channel_url
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = 24
      ORDER BY tt.topic_order ASC;
    `);

    console.log(`\n🔍 Verifying all ${devTopics.rows.length} Development Topics:`);

    for (const top of devTopics.rows) {
      const order = top.topic_order;
      const md = top.summary_markdown || '';
      const practice = top.practice_problems || top.practice_items || [];
      const docs = top.doc_links || [];

      const mdLen = md.length;
      const hasRawPipes = /^\s*\|.*\|\s*$/m.test(md);
      const hasDashes = /^\s*---+\s*$/m.test(md);
      const hasBlockquote = /^\s*>+/m.test(md);
      const hasThinkTags = /<\/?think>/i.test(md);

      if (mdLen < 800) {
        console.error(`❌ Lec ${order} [${top.slug}]: summary_markdown length too short (${mdLen} chars)`);
        hasErrors = true;
      }
      if (hasRawPipes) {
        console.error(`❌ Lec ${order} [${top.slug}]: contains raw pipe tables`);
        hasErrors = true;
      }
      if (hasDashes) {
        console.error(`❌ Lec ${order} [${top.slug}]: contains raw horizontal rules (---)`);
        hasErrors = true;
      }
      if (hasBlockquote) {
        console.error(`❌ Lec ${order} [${top.slug}]: contains raw blockquotes (>)`);
        hasErrors = true;
      }
      if (hasThinkTags) {
        console.error(`❌ Lec ${order} [${top.slug}]: contains <think> tags`);
        hasErrors = true;
      }

      if (practice.length !== 6) {
        console.error(`❌ Lec ${order} [${top.slug}]: expected 6 practice questions, found ${practice.length}`);
        hasErrors = true;
      }

      for (const q of practice) {
        if (!q.answer || q.answer.length < 20) {
          console.error(`❌ Lec ${order} [${top.slug}]: question "${q.title}" missing detailed answer`);
          hasErrors = true;
        }
        if (q.platform !== 'Technical Interview QA') {
          console.error(`❌ Lec ${order} [${top.slug}]: platform is "${q.platform}", expected "Technical Interview QA"`);
          hasErrors = true;
        }
      }

      if (docs.length === 0) {
        console.error(`❌ Lec ${order} [${top.slug}]: missing doc links`);
        hasErrors = true;
      }

      if (top.creator_name !== 'Complete Coding by Prashant Sir' || !top.creator_channel_url.includes('CompleteCodingByPrashantSir')) {
        console.error(`❌ Lec ${order} [${top.slug}]: creator attribution invalid: "${top.creator_name}"`);
        hasErrors = true;
      }

      console.log(`  ✅ Lecture ${order.toString().padStart(2, '0')}: [ID:${top.id}] ${top.slug.slice(0, 45)}... | MD: ${mdLen} chars | Qs: ${practice.length} | Doc: ${docs[0]?.url.slice(0, 48)}...`);
    }

    if (hasErrors) {
      console.log('\n❌ Verification completed WITH ERRORS!');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL CHECKS PASSED PERFECTLY! 17 Development lectures verified and 4 completed tracks intact.');
    }
  } catch (err) {
    console.error('Verification query failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

verifyDevelopmentBatch2();
