const pool = require("../config/db");

async function verifyDsaBatch14() {
  console.log("🔍 Verifying DSA Curriculum Batches 1 to 14 (Topics 1–140) in 'problem-solving-dsa-sql'...\n");

  let failureCount = 0;
  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failureCount++;
    }
  }

  try {
    // 1. Check Track
    const trackRes = await pool.query(
      "SELECT id, name, slug FROM tracks WHERE slug = 'problem-solving-dsa-sql' LIMIT 1"
    );
    assert(trackRes.rows.length === 1, "Track 'problem-solving-dsa-sql' exists in database");
    if (trackRes.rows.length === 0) {
      console.error("Track not found! Aborting verification.");
      process.exit(1);
    }
    const trackId = trackRes.rows[0].id;

    // 2. Fetch all track topics ordered by topic_order
    const topicsRes = await pool.query(
      `SELECT tt.topic_order, t.id, t.name, t.slug, t.subtrack, 
              t.summary_markdown, t.theory_summary, t.video_links, t.practice_items, t.doc_links, t.description
       FROM track_topics tt
       JOIN topics t ON tt.topic_id = t.id
       WHERE tt.track_id = $1
       ORDER BY tt.topic_order ASC`,
      [trackId]
    );

    const topics = topicsRes.rows;
    console.log(`\n📊 Total Topics Found in Track: ${topics.length}`);
    assert(topics.length === 140, `Track has exactly 140 topics (Found: ${topics.length})`);

    // Verify topic_order sequence 1 through 140
    const orders = topics.map((t) => t.topic_order);
    const expectedOrders = Array.from({ length: 140 }, (_, i) => i + 1);
    assert(
      JSON.stringify(orders) === JSON.stringify(expectedOrders),
      `Topic orders are sequentially 1 through 140: [${orders.slice(0, 5).join(", ")} ... ${orders.slice(-5).join(", ")}]`
    );

    // 3. Verify Batch 14 Specific Topics (Orders 131 to 140)
    console.log("\n📦 Verifying Batch 14 Topics (Orders 131 to 140):");
    const batch14Topics = topics.filter((t) => t.topic_order >= 131 && t.topic_order <= 140);
    assert(batch14Topics.length === 10, `Batch 14 contains exactly 10 topics (Found: ${batch14Topics.length})`);

    const expectedBatch14Slugs = [
      "dsa-depth-first-search-dfs-in-graphs",
      "dsa-number-of-provinces-connected-components",
      "dsa-number-of-islands-connected-components-in-grid",
      "dsa-flood-fill-algorithm",
      "dsa-rotten-oranges-multisource-bfs",
      "dsa-detect-cycle-in-undirected-graph-bfs",
      "dsa-detect-cycle-in-undirected-graph-dfs",
      "dsa-distance-of-nearest-cell-having-1-01-matrix",
      "dsa-surrounded-regions-replace-os-with-xs",
      "dsa-number-of-enclaves-multisource-bfs",
    ];

    const expectedSubtracks = {
      131: "Module 21: Graph Theory Foundations, Representations & Traversals",
      132: "Module 21: Graph Theory Foundations, Representations & Traversals",
      133: "Module 21: Graph Theory Foundations, Representations & Traversals",
      134: "Module 21: Graph Theory Foundations, Representations & Traversals",
      135: "Module 21: Graph Theory Foundations, Representations & Traversals",
      136: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      137: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      138: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      139: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      140: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
    };

    batch14Topics.forEach((t) => {
      const idx = t.topic_order - 131;
      assert(t.slug === expectedBatch14Slugs[idx], `Topic #${t.topic_order} has expected slug '${expectedBatch14Slugs[idx]}'`);
      assert(t.subtrack === expectedSubtracks[t.topic_order], `Topic #${t.topic_order} has subtrack '${expectedSubtracks[t.topic_order]}'`);
      assert(t.summary_markdown && t.summary_markdown.length > 50, `Topic #${t.topic_order} has substantial summary_markdown (${t.summary_markdown ? t.summary_markdown.length : 0} chars)`);

      // Video links check
      const videos = typeof t.video_links === "string" ? JSON.parse(t.video_links) : (t.video_links || []);
      const hasYoutube = videos.some((v) => v.url && v.url.includes("youtube.com"));
      assert(hasYoutube, `Topic #${t.topic_order} has embedded YouTube lecture URL (${videos[0] ? videos[0].url : "none"})`);

      // Practice items check
      const practice = typeof t.practice_items === "string" ? JSON.parse(t.practice_items) : (t.practice_items || []);
      assert(practice.length === 3, `Topic #${t.topic_order} has 3 extra practice problems (Found: ${practice.length})`);
    });

    // 4. Zero LaTeX / $ Symbol / [cite:...] Verification across ALL 140 topics
    console.log("\n🛡️ Verifying Zero LaTeX / $ / [cite:...] Artifact Policy across ALL 140 Topics:");
    const artifactPatterns = [
      { name: "Dollar sign ($)", regex: /\$/ },
      { name: "LaTeX \\to", regex: /\\to\b/ },
      { name: "LaTeX \\infty", regex: /\\infty\b/ },
      { name: "LaTeX \\sqrt", regex: /\\sqrt\b/ },
      { name: "LaTeX \\log", regex: /\\log\b/ },
      { name: "LaTeX \\times", regex: /\\times\b/ },
      { name: "LaTeX \\le / \\ge", regex: /\\(le|ge)\b/ },
      { name: "Citation tag ([cite:...])", regex: /\[cite:/ },
    ];

    let artifactViolations = 0;
    topics.forEach((t) => {
      const textFields = [
        { field: "summary_markdown", value: t.summary_markdown || "" },
        { field: "theory_summary", value: t.theory_summary || "" },
        { field: "description", value: t.description || "" },
      ];

      // Also inspect practice items text
      const practice = typeof t.practice_items === "string" ? JSON.parse(t.practice_items) : (t.practice_items || []);
      practice.forEach((item, pIdx) => {
        textFields.push({ field: `practice_items[${pIdx}].title`, value: item.title || "" });
        textFields.push({ field: `practice_items[${pIdx}].description`, value: item.description || "" });
      });

      for (const tf of textFields) {
        for (const pattern of artifactPatterns) {
          if (pattern.regex.test(tf.value)) {
            console.error(`  ❌ ARTIFACT VIOLATION in Topic #${t.topic_order} (${t.slug}) field '${tf.field}': matched ${pattern.name}`);
            artifactViolations++;
          }
        }
      }
    });

    assert(artifactViolations === 0, `Zero LaTeX, $, or citation violations across all 140 topics (Violations: ${artifactViolations})`);

    // 5. Test Roadmap View Query
    console.log("\n🗺️ Verifying Roadmap Track Query Result:");
    const roadmapRes = await pool.query(
      `SELECT t.id, t.name, t.slug, t.subtrack, tt.topic_order, t.description
       FROM track_topics tt
       JOIN topics t ON tt.topic_id = t.id
       WHERE tt.track_id = $1
       ORDER BY tt.topic_order ASC`,
      [trackId]
    );

    const subtracks = [...new Set(roadmapRes.rows.map((r) => r.subtrack))];
    console.log(`  Subtracks present (${subtracks.length}):`);
    subtracks.forEach((st) => console.log(`    - ${st}`));

    assert(subtracks.includes("Module 21: Graph Theory Foundations, Representations & Traversals"), "Includes Module 21 (Graph Theory & Traversals)");
    assert(subtracks.includes("Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms"), "Includes Module 22 (Cycle Detection & Boundary Flood)");

    // 6. Summary Result
    console.log("\n========================================================");
    if (failureCount === 0) {
      console.log("🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! (0 FAILURES)");
      console.log("========================================================\n");
    } else {
      console.error(`💥 VERIFICATION COMPLETED WITH ${failureCount} FAILURES!`);
      console.log("========================================================\n");
      process.exit(1);
    }
  } catch (error) {
    console.error("Verification crashed with error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  verifyDsaBatch14();
}

module.exports = verifyDsaBatch14;
