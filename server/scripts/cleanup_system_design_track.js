require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function cleanupSystemDesignTrack() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ensure total_topics column exists on tracks table
    await client.query(`
      ALTER TABLE tracks ADD COLUMN IF NOT EXISTS total_topics INTEGER DEFAULT 0;
    `);

    // 1. Find the System Design track (Track 28)
    const trackRes = await client.query(`
      SELECT id, title, slug, total_topics 
      FROM tracks 
      WHERE id = 28 OR slug = 'system-design' OR slug = 'system-design-deployment' OR title ILIKE '%System Design & Deployment%'
      ORDER BY CASE WHEN id = 28 THEN 1 WHEN slug = 'system-design' THEN 2 ELSE 3 END, id ASC;
    `);

    if (trackRes.rows.length === 0) {
      console.log('No System Design track found.');
      await client.query('ROLLBACK');
      return;
    }

    const track = trackRes.rows[0];
    console.log(`Found Track: ID ${track.id} | Title: "${track.title}" | Slug: "${track.slug}"`);

    // 2. Update track title, name, and slug to "System Design"
    await client.query(`
      UPDATE tracks 
      SET title = 'System Design', 
          name = 'System Design', 
          slug = 'system-design'
      WHERE id = $1;
    `, [track.id]);
    console.log(`Updated Track ID ${track.id} title to "System Design", name to "System Design", and slug to "system-design"`);

    // 3. Find topics currently associated with this track
    const topicsRes = await client.query(`
      SELECT t.id, t.title, t.slug, tt.topic_order 
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = $1
      ORDER BY tt.topic_order ASC;
    `, [track.id]);

    console.log('\nCurrent topics in track:', topicsRes.rows);

    // 4. Find demo / placeholder topics to remove
    const demoTopics = topicsRes.rows.filter(t => 
      (t.title && (t.title.toLowerCase().includes('demo') || t.title.toLowerCase().includes('sample') || t.title.toLowerCase().includes('placeholder'))) ||
      (t.slug && (t.slug.toLowerCase().includes('demo') || t.slug.toLowerCase().includes('sample') || t.slug.toLowerCase().includes('placeholder'))) ||
      !t.title
    );

    if (demoTopics.length > 0) {
      for (const demo of demoTopics) {
        console.log(`\nRemoving demo topic: ID ${demo.id} - "${demo.title || demo.slug}"`);
        
        // Remove from track_topics
        await client.query(`DELETE FROM track_topics WHERE track_id = $1 AND topic_id = $2;`, [track.id, demo.id]);
        
        // Check if linked to any other track before deleting from topics
        const otherTracks = await client.query(`SELECT COUNT(*) FROM track_topics WHERE topic_id = $1;`, [demo.id]);
        if (parseInt(otherTracks.rows[0].count, 10) === 0) {
          await client.query(`DELETE FROM topics WHERE id = $1;`, [demo.id]);
          console.log(`Deleted demo topic ${demo.id} from topics table.`);
        } else {
          console.log(`Topic ${demo.id} is linked to other tracks, preserved in topics table.`);
        }
      }
    } else {
      console.log('\nNo demo/placeholder topics found in System Design track.');
    }

    // 5. Re-index remaining topics and update total_topics count
    const remainingTopics = await client.query(`
      SELECT tt.topic_id, t.title, t.slug 
      FROM track_topics tt
      JOIN topics t ON tt.topic_id = t.id
      WHERE tt.track_id = $1
      ORDER BY tt.topic_order ASC;
    `, [track.id]);

    for (let i = 0; i < remainingTopics.rows.length; i++) {
      await client.query(`
        UPDATE track_topics 
        SET topic_order = $1 
        WHERE track_id = $2 AND topic_id = $3;
      `, [i + 1, track.id, remainingTopics.rows[i].topic_id]);
    }

    await client.query(`
      UPDATE tracks 
      SET total_topics = $1 
      WHERE id = $2;
    `, [remainingTopics.rows.length, track.id]);

    await client.query('COMMIT');

    // 6. Final verification output
    const finalTrack = await client.query(`SELECT id, title, slug, total_topics FROM tracks WHERE id = $1;`, [track.id]);
    const finalTopics = await client.query(`
      SELECT tt.topic_order, t.id, t.title, t.slug 
      FROM track_topics tt 
      JOIN topics t ON tt.topic_id = t.id 
      WHERE tt.track_id = $1 
      ORDER BY tt.topic_order ASC;
    `, [track.id]);

    console.log('\n=== CLEANUP VERIFICATION RESULT ===');
    console.log('Track:', finalTrack.rows[0]);
    console.log('Remaining Topics in Track:', finalTopics.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error cleaning up track:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

cleanupSystemDesignTrack();
