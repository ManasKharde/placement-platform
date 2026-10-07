const pool = require("../config/db");

async function verifyDsaBatch21() {
  console.log("🔍 Verifying DSA Curriculum Batches 1 to 21 (Topics 1–210) in 'problem-solving-dsa-sql'...\n");

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
    assert(topics.length === 210, `Track has exactly 210 topics (Found: ${topics.length})`);

    // Verify topic_order sequence 1 through 210
    const orders = topics.map((t) => t.topic_order);
    const expectedOrders = Array.from({ length: 210 }, (_, i) => i + 1);
    assert(
      JSON.stringify(orders) === JSON.stringify(expectedOrders),
      `Topic orders are sequentially 1 through 210: [${orders.slice(0, 5).join(", ")} ... ${orders.slice(-5).join(", ")}]`
    );

    // 3. Verify Batch 21 Specific Topics (Orders 201 to 210)
    console.log("\n📦 Verifying Batch 21 Topics (Orders 201 to 210):");
    const batch21Topics = topics.filter((t) => t.topic_order >= 201 && t.topic_order <= 210);
    assert(batch21Topics.length === 10, `Batch 21 contains exactly 10 topics (Found: ${batch21Topics.length})`);

    const expectedBatch21Slugs = [
      "dsa-minimum-coins-infinite-supply-pattern",
      "dsa-target-sum-dp-on-subsequences",
      "dsa-coin-change-2-infinite-supply-ways",
      "dsa-unbounded-knapsack-1d-space-optimized",
      "dsa-rod-cutting-problem-unbounded-knapsack",
      "dsa-longest-common-subsequence-dp-on-strings",
      "dsa-print-longest-common-subsequence",
      "dsa-longest-common-substring-dp-on-strings",
      "dsa-longest-palindromic-subsequence",
      "dsa-minimum-insertions-to-make-string-palindrome",
    ];

    const expectedSubtracks = {
      201: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      202: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      203: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      204: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      205: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      206: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      207: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      208: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      209: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      210: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
    };

    batch21Topics.forEach((t) => {
      const idx = t.topic_order - 201;
      assert(t.slug === expectedBatch21Slugs[idx], `Topic #${t.topic_order} has expected slug '${expectedBatch21Slugs[idx]}'`);
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

    // 4. Zero LaTeX / $ Symbol / [cite:...] Verification across ALL 210 topics
    console.log("\n🛡️ Verifying Zero LaTeX / $ / [cite:...] Artifact Policy across ALL 210 Topics:");
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

    assert(artifactViolations === 0, `Zero LaTeX, $, or citation violations across all 210 topics (Violations: ${artifactViolations})`);

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

    assert(subtracks.includes("Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack"), "Includes Module 30 (Dynamic Programming on Subsequences)");
    assert(subtracks.includes("Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences"), "Includes Module 31 (Dynamic Programming on Strings)");

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
  verifyDsaBatch21();
}

module.exports = verifyDsaBatch21;
