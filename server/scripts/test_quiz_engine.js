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
    console.log("=== QUIZ ENGINE BACKEND VERIFICATION SUITE ===");

    // 1. Authenticate test user
    const uniqueUser = "verifier_quiz_" + Math.random().toString(36).substring(2, 7);
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
      throw new Error("Failed to create test session: " + JSON.stringify(signupRes.data));
    }

    const cookies = signupRes.headers["set-cookie"];
    const cookieHeader = cookies ? cookies.map((c) => c.split(";")[0]).join("; ") : "";
    const authHeaders = {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    };
    console.log("✅ 1. Authenticated test session created.");

    // 2. Select active path
    const pathsRes = await request("/api/preparation-paths", { method: "GET", headers: authHeaders });
    const targetPath = pathsRes.data.paths.find((p) => p.slug === "nodejs-backend-developer") || pathsRes.data.paths[0];
    await request("/api/user/preparation-path/switch", { method: "POST", headers: authHeaders }, { pathId: targetPath.id });
    console.log(`✅ 2. Active path set to: ${targetPath.name}`);

    // 3. Locate the OS topic quiz (slug: os-concurrency-deadlocks-memory)
    const roadmapRes = await request("/api/user/roadmap", { method: "GET", headers: authHeaders });
    let osTopic = null;
    roadmapRes.data?.roadmap?.tracks?.forEach((t) => {
      t.topics?.forEach((top) => {
        if (top.slug === "os-concurrency-deadlocks-memory") {
          osTopic = top;
        }
      });
    });

    if (!osTopic) {
      throw new Error("OS topic with slug 'os-concurrency-deadlocks-memory' not found in roadmap!");
    }
    console.log(`✅ 3. Found OS Topic: [ID ${osTopic.id}] "${osTopic.name}"`);

    // Reset initial user progress for this topic to not_started
    await request(`/api/user/topics/${osTopic.id}/toggle`, { method: "POST", headers: authHeaders }, { status: "not_started" });

    // 4. Test GET /api/topics/:topicId/quiz (SECURITY CHECK: No answer leak)
    console.log(`\n--- 4. Testing GET /api/topics/${osTopic.id}/quiz ---`);
    const quizRes = await request(`/api/topics/${osTopic.id}/quiz`, { method: "GET", headers: authHeaders });
    if (quizRes.status !== 200 || !quizRes.data?.hasQuiz) {
      throw new Error(`Failed to fetch quiz: status ${quizRes.status}, data: ${JSON.stringify(quizRes.data)}`);
    }

    const { quiz, questions } = quizRes.data;
    console.log("Status:", quizRes.status);
    console.log("Quiz Title:", quiz.title);
    console.log("Time Limit:", quiz.time_limit_minutes, "minutes | Passing %:", quiz.passing_percentage);
    console.log("Questions Count:", questions.length);

    // SECURITY VERIFICATION: Ensure neither correct_option_index nor explanation is leaked!
    for (const q of questions) {
      if (q.correct_option_index !== undefined) {
        throw new Error(`SECURITY LEAK DETECTED: Question ${q.id} leaks correct_option_index!`);
      }
      if (q.explanation !== undefined) {
        throw new Error(`SECURITY LEAK DETECTED: Question ${q.id} leaks explanation!`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${q.id} does not have exactly 4 options!`);
      }
    }
    console.log("🔒 SECURITY VERIFIED: Zero answer indices or explanations leaked in GET response.");

    // 5. Test POST /api/topics/:topicId/quiz/submit with FAILING answers (e.g. all 0s, expected < 70%)
    console.log(`\n--- 5. Testing FAILING submission ---`);
    const failingAnswers = {};
    questions.forEach((q) => {
      // Pick index 0 for all questions (only Q3 and Q4 have correct index != 0 in our seed)
      failingAnswers[q.id] = 0;
    });

    const failSubmitRes = await request(
      `/api/topics/${osTopic.id}/quiz/submit`,
      { method: "POST", headers: authHeaders },
      { answers: failingAnswers }
    );

    console.log("Fail Submit Status:", failSubmitRes.status);
    console.log(`Score: ${failSubmitRes.data?.score}/${failSubmitRes.data?.total_questions} (${failSubmitRes.data?.percentage}%)`);
    console.log("Passed:", failSubmitRes.data?.passed);

    if (failSubmitRes.data?.passed !== false) {
      throw new Error("Expected test submission to fail, but it passed!");
    }

    // Verify user progress is NOT completed
    const topicAfterFail = await request(`/api/topics/${osTopic.id}`, { method: "GET", headers: authHeaders });
    console.log("Topic Progress Status After Fail:", topicAfterFail.data?.topic?.status);
    if (topicAfterFail.data?.topic?.status === "completed") {
      throw new Error("GATEWAY LEAK: Topic was marked completed despite failing the assessment!");
    }
    console.log("✅ GATEWAY VERIFIED: Failing score does NOT mark topic as completed.");

    // 6. Test POST /api/topics/:topicId/quiz/submit with PASSING answers (100% correct)
    console.log(`\n--- 6. Testing PASSING submission (100% correct) ---`);
    // From our review or seed:
    // Q1: "Preemption Allowed" -> index 2
    // Q2: "Excessive paging activity..." -> index 1
    // Q3: "Threads of the same process share..." -> index 1
    // Q4: "fork()" -> index 1
    // Q5: "Shortest Job First (SJF)" -> index 2
    const correctAnswers = {};
    failSubmitRes.data.review.forEach((item) => {
      correctAnswers[item.questionId] = item.correct_option_index;
    });

    const passSubmitRes = await request(
      `/api/topics/${osTopic.id}/quiz/submit`,
      { method: "POST", headers: authHeaders },
      { answers: correctAnswers }
    );

    console.log("Pass Submit Status:", passSubmitRes.status);
    console.log(`Score: ${passSubmitRes.data?.score}/${passSubmitRes.data?.total_questions} (${passSubmitRes.data?.percentage}%)`);
    console.log("Passed:", passSubmitRes.data?.passed);

    if (passSubmitRes.data?.passed !== true) {
      throw new Error("Expected 100% submission to pass, but passed is false!");
    }

    // Verify review payload contains explanations
    for (const r of passSubmitRes.data.review) {
      if (!r.explanation) {
        throw new Error(`Review for question ${r.questionId} missing explanation!`);
      }
    }
    console.log("✅ Review payload contains complete explanations for all questions.");

    // 7. CRITICAL GATEWAY: Verify topic status in user_progress is now 'completed'
    const topicAfterPass = await request(`/api/topics/${osTopic.id}`, { method: "GET", headers: authHeaders });
    console.log("Topic Progress Status After Pass:", topicAfterPass.data?.topic?.status);
    if (topicAfterPass.data?.topic?.status !== "completed") {
      throw new Error("GATEWAY FAILED: Topic status was NOT updated to 'completed' after passing assessment!");
    }
    console.log("🎯 CRITICAL GATEWAY VERIFIED: Topic automatically marked as completed in database upon passing!");

    // 8. Verify GET now returns latest_attempt with passed status
    const quizWithAttemptRes = await request(`/api/topics/${osTopic.id}/quiz`, { method: "GET", headers: authHeaders });
    console.log("Latest Attempt in Quiz GET:", quizWithAttemptRes.data?.latest_attempt?.percentage + "% passed:", quizWithAttemptRes.data?.latest_attempt?.passed);
    if (!quizWithAttemptRes.data?.latest_attempt?.passed) {
      throw new Error("Latest attempt was not returned in quiz metadata!");
    }

    console.log("\n=======================================================");
    console.log("🎉 ALL QUIZ ENGINE BACKEND VERIFICATIONS PASSED!");
    console.log("=======================================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  }
})();
