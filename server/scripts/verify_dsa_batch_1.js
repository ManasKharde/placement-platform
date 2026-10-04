const http = require("http");
const pool = require("../config/db");

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request("http://localhost:3000" + path, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  try {
    console.log("===============================================================");
    console.log("🧪 VERIFYING DSA BATCH 1 (ZERO LATEX & 0 LEGACY TOPICS)");
    console.log("===============================================================\n");

    // 1. Direct DB Consistency Check
    console.log("--- 1. Database Track & Topic Count Assertion ---");
    const trackRes = await pool.query(
      `SELECT t.id, t.name, t.slug 
       FROM tracks t 
       WHERE t.slug = 'problem-solving-dsa-sql'`
    );

    if (trackRes.rows.length === 0) {
      throw new Error("Track 'problem-solving-dsa-sql' not found in database!");
    }
    const track = trackRes.rows[0];
    console.log(`✅ Track confirmed: "${track.name}" (ID: ${track.id}, Slug: ${track.slug})`);

    const topicsRes = await pool.query(
      `SELECT tt.topic_order, top.id, top.name, top.slug, top.subtrack, 
              top.summary_markdown, top.theory_summary,
              top.video_links, top.practice_items, LENGTH(top.summary_markdown) as summary_len
       FROM track_topics tt
       JOIN topics top ON tt.topic_id = top.id
       WHERE tt.track_id = $1
       ORDER BY tt.topic_order ASC`,
      [track.id]
    );

    console.log(`✅ Total topics in track: ${topicsRes.rows.length}`);
    if (topicsRes.rows.length !== 10) {
      throw new Error(`Expected EXACTLY 10 topics in track 'problem-solving-dsa-sql', found ${topicsRes.rows.length}! Legacy demo topics must be removed.`);
    }

    const batch1Expected = [
      { order: 1, subtrack: "Module 1: Algorithmic Foundations & Environment", slug: "algorithmic-problem-solving-methodology" },
      { order: 2, subtrack: "Module 1: Algorithmic Foundations & Environment", slug: "competitive-programming-environment-io-redirection" },
      { order: 3, subtrack: "Module 1: Algorithmic Foundations & Environment", slug: "programming-constructs-data-types-memory-passing" },
      { order: 4, subtrack: "Module 1: Algorithmic Foundations & Environment", slug: "asymptotic-analysis-big-o-space-complexity" },
      { order: 5, subtrack: "Module 2: Nested Loop Mechanics & Coordinate Patterns", slug: "grid-nested-loop-patterns-symmetry-distance" },
      { order: 6, subtrack: "Module 3: Standard Template Library (STL) & Containers", slug: "cpp-stl-containers-iterators-comparators" },
      { order: 7, subtrack: "Module 4: Number Theory & Mathematical Foundations", slug: "number-theory-digit-extraction-sqrt-euclidean-gcd" },
      { order: 8, subtrack: "Module 5: Recursion & Call Stack Mechanics", slug: "recursion-call-stack-frames-base-conditions" },
      { order: 9, subtrack: "Module 5: Recursion & Call Stack Mechanics", slug: "linear-recursion-backtracking-unwinding" },
      { order: 10, subtrack: "Module 5: Recursion & Call Stack Mechanics", slug: "parameterized-vs-functional-recursion-recurrence" },
    ];

    console.log("\n--- 2. Zero LaTeX & Content Quality Verification ---");
    const forbiddenPatterns = [
      { regex: /\$/, name: "Dollar sign ($)" },
      { regex: /\\to/, name: "LaTeX \\to" },
      { regex: /\\infty/, name: "LaTeX \\infty" },
      { regex: /\\sqrt/, name: "LaTeX \\sqrt" },
    ];

    for (const exp of batch1Expected) {
      const actual = topicsRes.rows[exp.order - 1];
      if (!actual) throw new Error(`Missing topic at order ${exp.order}`);
      if (actual.slug !== exp.slug) {
        throw new Error(`Order #${exp.order} slug mismatch: expected ${exp.slug}, got ${actual.slug}`);
      }
      if (actual.subtrack !== exp.subtrack) {
        throw new Error(`Order #${exp.order} subtrack mismatch: expected ${exp.subtrack}, got ${actual.subtrack}`);
      }

      // Check for forbidden LaTeX or dollar signs
      const textsToCheck = [
        { label: "summary_markdown", text: actual.summary_markdown },
        { label: "theory_summary", text: actual.theory_summary },
      ];

      const pItems = actual.practice_items || [];
      pItems.forEach((pi, idx) => {
        textsToCheck.push({ label: `practice_items[${idx}].description`, text: pi.description });
        textsToCheck.push({ label: `practice_items[${idx}].title`, text: pi.title });
      });

      for (const item of textsToCheck) {
        if (!item.text) continue;
        for (const fp of forbiddenPatterns) {
          if (fp.regex.test(item.text)) {
            throw new Error(`Topic #${actual.topic_order} (${actual.name}) contains forbidden ${fp.name} in ${item.label}! Text snippet: "${item.text.substring(0, 100)}..."`);
          }
        }
      }

      const vLinks = actual.video_links || [];
      if (vLinks.length === 0) throw new Error(`Order #${exp.order} (${actual.name}) missing video link!`);
      if (pItems.length === 0) throw new Error(`Order #${exp.order} (${actual.name}) missing practice items!`);

      console.log(`   ✓ #${actual.topic_order.toString().padStart(2)}: [${actual.subtrack}]`);
      console.log(`       "${actual.name}"`);
      console.log(`       Video: ${vLinks[0]?.url} | Practice: ${pItems.length} items | Clean Summary: ${actual.summary_len} chars (0 LaTeX)`);
    }

    // 3. HTTP Endpoint Verification: GET /api/user/roadmap and GET /api/topics/:id
    console.log("\n--- 3. HTTP API Endpoint Verification ---");
    const uniqueUser = "dsa_clean_" + Math.random().toString(36).substring(2, 7);
    const signupRes = await request(
      "/api/auth/signup",
      { method: "POST", headers: { "Content-Type": "application/json" } },
      { username: uniqueUser, email: uniqueUser + "@test.com", password: "Password123!" }
    );

    if (signupRes.status !== 201) {
      throw new Error("Failed to create test user: " + JSON.stringify(signupRes.data));
    }

    const cookies = signupRes.headers["set-cookie"];
    const cookieHeader = cookies ? cookies.map((c) => c.split(";")[0]).join("; ") : "";
    const authHeaders = { "Content-Type": "application/json", Cookie: cookieHeader };

    // Select active path (nodejs-backend-developer has problem-solving-dsa-sql)
    const pathsRes = await request("/api/preparation-paths", { method: "GET", headers: authHeaders });
    const targetPath = pathsRes.data.paths.find((p) => p.slug === "nodejs-backend-developer") || pathsRes.data.paths[0];
    await request("/api/user/preparation-path", { method: "POST", headers: authHeaders }, { pathId: targetPath.id, dailyHours: 2 });

    // Test GET /api/user/roadmap
    const roadmapRes = await request("/api/user/roadmap", { method: "GET", headers: authHeaders });
    if (roadmapRes.status !== 200) {
      throw new Error(`Roadmap returned status ${roadmapRes.status}: ${JSON.stringify(roadmapRes.data)}`);
    }

    const tracks = roadmapRes.data.tracks || roadmapRes.data.roadmap?.tracks || [];
    const dsaTrack = tracks.find((t) => t.slug === "problem-solving-dsa-sql");
    if (!dsaTrack) {
      throw new Error("Track 'problem-solving-dsa-sql' not present in GET /api/user/roadmap response!");
    }

    console.log(`✅ GET /api/user/roadmap returned track "${dsaTrack.name}" with EXACTLY ${dsaTrack.topics.length} topics (0 legacy topics)`);
    if (dsaTrack.topics.length !== 10) {
      throw new Error(`Expected exactly 10 topics in roadmap for DSA track, got ${dsaTrack.topics.length}`);
    }

    const firstDsaTopic = dsaTrack.topics[0];
    if (!firstDsaTopic.subtrack) {
      throw new Error("firstDsaTopic.subtrack is undefined or empty in GET /api/user/roadmap!");
    }
    console.log(`✅ Topic #1 in roadmap has subtrack: "${firstDsaTopic.subtrack}"`);

    // Test GET /api/topics/:id for Topic 1
    const topicDetailRes = await request(`/api/topics/${firstDsaTopic.id}`, { method: "GET", headers: authHeaders });
    if (topicDetailRes.status !== 200) {
      throw new Error(`GET /api/topics/${firstDsaTopic.id} returned status ${topicDetailRes.status}`);
    }

    const topicDetail = topicDetailRes.data.topic;
    console.log(`\n--- 4. Topic Detail Payload Verification [Topic ID: ${topicDetail.id}] ---`);
    console.log(`   ✓ Name: "${topicDetail.name}"`);
    console.log(`   ✓ Subtrack: "${topicDetail.subtrack}"`);
    console.log(`   ✓ Summary Length: ${topicDetail.theory_summary?.length} chars`);
    console.log(`   ✓ Video Links: ${topicDetail.video_links?.length} (Primary: ${topicDetail.video_links?.[0]?.url})`);
    console.log(`   ✓ Practice Items: ${topicDetail.practice_items?.length} items`);

    // Verify topic detail payload also has 0 LaTeX/$
    for (const fp of forbiddenPatterns) {
      if (fp.regex.test(topicDetail.theory_summary)) {
        throw new Error(`Topic detail contains forbidden ${fp.name}!`);
      }
    }

    console.log("\n===============================================================");
    console.log("🎉 ALL VERIFICATION CHECKS PASSED: ZERO LATEX & 0 LEGACY TOPICS!");
    console.log("===============================================================\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Verification failed:", err);
    process.exit(1);
  }
})();
