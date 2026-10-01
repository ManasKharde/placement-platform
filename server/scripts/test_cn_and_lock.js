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
  let createdUserId = null;
  try {
    console.log("=== VERIFICATION SUITE: CN QUIZ & COMPLETION GATEWAY ===");

    // 1. Authenticate test user
    const uniqueUser = "verifier_cn_" + Math.random().toString(36).substring(2, 7);
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

    createdUserId = signupRes.data?.user?.id;
    const cookies = signupRes.headers["set-cookie"];
    const cookieHeader = cookies ? cookies.map((c) => c.split(";")[0]).join("; ") : "";
    const authHeaders = {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    };
    console.log(`✅ 1. Authenticated test session created (User ID: ${createdUserId}).`);

    // 2. Locate Topic 50 ("Computer Networks: TCP/IP, HTTP/HTTPS, WebSockets & DNS")
    const topicRes = await pool.query(
      "SELECT id, name, slug FROM topics WHERE id = 50 OR slug = 'networks-tcp-http-websockets-dns' LIMIT 1"
    );
    if (topicRes.rows.length === 0) {
      throw new Error("Computer Networks topic not found in database!");
    }
    const cnTopic = topicRes.rows[0];
    console.log(`✅ 2. Verified Computer Networks Topic: [ID ${cnTopic.id}] "${cnTopic.name}"`);

    // 3. Test GET /api/topics/:topicId/quiz (Verify 5 questions & no leaked answers)
    console.log(`\n--- 3. Testing GET /api/topics/${cnTopic.id}/quiz ---`);
    const quizRes = await request(`/api/topics/${cnTopic.id}/quiz`, { method: "GET", headers: authHeaders });
    if (quizRes.status !== 200 || !quizRes.data.hasQuiz) {
      throw new Error(`Quiz fetch failed: status ${quizRes.status}, data: ${JSON.stringify(quizRes.data)}`);
    }

    const { quiz, questions } = quizRes.data;
    console.log(`Quiz Title: "${quiz.title}"`);
    console.log(`Total Questions Returned: ${questions.length}`);
    if (questions.length !== 5) {
      throw new Error(`Expected exactly 5 questions, received ${questions.length}`);
    }

    // Security check: Verify no answers or explanations are leaked
    for (const q of questions) {
      if (q.correct_option_index !== undefined) {
        throw new Error(`SECURITY BREACH: correct_option_index leaked in question ID ${q.id}!`);
      }
      if (q.explanation !== undefined) {
        throw new Error(`SECURITY BREACH: explanation leaked in question ID ${q.id}!`);
      }
    }
    console.log("🔒 Security verification PASSED: No answers or explanations leaked.");

    // 4. Test Lock Enforcement: Attempting to mark as completed BEFORE passing quiz
    console.log(`\n--- 4. Testing POST /api/user/topics/${cnTopic.id}/toggle (Without Passing Quiz) ---`);
    const toggleFailRes = await request(
      `/api/user/topics/${cnTopic.id}/toggle`,
      { method: "POST", headers: authHeaders },
      { status: "completed" }
    );

    console.log("Toggle Status Code:", toggleFailRes.status);
    console.log("Toggle Response:", toggleFailRes.data);

    if (toggleFailRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden, but received HTTP ${toggleFailRes.status}`);
    }
    if (!toggleFailRes.data?.error?.includes("Assessment Required")) {
      throw new Error(`Expected error message to contain 'Assessment Required', got: ${toggleFailRes.data?.error}`);
    }
    console.log("🛡️ Gateway verification PASSED: Unpassed quiz topic cannot be marked completed (403 Forbidden).");

    // 5. Submit Quiz Answers (Passing Score >= 70%)
    console.log(`\n--- 5. Submitting Assessment with Passing Score ---`);
    // Each question's correct index is 1 according to seed_cn_quiz.js
    const answersPayload = {};
    questions.forEach((q) => {
      answersPayload[q.id] = 1;
    });

    const submitRes = await request(
      `/api/topics/${cnTopic.id}/quiz/submit`,
      { method: "POST", headers: authHeaders },
      { answers: answersPayload }
    );

    console.log("Submit Status Code:", submitRes.status);
    console.log("Submit Score:", `${submitRes.data?.score}/${submitRes.data?.total_questions} (${submitRes.data?.percentage}%)`);
    console.log("Submit Passed:", submitRes.data?.passed);

    if (submitRes.status !== 200 || !submitRes.data?.passed) {
      throw new Error("Quiz submission failed to pass: " + JSON.stringify(submitRes.data));
    }
    console.log("🏆 Assessment PASSED: Score 100%.");

    // 6. Verify User Progress is now completed in the database
    const progressCheck = await pool.query(
      "SELECT status, completed_at FROM user_progress WHERE user_id = $1 AND topic_id = $2",
      [createdUserId, cnTopic.id]
    );

    if (progressCheck.rows.length === 0 || progressCheck.rows[0].status !== "completed") {
      throw new Error("User progress was not automatically set to 'completed' after passing assessment!");
    }
    console.log("✅ 6. Auto-completion verified: Topic progress status is 'completed'.");

    // 7. Test unmarking and re-marking (Now that user has a passing attempt)
    console.log("\n--- 7. Testing toggle back to not_started and then re-marking completed ---");
    const unmarkRes = await request(
      `/api/user/topics/${cnTopic.id}/toggle`,
      { method: "POST", headers: authHeaders },
      { status: "not_started" }
    );
    if (unmarkRes.status !== 200 || unmarkRes.data.progress.status !== "not_started") {
      throw new Error("Unmarking topic failed: " + JSON.stringify(unmarkRes.data));
    }
    console.log("✅ Successfully unmarked topic to not_started.");

    const remarkRes = await request(
      `/api/user/topics/${cnTopic.id}/toggle`,
      { method: "POST", headers: authHeaders },
      { status: "completed" }
    );
    if (remarkRes.status !== 200 || remarkRes.data.progress.status !== "completed") {
      throw new Error("Re-marking topic completed with passing record failed: " + JSON.stringify(remarkRes.data));
    }
    console.log("✅ Successfully re-marked topic completed (allowed because passing attempt exists).");

    console.log("\n🎉 ALL BACKEND ASSESSMENT & GATEWAY CHECKS PASSED PERFECTLY!");
  } catch (err) {
    console.error("\n❌ VERIFICATION TEST FAILED:", err);
    process.exitCode = 1;
  } finally {
    if (createdUserId) {
      try {
        await pool.query("DELETE FROM users WHERE id = $1", [createdUserId]);
        console.log(`🧹 Cleaned up test user (ID ${createdUserId}).`);
      } catch (cleanErr) {
        console.warn("Cleanup warning:", cleanErr.message);
      }
    }
    await pool.end();
  }
})();
