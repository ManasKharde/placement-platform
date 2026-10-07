const http = require("http");

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
    console.log("=== PHASE 2 BACKEND VERIFICATION SUITE ===");

    // 1. Authenticate user
    const uniqueUser = "verifier_p2_" + Math.random().toString(36).substring(2, 7);
    const signupRes = await request(
      "/api/auth/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      {
        username: uniqueUser,
        email: uniqueUser + "@example.com",
        password: "Password123!",
      }
    );

    if (signupRes.status !== 201) {
      throw new Error("Failed to create test user: " + JSON.stringify(signupRes.data));
    }

    const cookies = signupRes.headers["set-cookie"];
    const cookieHeader = cookies ? cookies.map((c) => c.split(";")[0]).join("; ") : "";
    const authHeaders = {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    };

    console.log("✅ Authenticated test session created. Status:", signupRes.status);

    // 2. Select path
    const pathsRes = await request("/api/preparation-paths", { method: "GET", headers: authHeaders });
    const targetPath = pathsRes.data.paths[0];
    await request("/api/user/preparation-path", { method: "POST", headers: authHeaders }, { pathId: targetPath.id, dailyHours: 2 });
    console.log("✅ Configured active path:", targetPath.name);

    // 3. Get roadmap to find topics
    const roadmapRes = await request("/api/user/roadmap", { method: "GET", headers: authHeaders });
    const firstTrack = roadmapRes.data?.roadmap?.tracks?.[0];
    const testTopic = firstTrack?.topics?.[0];

    if (!testTopic) {
      throw new Error("No topics found in active roadmap to test.");
    }
    console.log(`✅ Selected Test Topic: [ID ${testTopic.id}] ${testTopic.name}`);

    // 4. Test GET /api/topics/:topicId
    console.log(`\n--- Testing GET /api/topics/${testTopic.id} ---`);
    const detailRes = await request(`/api/topics/${testTopic.id}`, { method: "GET", headers: authHeaders });

    if (detailRes.status !== 200) {
      throw new Error(`GET /api/topics/${testTopic.id} failed with status ${detailRes.status}: ${JSON.stringify(detailRes.data)}`);
    }

    const topic = detailRes.data?.topic;
    console.log("Status Code:", detailRes.status);
    console.log("Topic Title:", topic.title);
    console.log("Pillar:", topic.pillar_name);
    console.log("Track:", topic.track_name);
    console.log("Estimated Minutes:", topic.estimated_minutes);
    console.log("User Completion Status:", topic.status);
    console.log("Theory Summary Length:", topic.theory_summary?.length || 0, "chars");
    console.log("Doc Links Count:", topic.doc_links?.length || 0);
    console.log("Video Links Count:", topic.video_links?.length || 0);
    console.log("Practice Items Count:", topic.practice_items?.length || 0);

    // Assert essential properties exist
    if (!topic.title || !topic.theory_summary || !Array.isArray(topic.doc_links) || !Array.isArray(topic.video_links)) {
      throw new Error("Missing required topic payload fields!");
    }
    console.log("✅ Topic detail response contains all rich learning payload fields.");

    // 5. Test Toggle POST /api/user/topics/:topicId/toggle
    console.log(`\n--- Testing POST /api/user/topics/${testTopic.id}/toggle (Mark Completed) ---`);
    const toggleOnRes = await request(
      `/api/user/topics/${testTopic.id}/toggle`,
      { method: "POST", headers: authHeaders },
      { status: "completed" }
    );
    console.log("Toggle ON Status:", toggleOnRes.status, "New Status:", toggleOnRes.data?.status);

    // Verify detail reflects completed status
    const verifiedOnRes = await request(`/api/topics/${testTopic.id}`, { method: "GET", headers: authHeaders });
    console.log("Verified Status in Topic Detail:", verifiedOnRes.data?.topic?.status);
    if (verifiedOnRes.data?.topic?.status !== "completed") {
      throw new Error("Expected topic status to be 'completed'!");
    }

    // Toggle back to not_started
    console.log(`\n--- Testing POST /api/user/topics/${testTopic.id}/toggle (Mark Incomplete) ---`);
    const toggleOffRes = await request(
      `/api/user/topics/${testTopic.id}/toggle`,
      { method: "POST", headers: authHeaders },
      { status: "not_started" }
    );
    console.log("Toggle OFF Status:", toggleOffRes.status, "New Status:", toggleOffRes.data?.status);

    const verifiedOffRes = await request(`/api/topics/${testTopic.id}`, { method: "GET", headers: authHeaders });
    console.log("Verified Status in Topic Detail:", verifiedOffRes.data?.topic?.status);
    if (verifiedOffRes.data?.topic?.status !== "not_started") {
      throw new Error("Expected topic status to be 'not_started'!");
    }

    console.log("\n=======================================================");
    console.log("🎉 ALL PHASE 2 BACKEND VERIFICATIONS COMPLETED SUCCESSFULLY!");
    console.log("=======================================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  }
})();
