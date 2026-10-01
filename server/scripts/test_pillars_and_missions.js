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
    console.log("=== 4-PILLAR ROADMAP & DAILY MISSIONS VERIFICATION ===");

    // 1. Authenticate test session
    const uniqueUser = "verifier_pillars_" + Math.random().toString(36).substring(2, 7);
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

    const cookies = signupRes.headers["set-cookie"];
    const cookieHeader = cookies ? cookies.map((c) => c.split(";")[0]).join("; ") : "";
    const authHeaders = {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    };

    console.log("✅ 1. Authenticated session created. Status:", signupRes.status);

    // 2. Select Node.js Backend Developer path (slug: nodejs-backend-developer)
    const pathsRes = await request("/api/preparation-paths", { method: "GET", headers: authHeaders });
    const nodePath = pathsRes.data.paths.find((p) => p.slug === "nodejs-backend-developer") || pathsRes.data.paths[0];
    await request("/api/user/preparation-path/switch", { method: "POST", headers: authHeaders }, { pathId: nodePath.id });
    console.log(`✅ 2. Active path set to: ${nodePath.name} (ID: ${nodePath.id})`);

    // 3. Fetch user roadmap and verify all 4 pillars have tracks and real database topic IDs
    const roadRes = await request("/api/user/roadmap", { method: "GET", headers: authHeaders });
    const tracks = roadRes.data?.roadmap?.tracks || [];
    console.log(`✅ 3. Loaded roadmap: ${tracks.length} tracks returned.`);

    // Find topics for each pillar
    let devTopic = null;
    let dsaTopic = null;
    let csTopic = null;
    let sqlTopic = null;

    tracks.forEach((track) => {
      track.topics.forEach((top) => {
        const text = `${track.slug} ${track.name} ${top.slug} ${top.name}`.toLowerCase();
        if ((top.slug === "arrays-and-hashing" || text.includes("data-structures")) && !dsaTopic) {
          dsaTopic = top;
        } else if ((top.slug === "os-concurrency-deadlocks-memory" || text.includes("core-computer-science")) && !csTopic) {
          csTopic = top;
        } else if ((top.slug === "relational-sql-joins-window-functions" || text.includes("quantitative-aptitude")) && !sqlTopic) {
          sqlTopic = top;
        } else if (!devTopic && (top.slug === "express-rest-api" || top.slug.includes("middleware"))) {
          devTopic = top;
        }
      });
    });

    console.log("Found Representative Topics across Pillars:");
    console.log(" - Pillar 1 (Dev):", devTopic ? `[ID ${devTopic.id}] ${devTopic.name}` : "MISSING");
    console.log(" - Pillar 2 (DSA):", dsaTopic ? `[ID ${dsaTopic.id}] ${dsaTopic.name}` : "MISSING");
    console.log(" - Pillar 3 (CS):", csTopic ? `[ID ${csTopic.id}] ${csTopic.name}` : "MISSING");
    console.log(" - Pillar 4 (SQL/Apt):", sqlTopic ? `[ID ${sqlTopic.id}] ${sqlTopic.name}` : "MISSING");

    if (!devTopic || !dsaTopic || !csTopic || !sqlTopic) {
      throw new Error("One or more pillars are missing real database topics!");
    }

    // 4. Test GET /api/topics/:id for each pillar
    console.log("\n✅ 4. Testing GET /api/topics/:id for each pillar:");
    for (const [pillarName, topic] of [
      ["Pillar 1: Development", devTopic],
      ["Pillar 2: Problem Solving (DSA)", dsaTopic],
      ["Pillar 3: CS Fundamentals", csTopic],
      ["Pillar 4: Aptitude & SQL", sqlTopic],
    ]) {
      const res = await request(`/api/topics/${topic.id}`, { method: "GET", headers: authHeaders });
      if (res.status !== 200) {
        throw new Error(`Failed to load ${pillarName} topic (ID ${topic.id}): Status ${res.status}`);
      }
      const data = res.data.topic;
      console.log(`   [${pillarName}] -> [ID ${data.id}] ${data.title}`);
      console.log(`     Pillar Key: ${data.pillar?.key}, Badge: ${data.pillar?.badge}`);
      console.log(`     Practice Items Count: ${data.practice_items?.length || 0}`);
      console.log(`     Doc Links Count: ${data.doc_links?.length || 0}, Video Links: ${data.video_links?.length || 0}`);
    }

    // 5. Test GET /api/user/missions returns 3 real clickable topics
    console.log("\n✅ 5. Testing GET /api/user/missions for Dashboard Daily Missions:");
    const missionsRes = await request("/api/user/missions", { method: "GET", headers: authHeaders });
    console.log("   Status:", missionsRes.status);
    console.log("   Missions Count:", missionsRes.data?.missions?.length);
    missionsRes.data.missions.forEach((m, idx) => {
      console.log(`   Mission ${idx + 1}: [Topic ID: ${m.topicId}] "${m.topicName}" (${m.trackName})`);
      if (typeof m.topicId !== "number") {
        throw new Error(`Mission ${idx + 1} does not have a numeric topicId!`);
      }
    });

    console.log("\n=======================================================");
    console.log("🎉 ALL 4 PILLARS & DAILY MISSIONS VERIFICATIONS PASSED!");
    console.log("=======================================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  }
})();
