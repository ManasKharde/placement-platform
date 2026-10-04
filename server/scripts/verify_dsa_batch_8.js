const pool = require("../config/db");

async function verifyDsaBatch8() {
  console.log("🔍 Verifying DSA Curriculum Batches 1 to 8 (Topics 1–80) in 'problem-solving-dsa-sql'...\n");

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
    assert(topics.length === 80, `Track has exactly 80 topics (Found: ${topics.length})`);

    // Verify topic_order sequence 1 through 80
    const orders = topics.map((t) => t.topic_order);
    const expectedOrders = Array.from({ length: 80 }, (_, i) => i + 1);
    assert(
      JSON.stringify(orders) === JSON.stringify(expectedOrders),
      `Topic orders are sequentially 1 through 80: [${orders.slice(0, 5).join(", ")} ... ${orders.slice(-5).join(", ")}]`
    );

    // 3. Verify Batch 8 Specific Topics (Orders 71 to 80)
    console.log("\n📦 Verifying Batch 8 Topics (Orders 71 to 80):");
    const batch8Topics = topics.filter((t) => t.topic_order >= 71 && t.topic_order <= 80);
    assert(batch8Topics.length === 10, `Batch 8 contains exactly 10 topics (Found: ${batch8Topics.length})`);

    const expectedBatch8Slugs = [
      "dsa-find-peak-element-ii-2d-grid",
      "dsa-median-in-row-wise-sorted-matrix",
      "dsa-introduction-to-binary-trees-and-types",
      "dsa-binary-tree-representation-cpp",
      "dsa-binary-tree-representation-java",
      "dsa-binary-tree-traversals-dfs-vs-bfs",
      "dsa-preorder-traversal-binary-tree",
      "dsa-inorder-traversal-binary-tree",
      "dsa-postorder-traversal-binary-tree",
      "dsa-level-order-traversal-bfs-binary-tree",
    ];

    const expectedModules = {
      71: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      72: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      73: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      74: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      75: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      76: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      77: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      78: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      79: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      80: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
    };

    batch8Topics.forEach((t) => {
      const idx = t.topic_order - 71;
      assert(t.slug === expectedBatch8Slugs[idx], `Topic #${t.topic_order} has expected slug '${expectedBatch8Slugs[idx]}'`);
      assert(t.subtrack === expectedModules[t.topic_order], `Topic #${t.topic_order} has subtrack '${expectedModules[t.topic_order]}'`);
      assert(t.summary_markdown && t.summary_markdown.length > 50, `Topic #${t.topic_order} has substantial summary_markdown (${t.summary_markdown ? t.summary_markdown.length : 0} chars)`);

      // Video links check
      const videos = typeof t.video_links === "string" ? JSON.parse(t.video_links) : (t.video_links || []);
      const hasYoutube = videos.some((v) => v.url && v.url.includes("youtube.com"));
      assert(hasYoutube, `Topic #${t.topic_order} has embedded YouTube lecture URL (${videos[0] ? videos[0].url : "none"})`);

      // Practice items check
      const practice = typeof t.practice_items === "string" ? JSON.parse(t.practice_items) : (t.practice_items || []);
      assert(practice.length === 3, `Topic #${t.topic_order} has 3 extra practice problems (Found: ${practice.length})`);
    });

    // 4. Zero LaTeX / $ Symbol / [cite:...] Verification across ALL 80 topics
    console.log("\n🛡️ Verifying Zero LaTeX / $ / [cite:...] Artifact Policy across ALL 80 Topics:");
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

    assert(artifactViolations === 0, `Zero LaTeX, $, or citation violations across all 80 topics (Violations: ${artifactViolations})`);

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

    assert(subtracks.includes("Module 14: Multi-Array Partitioning & 2D Matrix Binary Search"), "Includes Module 14");
    assert(subtracks.includes("Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals"), "Includes Module 15");

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
  } catch (err) {
    console.error("Verification failed with exception:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  verifyDsaBatch8();
}

module.exports = verifyDsaBatch8;
