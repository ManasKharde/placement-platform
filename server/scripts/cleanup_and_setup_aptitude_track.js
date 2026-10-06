const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function cleanupAndSetupAptitudeTrack() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('=== STEP 1: LOCATING EXISTING APTITUDE / QUANTITATIVE TRACK ===');

    // 1. Locate track related to aptitude / quantitative, excluding protected tracks
    // Protected tracks:
    // - DSA: id = 25, slug = 'problem-solving-dsa-sql'
    // - PostgreSQL: id = 654, slug = 'postgresql-mastery'
    // - MongoDB: id = 655, slug = 'mongodb-mastery'
    // - Databases parent: id = 660, slug = 'databases'
    // - JavaScript: slug = 'javascript-mastery' (id = 708)
    // - Development: id = 24, slug = 'nodejs-express-architecture'
    // - Core CS: id = 22, slug = 'core-computer-science-fundamentals'

    const protectedTrackIds = [25, 654, 655, 660, 708, 24, 22];

    const tracksRes = await client.query(`
      SELECT * FROM tracks 
      WHERE (
        slug ILIKE '%aptitude%' OR 
        name ILIKE '%aptitude%' OR 
        title ILIKE '%aptitude%' OR
        slug = 'quantitative-aptitude-logical-reasoning' OR
        id = 27
      )
      AND id != ALL($1::int[])
      ORDER BY id;
    `, [protectedTrackIds]);

    console.log('Found potential aptitude tracks:', tracksRes.rows.map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      title: t.title
    })));

    let aptitudeTrack = tracksRes.rows.find(t => t.id === 27) || tracksRes.rows[0];

    if (!aptitudeTrack) {
      console.log('No existing aptitude track found. Inserting new Aptitude track...');
      const insertRes = await client.query(`
        INSERT INTO tracks (
          title, 
          name, 
          slug, 
          description, 
          evaluation_type, 
          is_published, 
          icon, 
          level, 
          track_order
        ) VALUES (
          'Aptitude', 
          'Aptitude', 
          'aptitude', 
          'Comprehensive campus placement aptitude preparation covering Quantitative Aptitude, Logical Reasoning, and Verbal Ability with timed evaluation assessments.',
          'quiz',
          true,
          'brain',
          'All Levels',
          4
        ) RETURNING *;
      `);
      aptitudeTrack = insertRes.rows[0];
      console.log('Created new Aptitude track:', aptitudeTrack);
    } else {
      console.log(`Standardizing track ID ${aptitudeTrack.id}...`);

      // Check available columns in tracks
      const colsRes = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'tracks' 
        AND column_name IN ('total_topics', 'estimated_hours');
      `);
      const availableCols = colsRes.rows.map(r => r.column_name);

      let updateQuery = `
        UPDATE tracks 
        SET 
          title = 'Aptitude',
          name = 'Aptitude',
          slug = 'aptitude',
          description = 'Comprehensive campus placement aptitude preparation covering Quantitative Aptitude, Logical Reasoning, and Verbal Ability with timed evaluation assessments.',
          evaluation_type = 'quiz',
          is_published = true,
          icon = COALESCE(icon, 'brain')
      `;

      if (availableCols.includes('total_topics') && availableCols.includes('estimated_hours')) {
        updateQuery += `, total_topics = 0, estimated_hours = 0 `;
      } else if (availableCols.includes('total_topics')) {
        updateQuery += `, total_topics = 0 `;
      }

      updateQuery += ` WHERE id = $1 RETURNING *;`;

      const updateRes = await client.query(updateQuery, [aptitudeTrack.id]);
      aptitudeTrack = updateRes.rows[0];
      console.log('Standardized Aptitude track:', {
        id: aptitudeTrack.id,
        name: aptitudeTrack.name,
        slug: aptitudeTrack.slug,
        title: aptitudeTrack.title,
        description: aptitudeTrack.description
      });
    }

    const aptitudeTrackId = aptitudeTrack.id;

    console.log('\n=== STEP 2: PURGING DEMO / PLACEHOLDER TOPICS IN APTITUDE TRACK ===');

    // Find all topic IDs associated with this track directly or via track_topics
    const topicIdsRes = await client.query(`
      SELECT DISTINCT id FROM (
        SELECT id FROM topics WHERE track_id = $1
        UNION
        SELECT topic_id AS id FROM track_topics WHERE track_id = $1
      ) sub
      WHERE id NOT IN (
        -- Safety: never delete topics belonging to protected tracks
        SELECT id FROM topics WHERE track_id = ANY($2::int[])
      );
    `, [aptitudeTrackId, protectedTrackIds]);

    const topicIds = topicIdsRes.rows.map(r => r.id);
    console.log(`Found ${topicIds.length} candidate topics to purge for track ${aptitudeTrackId}:`, topicIds);

    // Also check for obsolete topic 52 or topic 51 if they are associated with demo aptitude
    const demoAptitudeTopics = await client.query(`
      SELECT id, name, slug, track_id FROM topics 
      WHERE (
        track_id = $1 
        OR slug ILIKE '%quantitative-aptitude%'
        OR slug ILIKE '%speed-distance-work%'
      )
      AND track_id != ALL($2::int[]);
    `, [aptitudeTrackId, protectedTrackIds]);

    for (const dt of demoAptitudeTopics.rows) {
      if (!topicIds.includes(dt.id)) {
        topicIds.push(dt.id);
      }
    }

    console.log(`Total topics to purge: ${topicIds.length}`, topicIds);

    if (topicIds.length > 0) {
      // 1. Delete quiz attempts and quiz questions referencing quizzes for these topics
      await client.query(`
        DELETE FROM quiz_attempts 
        WHERE quiz_id IN (SELECT id FROM quizzes WHERE topic_id = ANY($1::int[]));
      `, [topicIds]);

      await client.query(`
        DELETE FROM quiz_questions 
        WHERE quiz_id IN (SELECT id FROM quizzes WHERE topic_id = ANY($1::int[]));
      `, [topicIds]);

      await client.query(`
        DELETE FROM quizzes 
        WHERE topic_id = ANY($1::int[]);
      `, [topicIds]);

      // 2. Delete user_progress (and user_topic_progress if table exists)
      const userProgressTables = await client.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_name IN ('user_progress', 'user_topic_progress');
      `);
      for (const t of userProgressTables.rows) {
        await client.query(`DELETE FROM ${t.table_name} WHERE topic_id = ANY($1::int[]);`, [topicIds]);
      }

      // 3. Delete resources
      await client.query(`
        DELETE FROM resources 
        WHERE topic_id = ANY($1::int[]);
      `, [topicIds]);

      // 4. Delete track_topics
      await client.query(`
        DELETE FROM track_topics 
        WHERE topic_id = ANY($1::int[]);
      `, [topicIds]);

      // 5. Delete demo rows from topics
      const delTopicsRes = await client.query(`
        DELETE FROM topics 
        WHERE id = ANY($1::int[])
        RETURNING id, name, slug;
      `, [topicIds]);

      console.log(`Purged ${delTopicsRes.rowCount} demo topic rows:`, delTopicsRes.rows);
    } else {
      console.log('No demo topics found to purge.');
    }

    // Also clean any remaining track_topics for aptitudeTrackId
    await client.query(`DELETE FROM track_topics WHERE track_id = $1;`, [aptitudeTrackId]);

    // If track 23 ('Quantitative Aptitude & Advanced SQL') exists and has no topics, clean it or unlink it
    const track23 = await client.query(`SELECT id FROM tracks WHERE id = 23;`);
    if (track23.rowCount > 0) {
      await client.query(`DELETE FROM track_topics WHERE track_id = 23;`);
      await client.query(`
        DELETE FROM topics 
        WHERE track_id = 23 
        AND id NOT IN (SELECT topic_id FROM track_topics WHERE track_id != 23);
      `);
    }

    console.log('\n=== STEP 3: VERIFY TRACK ASSOCIATION & PREPARATION PATH LINKAGES ===');

    // Check path_tracks associations
    const existingPathTracks = await client.query(`
      SELECT pt.id, pt.path_id, p.name as path_name, pt.track_id, pt.track_order
      FROM path_tracks pt
      JOIN preparation_paths p ON pt.path_id = p.id
      WHERE pt.track_id = $1
      ORDER BY pt.path_id;
    `, [aptitudeTrackId]);

    console.log('Existing path_tracks mappings for Aptitude track:', existingPathTracks.rows);

    // Ensure active placement paths (Path 3: Node.js Backend, Path 6: Full Stack MERN) have Aptitude track mapped
    const activePaths = await client.query(`
      SELECT id, name FROM preparation_paths WHERE is_active = true ORDER BY id;
    `);

    for (const pathRow of activePaths.rows) {
      const exists = existingPathTracks.rows.find(pt => pt.path_id === pathRow.id);
      if (!exists) {
        // Find max order
        const maxOrderRes = await client.query(`
          SELECT COALESCE(MAX(track_order), 0) as max_order FROM path_tracks WHERE path_id = $1;
        `, [pathRow.id]);
        const nextOrder = parseInt(maxOrderRes.rows[0].max_order, 10) + 1;
        await client.query(`
          INSERT INTO path_tracks (path_id, track_id, track_order)
          VALUES ($1, $2, $3);
        `, [pathRow.id, aptitudeTrackId, nextOrder]);
        console.log(`Mapped Aptitude track to path "${pathRow.name}" (order ${nextOrder})`);
      }
    }

    // Verify topic count in tracks
    const colsRes = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tracks' 
      AND column_name IN ('total_topics', 'estimated_hours');
    `);
    const availableCols = colsRes.rows.map(r => r.column_name);

    if (availableCols.includes('total_topics') && availableCols.includes('estimated_hours')) {
      await client.query(`UPDATE tracks SET total_topics = 0, estimated_hours = 0 WHERE id = $1;`, [aptitudeTrackId]);
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 0 WHERE id = $1;`, [aptitudeTrackId]);
    }

    await client.query('COMMIT');
    console.log('\n✅ Aptitude track cleanup and setup completed successfully!');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during cleanup and setup:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

cleanupAndSetupAptitudeTrack();
