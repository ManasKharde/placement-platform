const pool = require("../config/db");

async function verifyDsaBatch15() {
  console.log("🔍 Verifying DSA Curriculum Batches 1 to 15 (Topics 1–150) in 'problem-solving-dsa-sql'...\n");

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
    assert(topics.length === 150, `Track has exactly 150 topics (Found: ${topics.length})`);

    // Verify topic_order sequence 1 through 150
    const orders = topics.map((t) => t.topic_order);
    const expectedOrders = Array.from({ length: 150 }, (_, i) => i + 1);
    assert(
      JSON.stringify(orders) === JSON.stringify(expectedOrders),
      `Topic orders are sequentially 1 through 150: [${orders.slice(0, 5).join(", ")} ... ${orders.slice(-5).join(", ")}]`
    );

    // 3. Verify Batch 15 Specific Topics (Orders 141 to 150)
    console.log("\n📦 Verifying Batch 15 Topics (Orders 141 to 150):");
    const batch15Topics = topics.filter((t) => t.topic_order >= 141 && t.topic_order <= 150);
    assert(batch15Topics.length === 10, `Batch 15 contains exactly 10 topics (Found: ${batch15Topics.length})`);

    const expectedBatch15Slugs = [
      "dsa-number-of-distinct-islands-shape-hashing",
      "dsa-bipartite-graph-check-bfs",
      "dsa-bipartite-graph-check-dfs",
      "dsa-detect-cycle-in-directed-graph-dfs",
      "dsa-find-eventual-safe-states-dfs",
      "dsa-topological-sort-algorithm-dfs",
      "dsa-kahns-algorithm-topological-sort-bfs",
      "dsa-detect-cycle-in-directed-graph-kahns-bfs",
      "dsa-course-schedule-i-and-ii-topological-sort",
      "dsa-find-eventual-safe-states-bfs-topological-sort",
    ];

    const expectedSubtracks = {
      141: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      142: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      143: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      144: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      145: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      146: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      147: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      148: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      149: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      150: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
    };

    batch15Topics.forEach((t) => {
      const idx = t.topic_order - 141;
      assert(t.slug === expectedBatch15Slugs[idx], `Topic #${t.topic_order} has expected slug '${expectedBatch15Slugs[idx]}'`);
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

    // 4. Zero LaTeX / $ Symbol / [cite:...] Verification across ALL 150 topics
    console.log("\n🛡️ Verifying Zero LaTeX / $ / [cite:...] Artifact Policy across ALL 150 Topics:");
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

    assert(artifactViolations === 0, `Zero LaTeX, $, or citation violations across all 150 topics (Violations: ${artifactViolations})`);

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

    assert(subtracks.includes("Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms"), "Includes Module 22 (Cycle Detection & Boundary Flood)");
    assert(subtracks.includes("Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)"), "Includes Module 23 (Graph Coloring & Topo Sort)");

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
  verifyDsaBatch15();
}

module.exports = verifyDsaBatch15;
