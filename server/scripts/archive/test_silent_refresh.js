const http = require("http");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

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

function parseCookies(setCookieHeaders) {
  const cookies = {};
  if (!setCookieHeaders) return cookies;
  const list = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  list.forEach((c) => {
    const parts = c.split(";")[0].split("=");
    const name = parts[0].trim();
    const value = parts.slice(1).join("=").trim();
    cookies[name] = value;
  });
  return cookies;
}

(async () => {
  let createdUserId = null;
  try {
    console.log("=== SILENT REFRESH & TOKEN LIFECYCLE TEST SUITE ===");

    // 1. Create a test user via signup
    const uniqueUser = "refresh_tester_" + Math.random().toString(36).substring(2, 7);
    console.log(`\n--- 1. Registering test user: ${uniqueUser} ---`);

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
      throw new Error("Signup failed: " + JSON.stringify(signupRes.data));
    }

    createdUserId = signupRes.data?.user?.id;
    const initialCookies = parseCookies(signupRes.headers["set-cookie"]);
    console.log(`✅ User registered (ID: ${createdUserId})`);
    console.log("Cookies received:", Object.keys(initialCookies));

    if (!initialCookies.accesstoken) {
      throw new Error("accesstoken cookie missing from signup response!");
    }
    if (!initialCookies.refreshToken) {
      throw new Error("refreshToken cookie missing from signup response!");
    }

    // 2. Test accessing protected endpoint with valid access token
    console.log("\n--- 2. Accessing /api/auth/me with valid access token ---");
    const meValidRes = await request("/api/auth/me", {
      method: "GET",
      headers: {
        Cookie: `accesstoken=${initialCookies.accesstoken}`,
      },
    });

    if (meValidRes.status !== 200 || meValidRes.data?.user?.id !== createdUserId) {
      throw new Error("Accessing /api/auth/me with valid token failed: " + JSON.stringify(meValidRes.data));
    }
    console.log("✅ Protected endpoint returned 200 OK for valid session.");

    // 3. Test accessing protected endpoint with EXPIRED access token
    console.log("\n--- 3. Simulating Expired Access Token on /api/auth/me ---");
    const expiredAccessToken = jwt.sign(
      { id: createdUserId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "-10s" } // Expired 10 seconds ago
    );

    const meExpiredRes = await request("/api/auth/me", {
      method: "GET",
      headers: {
        Cookie: `accesstoken=${expiredAccessToken}`,
      },
    });

    console.log("Expired Token HTTP Status:", meExpiredRes.status);
    console.log("Expired Token Response:", meExpiredRes.data);

    if (meExpiredRes.status !== 401) {
      throw new Error(
        `CRITICAL: Expired token returned HTTP ${meExpiredRes.status} instead of 401! Axios interceptor requires 401 to trigger silent refresh.`
      );
    }
    console.log("🛡️ Verified: Expired token returns HTTP 401 Unauthorized (enables silent refresh trigger).");

    // 4. Test calling /api/auth/refresh with the valid refreshToken
    console.log("\n--- 4. Calling POST /api/auth/refresh with valid refreshToken ---");
    const firstRefreshToken = initialCookies.refreshToken;
    const refreshRes = await request("/api/auth/refresh", {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${firstRefreshToken}`,
      },
    });

    console.log("Refresh HTTP Status:", refreshRes.status);
    console.log("Refresh Response Body:", refreshRes.data);

    if (refreshRes.status !== 200) {
      throw new Error("Token refresh failed: " + JSON.stringify(refreshRes.data));
    }

    const refreshedCookies = parseCookies(refreshRes.headers["set-cookie"]);
    console.log("Refreshed Cookies received:", Object.keys(refreshedCookies));

    if (!refreshedCookies.accesstoken) {
      throw new Error("Refreshed accesstoken missing from set-cookie header!");
    }
    if (!refreshedCookies.refreshToken) {
      throw new Error("Rotated refreshToken missing from set-cookie header!");
    }

    // Verify token rotation in DB
    const dbUser = await pool.query("SELECT refresh_token FROM users WHERE id = $1", [createdUserId]);
    if (dbUser.rows[0].refresh_token !== refreshedCookies.refreshToken) {
      throw new Error("Rotated refresh token was not persisted to the database!");
    }
    console.log("✅ Verified: Token rotation succeeded and DB updated with new refresh token.");

    // 5. Test accessing protected endpoint with NEW access token
    console.log("\n--- 5. Accessing /api/auth/me with newly issued access token ---");
    const meRefreshedRes = await request("/api/auth/me", {
      method: "GET",
      headers: {
        Cookie: `accesstoken=${refreshedCookies.accesstoken}`,
      },
    });

    if (meRefreshedRes.status !== 200 || meRefreshedRes.data?.user?.id !== createdUserId) {
      throw new Error("Replaying request with refreshed access token failed: " + JSON.stringify(meRefreshedRes.data));
    }
    console.log("✅ Replayed request succeeded with HTTP 200 OK!");

    // 6. Test Refresh Token Reuse Protection (Replaying OLD rotated refresh token)
    console.log("\n--- 6. Testing Token Reuse Protection (replaying invalidated old refresh token) ---");
    const reuseRes = await request("/api/auth/refresh", {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${firstRefreshToken}`,
      },
    });

    console.log("Reuse Attempt HTTP Status:", reuseRes.status);
    if (reuseRes.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden on old token reuse, but received ${reuseRes.status}`);
    }
    console.log("🔒 Verified: Old refresh token reuse rejected with HTTP 403 Forbidden.");

    // 7. Test Logout Flow
    console.log("\n--- 7. Testing POST /api/auth/logout ---");
    const logoutRes = await request("/api/auth/logout", {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshedCookies.refreshToken}; accesstoken=${refreshedCookies.accesstoken}`,
      },
    });

    if (logoutRes.status !== 200) {
      throw new Error("Logout failed: " + JSON.stringify(logoutRes.data));
    }

    const logoutDbCheck = await pool.query("SELECT refresh_token FROM users WHERE id = $1", [createdUserId]);
    if (logoutDbCheck.rows[0].refresh_token !== null) {
      throw new Error("Database refresh_token was not cleared to NULL on logout!");
    }
    console.log("✅ Verified: Logout successfully cleared refresh_token in database and cleared cookies.");

    console.log("\n🎉 ALL SILENT REFRESH & TOKEN LIFECYCLE TESTS PASSED PERFECTLY!");
  } catch (err) {
    console.error("\n❌ TEST SUITE FAILED:", err);
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
