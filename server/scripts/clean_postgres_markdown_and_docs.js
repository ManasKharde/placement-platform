const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

function convertTablesToBullets(text) {
  const lines = text.split('\n');
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Skip separator lines like |:---|:---| or |---|
    if (/^\|[-:\s|]+\|$/.test(line)) continue;

    // Check if line is a table row
    if (line.startsWith('|') && line.endsWith('|')) {
      const nextLine = (lines[i + 1] || '').trim();
      // If the next line is a separator, this is a table header row -> skip it
      if (/^\|[-:\s|]+\|$/.test(nextLine)) continue;

      const cells = line
        .slice(1, -1)
        .split('|')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (cells.length === 0) continue;

      let firstCol = cells[0].replace(/^\*\*(.*?)\*\*$/, '$1').trim();
      let secondCol = cells[1] || '';
      let remainingCols = cells.slice(2).join(' — ');

      let bullet = `* **${firstCol}:** ${secondCol}`;
      if (remainingCols) {
        bullet += ` — ${remainingCols}`;
      }
      result.push(bullet);
      continue;
    }

    result.push(lines[i]);
  }
  return result.join('\n');
}

function cleanPostgresMarkdown(raw) {
  if (!raw) return '';

  // 1. Remove creator credit lines (rendered separately under player)
  let md = raw.replace(/>\s*🎥\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/>\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');

  // 2. Remove Official PostgreSQL Documentation section at bottom (rendered in official docs card)
  md = md.replace(/###\s*📚\s*Official PostgreSQL Documentation[\s\S]*$/gi, '');

  // 3. Remove <think> tags or other HTML tags
  md = md.replace(/<\/?think>/gi, '');

  // 4. Convert all markdown pipe tables into clean bullet points
  md = convertTablesToBullets(md);

  // 5. Remove horizontal rules '---' or '***'
  md = md
    .split('\n')
    .filter(line => {
      const t = line.trim();
      return t !== '---' && t !== '***' && t !== '___';
    })
    .join('\n');

  // 6. Convert any callout blockquotes into bullet points
  md = md
    .split('\n')
    .map(line => {
      const t = line.trim();
      if (t.startsWith('>')) {
        const withoutGt = t.replace(/^>+\s*/, '');
        if (!withoutGt) return '';
        if (withoutGt.startsWith('* ') || withoutGt.startsWith('- ')) {
          return withoutGt;
        }
        return `* ${withoutGt}`;
      }
      return line;
    })
    .filter(line => line !== null && line !== undefined)
    .join('\n');

  // 7. Clean up excess blank lines
  md = md.replace(/\n{3,}/g, '\n\n').trim();

  return md;
}

// Conceptual lectures that have 0 practice problems
const CONCEPTUAL_LECTURE_ORDERS = new Set([1, 2, 3, 4, 12, 13, 16, 26]);

async function cleanPostgresMarkdownAndDocs() {
  const client = await pool.connect();
  try {
    console.log('--- Cleaning Up Markdown, Subtitles, Docs & Practice Items for PostgreSQL Mastery ---');
    await client.query('BEGIN');

    // 1. Find PostgreSQL Mastery Track ID
    const trackRes = await client.query(`SELECT id FROM tracks WHERE slug = 'postgresql-mastery' LIMIT 1;`);
    if (trackRes.rows.length === 0) {
      throw new Error('Track "postgresql-mastery" not found!');
    }
    const trackId = trackRes.rows[0].id;

    // 2. Fetch all 26 topics
    const topicsRes = await client.query(`
      SELECT 
        id, 
        topic_order, 
        slug, 
        title, 
        name,
        short_description, 
        description, 
        summary_markdown, 
        theory_summary,
        official_docs_url,
        practice_problems,
        practice_items,
        doc_links
      FROM topics 
      WHERE track_id = $1 
      ORDER BY topic_order ASC;
    `, [trackId]);

    console.log(`Found ${topicsRes.rows.length} topics in track ${trackId}.`);

    for (const topic of topicsRes.rows) {
      const isConceptual = CONCEPTUAL_LECTURE_ORDERS.has(topic.topic_order);

      // 1. Clean Markdown study guide
      const rawMarkdown = topic.summary_markdown || topic.theory_summary || topic.description;
      const cleanedMarkdown = cleanPostgresMarkdown(rawMarkdown);

      // 2. Ensure Hero Subtitle is clean 1 sentence
      let heroSubtitle = topic.short_description;
      if (topic.topic_order === 1) {
        heroSubtitle = 'Understand the core differences between raw data, Databases, DBMS, RDBMS (PostgreSQL/MySQL), NoSQL (MongoDB), and Structured Query Language (SQL).';
      } else if (!heroSubtitle || heroSubtitle.includes('\n') || heroSubtitle.length > 250) {
        heroSubtitle = topic.description?.split('\n')[0]?.replace(/^#+\s*/, '') || 'Core database engineering concepts and practical implementation.';
      }

      // 3. Official Docs Link
      let cleanDocLinks = [];
      let officialDocsUrl = topic.official_docs_url;

      // Lecture 16 has 0 official docs
      if (topic.topic_order === 16) {
        cleanDocLinks = [];
        officialDocsUrl = null;
      } else if (officialDocsUrl && officialDocsUrl.startsWith('http')) {
        cleanDocLinks = [
          {
            title: `PostgreSQL Official Documentation — Chapter ${topic.topic_order}`,
            url: officialDocsUrl
          }
        ];
      }

      // 4. Practice Items
      let cleanPracticeItems = [];
      let cleanPracticeProblems = [];

      if (!isConceptual) {
        const rawProblems = Array.isArray(topic.practice_problems) ? topic.practice_problems : [];
        if (rawProblems.length > 0) {
          cleanPracticeProblems = rawProblems;
          cleanPracticeItems = rawProblems.map((prob, idx) => ({
            title: prob.title,
            problemId: `${topic.topic_order}_${idx + 1}`,
            platform: prob.platform || 'LeetCode',
            difficulty: prob.difficulty || 'Medium',
            url: prob.url,
            description: `Solve on ${prob.platform || 'LeetCode'}`
          }));
        }
      }

      // 5. Update topics table with explicit 1-to-1 parameter mapping
      await client.query(`
        UPDATE topics SET
          description = $1,
          short_description = $2,
          summary_markdown = $3,
          theory_summary = $4,
          official_docs_url = $5,
          doc_links = $6::jsonb,
          practice_problems = $7::jsonb,
          practice_items = $8::jsonb
        WHERE id = $9;
      `, [
        heroSubtitle,
        heroSubtitle,
        cleanedMarkdown,
        cleanedMarkdown,
        officialDocsUrl,
        JSON.stringify(cleanDocLinks),
        JSON.stringify(cleanPracticeProblems),
        JSON.stringify(cleanPracticeItems),
        topic.id
      ]);

      // 6. Clean up resources table for this topic
      // Remove any problem resources if this topic has 0 problems
      if (cleanPracticeProblems.length === 0) {
        await client.query(`DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('problem', 'practice');`, [topic.id]);
      }

      // Remove any article/documentation resources if official_docs_url is null
      if (cleanDocLinks.length === 0) {
        await client.query(`DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('article', 'documentation');`, [topic.id]);
      } else {
        await client.query(`DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('article', 'documentation');`, [topic.id]);
        await client.query(`
          INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
          VALUES ($1, $2, $3, 'article', 10);
        `, [topic.id, `PostgreSQL Official Documentation — Lecture ${topic.topic_order}`, officialDocsUrl]);
      }

      console.log(`[CLEANED] Lecture ${topic.topic_order}: ${topic.slug} | Subtitle: "${heroSubtitle.slice(0, 50)}..." | Probs: ${cleanPracticeProblems.length} | Docs: ${cleanDocLinks.length}`);
    }

    await client.query('COMMIT');
    console.log('\n--- All 26 Topics Cleaned Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error cleaning postgres topics:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

cleanPostgresMarkdownAndDocs();
