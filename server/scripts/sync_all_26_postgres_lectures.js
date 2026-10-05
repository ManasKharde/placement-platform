const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

function cleanUrl(url) {
  if (!url) return '';
  const match = url.match(/https?:\/\/[^\s\)\],]+/);
  return match ? match[0] : url;
}

// 10 Verified, Reachable LeetCode SQL Problems for Foundational / Architecture Lectures
const FOUNDATIONAL_SQL_PROBLEMS = [
  { title: 'Recyclable and Low Fat Products', url: 'https://leetcode.com/problems/recyclable-and-low-fat-products/', difficulty: 'Easy', platform: 'LeetCode' },
  { title: 'Find Customer Referee', url: 'https://leetcode.com/problems/find-customer-referee/', difficulty: 'Easy', platform: 'LeetCode' },
  { title: 'Big Countries', url: 'https://leetcode.com/problems/big-countries/', difficulty: 'Easy', platform: 'LeetCode' },
  { title: 'Article Views I', url: 'https://leetcode.com/problems/article-views-i/', difficulty: 'Easy', platform: 'LeetCode' },
  { title: 'Invalid Tweets', url: 'https://leetcode.com/problems/invalid-tweets/', difficulty: 'Easy', platform: 'LeetCode' },
  { title: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/', difficulty: 'Easy', platform: 'LeetCode' },
  { title: 'Customers Who Never Order', url: 'https://leetcode.com/problems/customers-who-never-order/', difficulty: 'Easy', platform: 'LeetCode' },
  { title: 'Duplicate Emails', url: 'https://leetcode.com/problems/duplicate-emails/', difficulty: 'Easy', platform: 'LeetCode' },
  { title: 'Employees Earning More Than Their Managers', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/', difficulty: 'Easy', platform: 'LeetCode' },
  { title: 'Delete Duplicate Emails', url: 'https://leetcode.com/problems/delete-duplicate-emails/', difficulty: 'Easy', platform: 'LeetCode' }
];

// Full Clean Study Guide for Lecture 1 (Restoring clobbered "Clean markdown")
const LECTURE_1_CLEAN_MARKDOWN = `### 📌 Topic Overview
Before writing complex queries or designing backend APIs, every engineer must understand the architectural hierarchy of data storage: **Data -> Database -> DBMS -> RDBMS -> PostgreSQL**, and where **SQL** fits as the communication protocol.

### 💡 Core Architectural Concepts
* **Data:** Raw, isolated facts, numbers, or strings — \`"Vinod"\`, \`23\`, \`"vinod@college.com"\`
* **Database (DB):** An organized collection of actual stored data grouped logically — Student records of a university, E-commerce orders.
* **DBMS (Database Management System):** Software system used to create, manage, query, and secure databases — PostgreSQL, MySQL, MongoDB, SQLite.
* **RDBMS (Relational DBMS):** Relational DBMS that stores data strictly in **tables** (rows & columns) linked via keys — PostgreSQL, MySQL, Oracle, SQL Server.
* **NoSQL (Non-RDBMS):** Stores data as flexible JSON/BSON documents, key-value pairs, or graphs — MongoDB, Redis, Cassandra.
* **SQL (Structured Query Language):** The standard language used to talk to an RDBMS (NOT a database software itself) — \`SELECT * FROM users;\`

### 🏗️ Anatomy of a Relational Table (Excel vs. PostgreSQL)
While both Microsoft Excel and PostgreSQL organize data into rows and columns, Excel breaks down at millions of rows and lacks relational integrity constraints.

* **Table (Relation):** Represents a single specific entity (e.g., \`users\`, \`orders\`, \`courses\`).
* **Column (Field / Attribute):** A vertical category enforcing a **strict, uniform data type** across every entry (e.g., \`age INTEGER\`, \`name VARCHAR\`).
* **Row (Record / Tuple):** A horizontal entry representing one complete entity instance (e.g., all profile details belonging to User #1).
* **Primary Key (PK):** A unique identifier for each row in a table (e.g., \`user_id\`).
* **Foreign Key (FK):** A field in one table (e.g., \`orders.user_id\`) that references the Primary Key of another table (\`users.id\`), establishing a **relationship**.`;

function convertTablesToBullets(text) {
  const lines = text.split('\n');
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^\|[-:\s|]+\|$/.test(line)) continue;
    if (line.startsWith('|') && line.endsWith('|')) {
      const nextLine = (lines[i + 1] || '').trim();
      if (/^\|[-:\s|]+\|$/.test(nextLine)) continue;
      const cells = line.slice(1, -1).split('|').map(c => c.trim()).filter(c => c.length > 0);
      if (cells.length === 0) continue;
      let firstCol = cells[0].replace(/^\*\*(.*?)\*\*$/, '$1').trim();
      let secondCol = cells[1] || '';
      let remainingCols = cells.slice(2).join(' — ');
      let bullet = '* **' + firstCol + ':** ' + secondCol;
      if (remainingCols) bullet += ' — ' + remainingCols;
      result.push(bullet);
      continue;
    }
    result.push(lines[i]);
  }
  return result.join('\n');
}

function cleanMarkdown(raw) {
  if (!raw) return '';
  let md = raw.replace(/>\s*🎥\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/>\s*\*\*Video Creator Credit:\*\*.*?\n+/gi, '');
  md = md.replace(/###\s*📚\s*Official PostgreSQL Documentation[\s\S]*$/gi, '');
  md = md.replace(/<\/?think>/gi, '');
  md = convertTablesToBullets(md);
  md = md.split('\n').filter(line => {
    const t = line.trim();
    return t !== '---' && t !== '***' && t !== '___';
  }).join('\n');
  md = md.split('\n').map(line => {
    const t = line.trim();
    if (t.startsWith('>')) {
      const withoutGt = t.replace(/^>+\s*/, '');
      if (!withoutGt) return '';
      if (withoutGt.startsWith('* ') || withoutGt.startsWith('- ')) {
        return withoutGt;
      }
      return '* ' + withoutGt;
    }
    return line;
  }).join('\n');
  return md.replace(/\n{3,}/g, '\n\n').trim();
}

async function syncAll26Lectures() {
  const client = await pool.connect();
  try {
    console.log('--- Syncing All 26 PostgreSQL Lectures (Study Notes + 10 Reachable LeetCode Links) ---');
    await client.query('BEGIN');

    const topicsRes = await client.query(`
      SELECT id, slug, title, name, topic_order, description, short_description, summary_markdown, theory_summary, practice_problems, practice_items, official_docs_url
      FROM topics
      WHERE track_id = 654 OR slug LIKE 'pg-lecture-%'
      ORDER BY topic_order ASC;
    `);

    console.log(`Found ${topicsRes.rows.length} PostgreSQL topics to sync.`);

    for (const row of topicsRes.rows) {
      // 1. Resolve Clean Markdown (never allow "Clean markdown" or empty strings)
      let rawSource = row.summary_markdown;
      if (row.topic_order === 1 || row.slug === 'pg-lecture-1-rdbms-and-sql-foundations' || !rawSource || rawSource.trim() === 'Clean markdown' || rawSource.trim().length < 100) {
        if (row.topic_order === 1 || row.slug === 'pg-lecture-1-rdbms-and-sql-foundations') {
          rawSource = LECTURE_1_CLEAN_MARKDOWN;
        } else if (row.theory_summary && row.theory_summary.trim().length > 100) {
          rawSource = row.theory_summary;
        } else if (row.description && row.description.trim().length > 100) {
          rawSource = row.description;
        }
      }
      const cleanedMd = cleanMarkdown(rawSource);

      // 2. Resolve 1-sentence short_description
      const shortDesc = (row.short_description && row.short_description.length < 300 && !row.short_description.includes('\n'))
        ? row.short_description
        : `Master ${row.title || row.name} with practical PostgreSQL queries and architecture patterns.`;

      // 3. Resolve 10 Reachable LeetCode SQL Problems
      let sourceProbs = Array.isArray(row.practice_problems) ? row.practice_problems : [];
      // Clean up URLs and filter only valid direct LeetCode problem links (must contain /problems/)
      sourceProbs = sourceProbs
        .map(p => ({
          ...p,
          url: cleanUrl(p.url || p.link || p.external_url)
        }))
        .filter(p => p && p.url && p.url.includes('leetcode.com/problems/'));

      // Pad up to 10 problems using FOUNDATIONAL_SQL_PROBLEMS so every topic has 10 reachable problems
      for (const fallbackProb of FOUNDATIONAL_SQL_PROBLEMS) {
        if (sourceProbs.length >= 10) break;
        if (!sourceProbs.some(p => p.url === fallbackProb.url)) {
          sourceProbs.push({
            title: fallbackProb.title,
            url: fallbackProb.url,
            difficulty: fallbackProb.difficulty,
            platform: 'LeetCode'
          });
        }
      }

      const normalizedProblems = sourceProbs.slice(0, 10).map((p, idx) => ({
        id: `pg-${row.topic_order}-prob-${idx + 1}`,
        problemId: `${row.topic_order}_${idx + 1}`,
        title: p.title,
        name: p.title,
        url: p.url,
        link: p.url,
        external_url: p.url,
        difficulty: p.difficulty || 'Easy',
        platform: 'LeetCode',
        description: `Solve "${p.title}" on LeetCode using PostgreSQL.`
      }));

      const problemsJson = JSON.stringify(normalizedProblems);

      // 4. Resolve Official Docs
      let docLinksJson;
      if (row.topic_order === 16) {
        docLinksJson = JSON.stringify([]);
      } else if (row.official_docs_url) {
        docLinksJson = JSON.stringify([{
          title: `PostgreSQL Official Documentation — Chapter ${row.topic_order}`,
          url: cleanUrl(row.official_docs_url),
          link: cleanUrl(row.official_docs_url)
        }]);
      } else {
        docLinksJson = JSON.stringify([]);
      }

      // 5. Update topic row across ALL relevant columns
      await client.query(`
        UPDATE topics SET
          short_description = $1,
          description = $2,
          summary_markdown = $3,
          theory_summary = $4,
          practice_items = $5::jsonb,
          practice_problems = $6::jsonb,
          doc_links = $7::jsonb
        WHERE id = $8;
      `, [
        shortDesc,
        shortDesc,
        cleanedMd,
        cleanedMd,
        problemsJson,
        problemsJson,
        docLinksJson,
        row.id
      ]);

      // 6. Sync resources table for problem links
      await client.query(`DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('problem', 'practice');`, [row.id]);
      for (const prob of normalizedProblems) {
        await client.query(`
          INSERT INTO resources (topic_id, title, url, resource_type, difficulty, estimated_minutes)
          VALUES ($1, $2, $3, 'problem', $4, 15);
        `, [row.id, prob.title, prob.url, prob.difficulty]);
      }

      // 7. Sync official doc in resources table
      if (row.topic_order !== 16 && row.official_docs_url) {
        await client.query(`DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('article', 'documentation');`, [row.id]);
        await client.query(`
          INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
          VALUES ($1, $2, $3, 'article', 10);
        `, [row.id, `PostgreSQL Official Documentation — Lecture ${row.topic_order}`, cleanUrl(row.official_docs_url)]);
      } else if (row.topic_order === 16) {
        await client.query(`DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('article', 'documentation');`, [row.id]);
      }

      console.log(`[SYNCED] Lecture ${row.topic_order} (ID:${row.id}): Markdown=${cleanedMd.length} chars | Problems=${normalizedProblems.length}`);
    }

    await client.query('COMMIT');
    console.log('--- All 26 PostgreSQL Lectures Synced Successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Sync failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

syncAll26Lectures();
