const pool = require("../config/db");

async function verifyDsaBatch27() {
  console.log("🔍 Verifying DSA Curriculum Batches 1 to 27 (Topics 1–270) in 'problem-solving-dsa-sql'...\n");

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
    assert(topics.length === 270, `Track has exactly 270 topics (Found: ${topics.length})`);

    // Verify topic_order sequence 1 through 270
    const orders = topics.map((t) => t.topic_order);
    const expectedOrders = Array.from({ length: 270 }, (_, i) => i + 1);
    assert(
      JSON.stringify(orders) === JSON.stringify(expectedOrders),
      `Topic orders are sequentially 1 through 270: [${orders.slice(0, 5).join(", ")} ... ${orders.slice(-5).join(", ")}]`
    );

    // 3. Verify Batch 27 Specific Topics (Orders 261 to 270)
    console.log("\n📦 Verifying Batch 27 Topics (Orders 261 to 270):");
    const batch27Topics = topics.filter((t) => t.topic_order >= 261 && t.topic_order <= 270);
    assert(batch27Topics.length === 10, `Batch 27 contains exactly 10 topics (Found: ${batch27Topics.length})`);

    const expectedBatch27Slugs = [
      "dsa-merge-k-sorted-linked-lists-min-heap",
      "dsa-sort-a-linked-list-merge-sort",
      "dsa-clone-linked-list-with-next-and-random-pointers",
      "dsa-design-browser-history-doubly-linked-list",
      "dsa-print-all-divisors-of-a-number",
      "dsa-check-if-a-number-is-prime-or-not",
      "dsa-print-all-prime-factors-of-a-number",
      "dsa-power-exponentiation-binary-exponentiation",
      "dsa-sieve-of-eratosthenes-all-primes-up-to-n",
      "dsa-count-primes-in-range-l-to-r-sieve-prefix-sum",
    ];

    const expectedSubtrackM38 = "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)";
    const expectedSubtrackM39 = "Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation";

    batch27Topics.forEach((t) => {
      const idx = t.topic_order - 261;
      assert(t.slug === expectedBatch27Slugs[idx], `Topic #${t.topic_order} has expected slug '${expectedBatch27Slugs[idx]}'`);
      
      const expectedSubtrack = t.topic_order <= 264 ? expectedSubtrackM38 : expectedSubtrackM39;
      assert(t.subtrack === expectedSubtrack, `Topic #${t.topic_order} has subtrack '${expectedSubtrack}'`);
      assert(t.summary_markdown && t.summary_markdown.length > 50, `Topic #${t.topic_order} has substantial summary_markdown (${t.summary_markdown ? t.summary_markdown.length : 0} chars)`);

      // Video links check
      const videos = typeof t.video_links === "string" ? JSON.parse(t.video_links) : (t.video_links || []);
      const hasYoutube = videos.some((v) => v.url && v.url.includes("youtube.com"));
      assert(hasYoutube, `Topic #${t.topic_order} has embedded YouTube lecture URL (${videos[0] ? videos[0].url : "none"})`);

      // Practice items check
      const practice = typeof t.practice_items === "string" ? JSON.parse(t.practice_items) : (t.practice_items || []);
      assert(practice.length === 3, `Topic #${t.topic_order} has 3 extra practice problems (Found: ${practice.length})`);
    });

    // 4. Zero LaTeX / $ Symbol / [cite:...] Verification across ALL 270 topics
    console.log("\n🛡️ Verifying Zero LaTeX / $ / [cite:...] Artifact Policy across ALL 270 Topics:");
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

    assert(artifactViolations === 0, `Zero LaTeX, $, or citation violations across all 270 topics (Violations: ${artifactViolations})`);

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
      subtracks.includes(expectedSubtrackM38),
      "Roadmap contains Module 38"
    );
    assert(
      subtracks.includes(expectedSubtrackM39),
      "Roadmap contains Module 39"
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
  verifyDsaBatch27();
}

module.exports = verifyDsaBatch27;
