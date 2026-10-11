const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = require('../config/db');

async function reorderPathTracks() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Detect join table name
    const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('path_tracks', 'preparation_path_tracks');
    `);
    const joinTable = tableCheck.rows.map(r => r.table_name).includes('preparation_path_tracks') 
      ? 'preparation_path_tracks' 
      : 'path_tracks';

    console.log(`Using join table: ${joinTable}`);

    // 2. Locate React Path ID
    const pathRes = await client.query(`
      SELECT id, name, slug FROM preparation_paths WHERE name ILIKE '%React%' OR slug ILIKE '%react%' LIMIT 1;
    `);
    if (pathRes.rows.length === 0) throw new Error("React path not found.");
    const pathId = pathRes.rows[0].id;
    console.log(`Found Preparation Path: ${pathRes.rows[0].name} (ID: ${pathId})`);

    // 3. Fetch all tracks currently associated with this path
    const linkedTracksRes = await client.query(`
      SELECT pt.track_id, t.slug, COALESCE(t.title, t.name) as title
      FROM ${joinTable} pt
      JOIN tracks t ON pt.track_id = t.id
      WHERE pt.path_id = $1;
    `, [pathId]);

    const trackList = linkedTracksRes.rows;
    console.log(`Found ${trackList.length} tracks currently linked to path.`);

    const findTrackId = (slugPattern) => {
      const match = trackList.find(t => 
        (t.slug && t.slug.toLowerCase().includes(slugPattern.toLowerCase())) || 
        (t.title && t.title.toLowerCase().includes(slugPattern.toLowerCase()))
      );
      return match ? match.track_id : null;
    };

    // Specific matchers to prevent false positive collisions
    const htmlId      = findTrackId('html');
    const cssId       = trackList.find(t => (t.slug.includes('css') || t.title.toLowerCase().includes('css3')) && !t.slug.includes('tailwind') && !t.title.toLowerCase().includes('tailwind'))?.track_id;
    const tailwindId  = findTrackId('tailwind');
    const jsId        = findTrackId('javascript') || findTrackId('es6');
    const tsId        = findTrackId('typescript');
    const reactId     = trackList.find(t => t.slug === 'reactjs-mastery' || (t.slug.includes('react') && !t.slug.includes('hook') && !t.slug.includes('redux')) )?.track_id;
    const advHooksId  = findTrackId('advanced-react-hooks') || trackList.find(t => t.slug.includes('hook') || t.title.toLowerCase().includes('hook'))?.track_id;
    const reduxId     = findTrackId('redux');
    const sysDesignId = findTrackId('system-design') || findTrackId('frontend-system-design');
    const vcId        = findTrackId('version-control') || findTrackId('git');

    // 4. Target Order: Tailwind placed at #3 between CSS3 (#2) and JavaScript (#4)
    const targetOrder = [
      { id: htmlId, order: 1, label: 'HTML5 Foundations' },
      { id: cssId, order: 2, label: 'CSS3' },
      { id: tailwindId, order: 3, label: 'Tailwind CSS & Utility-First Styling' },
      { id: jsId, order: 4, label: 'JavaScript & Modern ES6+ Architecture' },
      { id: tsId, order: 5, label: 'TypeScript Engineering' },
      { id: reactId, order: 6, label: 'React.js Engineering' },
      { id: advHooksId, order: 7, label: 'Advanced React Hooks' },
      { id: reduxId, order: 8, label: 'Redux Toolkit' },
      { id: sysDesignId, order: 9, label: 'Web Architecture & Frontend System Design' },
      { id: vcId, order: 10, label: 'Version Control Systems' }
    ].filter(item => item.id != null);

    if (targetOrder.length !== 10) {
      console.warn(`Warning: Expected 10 tracks matched, but matched ${targetOrder.length}`);
      console.log('Matched list:', targetOrder);
    }

    // Check if tracks table has track_order or order column
    const trackCols = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'tracks' AND column_name IN ('track_order', 'order');
    `);
    const hasTrackOrderCol = trackCols.rows.some(r => r.column_name === 'track_order');
    const hasOrderCol = trackCols.rows.some(r => r.column_name === 'order');

    // 5. Update the join table
    await client.query(`DELETE FROM ${joinTable} WHERE path_id = $1;`, [pathId]);

    for (const item of targetOrder) {
      await client.query(`
        INSERT INTO ${joinTable} (path_id, track_id, track_order)
        VALUES ($1, $2, $3);
      `, [pathId, item.id, item.order]);

      if (hasTrackOrderCol) {
        await client.query(`UPDATE tracks SET track_order = $1 WHERE id = $2;`, [item.order, item.id]);
      }
      if (hasOrderCol) {
        await client.query(`UPDATE tracks SET "order" = $1 WHERE id = $2;`, [item.order, item.id]);
      }

      console.log(`Placed [Order ${item.order}]: ${item.label} (ID: ${item.id})`);
    }

    // 6. Update Path Totals
    await client.query(`
      UPDATE preparation_paths 
      SET total_tracks = $1 
      WHERE id = $2;
    `, [targetOrder.length, pathId]);

    await client.query('COMMIT');
    console.log(`\nSuccessfully reordered all ${targetOrder.length} tracks!`);

    // 7. Verify and Print Clean Table
    const verifyRes = await client.query(`
      SELECT 
        pt.track_order,
        pt.track_id,
        t.slug,
        COALESCE(t.title, t.name) as title
      FROM ${joinTable} pt
      JOIN tracks t ON pt.track_id = t.id
      WHERE pt.path_id = $1
      ORDER BY pt.track_order ASC;
    `, [pathId]);

    console.log('\n--- VERIFIED REORDERED TRACKS IN DATABASE ---');
    console.table(verifyRes.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Reordering failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

reorderPathTracks();
