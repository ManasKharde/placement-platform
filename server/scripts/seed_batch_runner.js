const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function linkVersionControlTrack() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('=== STEP 1: INSPECT JOIN TABLE & SCHEMA ===');
    const ptCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'path_tracks'
      ORDER BY ordinal_position;
    `);
    console.log('path_tracks columns:', ptCols.rows.map(c => `${c.column_name} (${c.data_type})`).join(', '));

    const ppCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'preparation_paths'
      ORDER BY ordinal_position;
    `);
    console.log('preparation_paths columns:', ppCols.rows.map(c => `${c.column_name} (${c.data_type})`).join(', '));

    console.log('\n=== STEP 2: INSPECT SECTIONS & UPDATE TRACK 709 ===');
    const sectionsRes = await client.query('SELECT * FROM sections ORDER BY id ASC;');
    console.log('Available sections in database:');
    console.table(sectionsRes.rows);

    // Development, System Design, Aptitude, Core CS have section_id = null
    // Update track 709 to ensure proper track_order (8) and section_id (null)
    await client.query(`
      UPDATE tracks 
      SET track_order = 8,
          section_id = NULL
      WHERE id = 709;
    `);
    console.log('Updated track 709: track_order = 8, section_id = NULL (consistent with core development/system design tracks).');

    console.log('\n=== STEP 3: LINK TRACK 709 TO PREPARATION PATHS ===');
    // Paths to link:
    // Path 3: 'Node.js Backend Developer' (Primary Active Path)
    // Path 6: 'Full Stack Web Developer (MERN)'
    // Path 1: 'Node.js Developer'
    // Path 4: 'React.js Frontend Developer'
    // Path 2: 'Java Enterprise Developer'
    const targetPaths = [3, 6, 1, 4, 2];

    for (const pathId of targetPaths) {
      const pathInfoRes = await client.query('SELECT id, name, slug FROM preparation_paths WHERE id = $1', [pathId]);
      if (pathInfoRes.rows.length === 0) continue;
      const pathInfo = pathInfoRes.rows[0];

      // Check if already linked
      const existingLink = await client.query(
        'SELECT id, track_order FROM path_tracks WHERE path_id = $1 AND track_id = 709;',
        [pathId]
      );

      // Determine max track_order
      const maxOrderRes = await client.query(
        'SELECT COALESCE(MAX(track_order), 0) AS max_order FROM path_tracks WHERE path_id = $1 AND track_id != 709;',
        [pathId]
      );
      const nextOrder = Number(maxOrderRes.rows[0].max_order) + 1;

      if (existingLink.rows.length > 0) {
        await client.query(
          'UPDATE path_tracks SET track_order = $1 WHERE id = $2;',
          [nextOrder, existingLink.rows[0].id]
        );
        console.log(`Updated link for Path ${pathId} ("${pathInfo.name}") -> Track 709 at order ${nextOrder}`);
      } else {
        await client.query(
          'INSERT INTO path_tracks (path_id, track_id, track_order) VALUES ($1, 709, $2);',
          [pathId, nextOrder]
        );
        console.log(`Inserted link for Path ${pathId} ("${pathInfo.name}") -> Track 709 at order ${nextOrder}`);
      }
    }

    console.log('\n=== STEP 4: UPDATE PATH METADATA (IF APPLICABLE) ===');
    const hasTotalTracksCol = ppCols.rows.some(c => c.column_name === 'total_tracks');
    if (hasTotalTracksCol) {
      for (const pathId of targetPaths) {
        await client.query(`
          UPDATE preparation_paths 
          SET total_tracks = (SELECT COUNT(*) FROM path_tracks WHERE path_id = $1)
          WHERE id = $1;
        `, [pathId]);
      }
      console.log('Updated total_tracks on preparation_paths.');
    } else {
      console.log('preparation_paths table does not maintain a cached total_tracks column (dynamically joined via path_tracks).');
    }

    await client.query('COMMIT');
    console.log('\nTransaction committed successfully.');

    console.log('\n=== STEP 5: VERIFICATION QUERY ===');
    // Verify Path 3 (Node.js Backend Developer)
    const path3Tracks = await client.query(`
      SELECT 
        pt.track_order,
        t.id AS track_id,
        COALESCE(t.name, t.title) AS track_name,
        t.slug AS track_slug,
        t.evaluation_type,
        t.total_topics,
        t.level,
        t.icon
      FROM path_tracks pt
      JOIN tracks t ON pt.track_id = t.id
      WHERE pt.path_id = 3
      ORDER BY pt.track_order ASC;
    `);

    console.log('\n--- Node.js Backend Developer (Path 3) All Linked Tracks ---');
    console.table(path3Tracks.rows);

    // Verify Path 6 (Full Stack Web Developer)
    const path6Tracks = await client.query(`
      SELECT 
        pt.track_order,
        t.id AS track_id,
        COALESCE(t.name, t.title) AS track_name,
        t.slug AS track_slug,
        t.evaluation_type,
        t.total_topics,
        t.level,
        t.icon
      FROM path_tracks pt
      JOIN tracks t ON pt.track_id = t.id
      WHERE pt.path_id = 6
      ORDER BY pt.track_order ASC;
    `);

    console.log('\n--- Full Stack Web Developer (Path 6) All Linked Tracks ---');
    console.table(path6Tracks.rows);

    // Verify roadmap query simulation for active user on Path 3
    const roadmapSim = await client.query(`
      SELECT 
        pp.id AS path_id,
        pp.name AS path_name,
        t.id AS track_id,
        COALESCE(t.name, t.title) AS track_name,
        t.slug AS track_slug,
        t.evaluation_type,
        t.parent_track_id,
        COALESCE(t.track_order, pt.track_order, 1) AS track_order
      FROM path_tracks pt
      JOIN preparation_paths pp ON pt.path_id = pp.id AND pp.is_active = true
      JOIN tracks t ON pt.track_id = t.id
      WHERE pt.path_id = 3 AND t.parent_track_id IS NULL
      ORDER BY COALESCE(t.track_order, pt.track_order, 1) ASC;
    `);

    console.log('\n--- Roadmap Query Simulation for Path 3 (as returned by /api/user/roadmap) ---');
    console.table(roadmapSim.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error linking track:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

linkVersionControlTrack();
