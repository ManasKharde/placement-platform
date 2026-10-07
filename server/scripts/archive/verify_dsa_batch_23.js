const pool = require("../config/db");

async function verifyDsaBatch23() {
  console.log("🔍 Verifying DSA Curriculum Batches 1 to 23 (Topics 1–230) in 'problem-solving-dsa-sql'...\n");

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
    assert(topics.length === 230, `Track has exactly 230 topics (Found: ${topics.length})`);

    // Verify topic_order sequence 1 through 230
    const orders = topics.map((t) => t.topic_order);
    const expectedOrders = Array.from({ length: 230 }, (_, i) => i + 1);
    assert(
      JSON.stringify(orders) === JSON.stringify(expectedOrders),
      `Topic orders are sequentially 1 through 230: [${orders.slice(0, 5).join(", ")} ... ${orders.slice(-5).join(", ")}]`
    );

    // 3. Verify Batch 23 Specific Topics (Orders 221 to 230)
    console.log("\n📦 Verifying Batch 23 Topics (Orders 221 to 230):");
    const batch23Topics = topics.filter((t) => t.topic_order >= 221 && t.topic_order <= 230);
    assert(batch23Topics.length === 10, `Batch 23 contains exactly 10 topics (Found: ${batch23Topics.length})`);

    const expectedBatch23Slugs = [
      "dsa-longest-increasing-subsequence-memoization",
      "dsa-printing-longest-increasing-subsequence-tabulation",
      "dsa-longest-increasing-subsequence-binary-search",
      "dsa-largest-divisible-subset-lis-variant",
      "dsa-longest-string-chain-lis-variant",
      "dsa-longest-bitonic-subsequence-lis",
      "dsa-number-of-longest-increasing-subsequences",
      "dsa-matrix-chain-multiplication-partition-dp-memoization",
      "dsa-matrix-chain-multiplication-bottom-up-tabulation",
      "dsa-minimum-cost-to-cut-the-stick-partition-dp",
    ];

    const expectedSubtracks = {
      221: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      222: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      223: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      224: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      225: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      226: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      227: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      228: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
      229: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
      230: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
    };

    batch23Topics.forEach((t) => {
      const idx = t.topic_order - 221;
      assert(t.slug === expectedBatch23Slugs[idx], `Topic #${t.topic_order} has expected slug '${expectedBatch23Slugs[idx]}'`);
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

    // 4. Zero LaTeX / $ Symbol / [cite:...] Verification across ALL 230 topics
    console.log("\n🛡️ Verifying Zero LaTeX / $ / [cite:...] Artifact Policy across ALL 230 Topics:");
    const artifactPatterns = [
      { name: "Dollar sign ($)", regex: /\$/ },
      { name: "LaTeX \\to", regex: /\\to\b/ },
      { name: "LaTeX \\infty", regex: /\\infty\b/ },
      { name: "LaTeX \\sqrt", regex: /\\sqrt\b/ },
      { name: "LaTeX \\log", regex: /\\log\b/ },
      { name: "LaTeX \\times", regex: /\\times\b/ },
      { name: "LaTeX \\le / \\ge", regex: /\\(le|ge)\b/ },
      { name: "LaTeX \\alpha", regex: /\\alpha\b/ },
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

    assert(artifactViolations === 0, `Zero LaTeX, $, or citation violations across all 230 topics (Violations: ${artifactViolations})`);

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
    console.log(`  Subtracks present in track (${subtracks.length} modules):`);
    subtracks.forEach((st) => console.log(`   - ${st}`));

    assert(
      subtracks.includes("Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants"),
      "Roadmap contains Module 33"
    );
    assert(
      subtracks.includes("Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)"),
      "Roadmap contains Module 34"
    );

    console.log(`\n========================================`);
    if (failureCount === 0) {
      console.log("🎉 ALL VERIFICATION CHECKS PASSED PERFECTLY!");
      console.log("========================================\n");
      process.exit(0);
    } else {
      console.error(`❌ VERIFICATION COMPLETED WITH ${failureCount} FAILURES.`);
      console.log("========================================\n");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Verification encountered an error:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  verifyDsaBatch23();
}

module.exports = verifyDsaBatch23;
