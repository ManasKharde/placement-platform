const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const pool = require('../config/db');

async function migrateJavaRoadmap() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Identify Path Table and Join Table
    const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('path_tracks', 'preparation_path_tracks', 'preparation_paths');
    `);
    const tables = tableCheck.rows.map(r => r.table_name);
    const joinTable = tables.includes('preparation_path_tracks') ? 'preparation_path_tracks' : 'path_tracks';
    console.log(`Using join table: "${joinTable}"`);

    // Ensure columns exist on preparation_paths
    await client.query(`
      ALTER TABLE preparation_paths 
      ADD COLUMN IF NOT EXISTS title VARCHAR(255),
      ADD COLUMN IF NOT EXISTS total_tracks INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_topics INTEGER DEFAULT 0;
    `);

    // 2. Locate Java Path (ID 2)
    const pathRes = await client.query(`
      SELECT * FROM preparation_paths 
      WHERE id = 2 OR title ILIKE '%Java%Developer%' OR name ILIKE '%Java%Developer%' OR slug ILIKE '%java%'
      ORDER BY id ASC
      LIMIT 1;
    `);

    if (pathRes.rows.length === 0) {
      throw new Error("Could not find Java preparation path.");
    }

    const pathObj = pathRes.rows[0];
    console.log(`Found path: [ID ${pathObj.id}] "${pathObj.title || pathObj.name}" (slug: ${pathObj.slug})`);

    // 3. Rename Path to "Java Backend Developer"
    await client.query(`
      UPDATE preparation_paths 
      SET 
        name = 'Java Backend Developer',
        title = 'Java Backend Developer',
        slug = 'java-backend-developer',
        description = 'Enterprise backend software engineering with Java, Spring Boot, Microservices, System Design, and Scalable Database Architectures.'
      WHERE id = $1;
    `, [pathObj.id]);
    console.log('✅ Updated path name, title, slug, and description to "Java Backend Developer"');

    // 4. Find all dummy tracks to unlink
    const dummyTracksRes = await client.query(`
      SELECT id, name, slug FROM tracks 
      WHERE slug IN ('core-java', 'core-java-oop', 'relational-databases-jdbc-hibernate', 'java-databases-jpa', 'spring-boot-rest-apis-microservices', 'spring-boot-microservices', 'cs-fundamentals')
         OR (id IN (15, 16, 17, 2))
         OR name ILIKE '%Core Java%' 
         OR name ILIKE '%JDBC%Hibernate%' 
         OR name ILIKE '%Spring Boot%';
    `);
    const dummyTrackIds = dummyTracksRes.rows.map(r => r.id);
    console.log(`Identified dummy tracks:`, dummyTracksRes.rows.map(t => `[${t.id}] ${t.name} (${t.slug})`));

    // Clear all existing mappings for this path
    const deleteRes = await client.query(`DELETE FROM ${joinTable} WHERE path_id = $1;`, [pathObj.id]);
    console.log(`Cleaned up previous join table mappings (${deleteRes.rowCount} removed).`);

    // 5. Target Sequence for Java Backend Developer:
    // 1. DSA (Track 25: Problem Solving: DSA & SQL)
    // 2. Databases (Track 660: Databases)
    // 3. Version Control Systems (Track 709: Version Control Systems)
    // 4. System Design (Track 28: System Design)
    // 5. Core Computer Science (Track 22: Core Computer Science)
    // 6. Aptitude (Track 27: Aptitude)
    const targetTrackIds = [25, 660, 709, 28, 22, 27];

    let totalTopicsSum = 0;
    let orderIndex = 1;

    for (const trackId of targetTrackIds) {
      const trackRes = await client.query(`
        SELECT id, name, title, slug, total_topics FROM tracks WHERE id = $1;
      `, [trackId]);

      if (trackRes.rows.length === 0) {
        console.warn(`⚠️ Track ID ${trackId} not found in database!`);
        continue;
      }

      const track = trackRes.rows[0];

      // Get count of topics (including sub-track topics if parent track)
      const countRes = await client.query(`
        SELECT COUNT(DISTINCT tt.topic_id) AS cnt
        FROM track_topics tt
        WHERE tt.track_id = $1 
           OR tt.track_id IN (SELECT id FROM tracks WHERE parent_track_id = $1);
      `, [trackId]);

      const effectiveTopics = Math.max(
        parseInt(track.total_topics, 10) || 0,
        parseInt(countRes.rows[0]?.cnt, 10) || 0
      );

      // Link in join table
      await client.query(`
        INSERT INTO ${joinTable} (path_id, track_id, track_order)
        VALUES ($1, $2, $3);
      `, [pathObj.id, track.id, orderIndex]);

      totalTopicsSum += effectiveTopics;
      console.log(`✅ Linked Track [Order ${orderIndex}]: [ID ${track.id}] "${track.title || track.name}" (${track.slug}) - ${effectiveTopics} topics`);
      orderIndex++;
    }

    const linkedTrackCount = orderIndex - 1;

    // 6. Recalculate and update path metadata
    await client.query(`
      UPDATE preparation_paths 
      SET 
        total_tracks = $1,
        total_topics = $2
      WHERE id = $3;
    `, [linkedTrackCount, totalTopicsSum, pathObj.id]);
    console.log(`✅ Updated path totals: ${linkedTrackCount} tracks, ${totalTopicsSum} topics.`);

    await client.query('COMMIT');
    console.log('\nMigration committed successfully!');

    // 7. Verification query
    const verify = await client.query(`
      SELECT 
        pt.track_order, 
        t.id AS track_id, 
        COALESCE(t.title, t.name) AS track_title, 
        t.slug AS track_slug, 
        t.evaluation_type,
        t.total_topics
      FROM ${joinTable} pt
      JOIN tracks t ON t.id = pt.track_id
      WHERE pt.path_id = $1
      ORDER BY pt.track_order ASC;
    `, [pathObj.id]);

    const updatedPathRes = await client.query(`
      SELECT id, name, title, slug, description, total_tracks, total_topics
      FROM preparation_paths 
      WHERE id = $1;
    `, [pathObj.id]);

    console.log('\n=== JAVA BACKEND DEVELOPER PATH INFO ===');
    console.table(updatedPathRes.rows);

    console.log('\n=== LINKED TRACKS (ORDER 1 THROUGH 6) ===');
    console.table(verify.rows);

    // 8. Verify simulated roadmap query
    const roadmapSim = await client.query(`
      SELECT 
        pp.name AS path_name,
        t.id AS track_id,
        COALESCE(t.name, t.title) AS track_name,
        t.slug AS track_slug,
        t.evaluation_type,
        COALESCE(pt.track_order, t.track_order, 1) AS track_order
      FROM ${joinTable} pt
      JOIN preparation_paths pp ON pt.path_id = pp.id AND pp.is_active = true
      JOIN tracks t ON pt.track_id = t.id
      WHERE pt.path_id = $1 AND t.parent_track_id IS NULL
      ORDER BY COALESCE(pt.track_order, t.track_order, 1) ASC;
    `, [pathObj.id]);

    console.log('\n=== ROADMAP SIMULATION FOR JAVA BACKEND DEVELOPER ===');
    console.table(roadmapSim.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrateJavaRoadmap();
