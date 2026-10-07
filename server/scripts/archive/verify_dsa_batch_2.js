const pool = require("../config/db");

async function verifyDsaBatch2() {
  console.log("🔍 Verifying DSA Curriculum Batches 1 & 2 (Topics 1–20) in 'problem-solving-dsa-sql'...\n");

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
              t.summary_markdown, t.theory_summary, t.video_links, t.practice_items, t.doc_links
       FROM track_topics tt
       JOIN topics t ON tt.topic_id = t.id
       WHERE tt.track_id = $1
       ORDER BY tt.topic_order ASC`,
      [trackId]
    );

    const topics = topicsRes.rows;
    console.log(`\n📊 Total Topics Found in Track: ${topics.length}`);
    assert(topics.length === 20, `Track has exactly 20 topics (Found: ${topics.length})`);

    // Verify topic_order sequence 1 through 20
    const orders = topics.map((t) => t.topic_order);
    const expectedOrders = Array.from({ length: 20 }, (_, i) => i + 1);
    assert(
      JSON.stringify(orders) === JSON.stringify(expectedOrders),
      `Topic orders are sequentially 1 through 20: [${orders.join(", ")}]`
    );

    // 3. Verify Batch 2 Specific Topics (Orders 11 to 20)
    console.log("\n📦 Verifying Batch 2 Topics (Orders 11 to 20):");
    const batch2Topics = topics.filter((t) => t.topic_order >= 11 && t.topic_order <= 20);
    assert(batch2Topics.length === 10, `Batch 2 contains exactly 10 topics (Found: ${batch2Topics.length})`);

    const expectedBatch2Slugs = [
      "dsa-functional-recursion-arrays-palindromes",
      "dsa-multiple-recursion-calls-execution-trees",
      "dsa-hashing-frequency-maps-collisions",
      "dsa-elementary-sorting-selection-bubble-insertion",
      "dsa-merge-sort-divide-and-conquer",
      "dsa-arrays-largest-and-second-largest-single-pass",
      "dsa-arrays-sorted-check-and-inplace-deduplication",
      "dsa-array-rotations-move-zeroes-union-intersection",
      "dsa-arrays-xor-missing-number-consecutive-ones",
      "dsa-longest-subarray-with-sum-k-prefix-sum-sliding-window",
    ];

    const expectedModules = {
      11: "Module 5: Recursion & Call Stack Mechanics",
      12: "Module 5: Recursion & Call Stack Mechanics",
      13: "Module 6: Hashing & Frequency Precomputation",
      14: "Module 7: Classical & Divide-and-Conquer Sorting Algorithms",
      15: "Module 7: Classical & Divide-and-Conquer Sorting Algorithms",
      16: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
      17: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
      18: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
      19: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
      20: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
    };

    batch2Topics.forEach((t) => {
      const idx = t.topic_order - 11;
      assert(t.slug === expectedBatch2Slugs[idx], `Topic #${t.topic_order} has expected slug '${expectedBatch2Slugs[idx]}'`);
      assert(t.subtrack === expectedModules[t.topic_order], `Topic #${t.topic_order} has subtrack '${expectedModules[t.topic_order]}'`);
      assert(t.summary_markdown && t.summary_markdown.length > 50, `Topic #${t.topic_order} has substantial summary_markdown (${t.summary_markdown ? t.summary_markdown.length : 0} chars)`);

      // Video links check
      const videos = typeof t.video_links === "string" ? JSON.parse(t.video_links) : (t.video_links || []);
      const hasYoutube = videos.some((v) => v.url && v.url.includes("youtube.com"));
      assert(hasYoutube, `Topic #${t.topic_order} has embedded YouTube lecture URL (${videos[0] ? videos[0].url : "none"})`);

      // Practice items check
      const practice = typeof t.practice_items === "string" ? JSON.parse(t.practice_items) : (t.practice_items || []);
      assert(practice.length >= 2, `Topic #${t.topic_order} has >= 2 extra practice problems (Found: ${practice.length})`);
    });

    // 4. Zero LaTeX / $ Symbol Verification across ALL 20 topics
    console.log("\n🛡️ Verifying Zero LaTeX / $ Symbol Policy across ALL 20 Topics:");
    const latexPatterns = [
      { name: "Dollar sign ($)", regex: /\$/ },
      { name: "LaTeX \\to", regex: /\\to\b/ },
      { name: "LaTeX \\infty", regex: /\\infty\b/ },
      { name: "LaTeX \\sqrt", regex: /\\sqrt\b/ },
      { name: "LaTeX \\log", regex: /\\log\b/ },
      { name: "LaTeX \\times", regex: /\\times\b/ },
      { name: "LaTeX \\le / \\ge", regex: /\\(le|ge)\b/ },
    ];

    let latexViolations = 0;
    topics.forEach((t) => {
      const textFields = [
        { field: "summary_markdown", value: t.summary_markdown || "" },
        { field: "theory_summary", value: t.theory_summary || "" },
      ];

      // Also inspect practice items text
      const practice = typeof t.practice_items === "string" ? JSON.parse(t.practice_items) : (t.practice_items || []);
      practice.forEach((item, pIdx) => {
        textFields.push({ field: `practice_items[${pIdx}].title`, value: item.title || "" });
        textFields.push({ field: `practice_items[${pIdx}].description`, value: item.description || "" });
      });

      for (const tf of textFields) {
        for (const pattern of latexPatterns) {
          if (pattern.regex.test(tf.value)) {
            console.error(`  ❌ LATEX VIOLATION in Topic #${t.topic_order} (${t.slug}) field '${tf.field}': matched ${pattern.name}`);
            latexViolations++;
          }
        }
      }
    });

    assert(latexViolations === 0, `Zero LaTeX or $ symbol violations across all 20 topics (Violations: ${latexViolations})`);

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

    assert(subtracks.includes("Module 5: Recursion & Call Stack Mechanics"), "Includes Module 5");
    assert(subtracks.includes("Module 6: Hashing & Frequency Precomputation"), "Includes Module 6");
    assert(subtracks.includes("Module 7: Classical & Divide-and-Conquer Sorting Algorithms"), "Includes Module 7");
    assert(subtracks.includes("Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums"), "Includes Module 8");

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
  verifyDsaBatch2();
}

module.exports = verifyDsaBatch2;
