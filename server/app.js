const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
require("dotenv").config();

// Configuration & Middlewares
const pool = require("./config/db");
const { createOtpTable } = require("./config/migrate_otps");
const { seedPathsData } = require("./config/seed_paths");
const { seedTopicContent } = require("./scripts/seed_topic_content");
const { seedCompletePillars } = require("./scripts/seed_complete_pillars");
const { migrateQuizzes } = require("./scripts/migrate_quizzes");
const { seedQuizzes } = require("./scripts/seed_quizzes");
const { seedCnQuiz } = require("./scripts/seed_cn_quiz");
const { seedModularTracks } = require("./scripts/seed_modular_tracks");
const seedDsaBatch1 = require("./scripts/seed_dsa_batch_1");
const seedDsaBatch2 = require("./scripts/seed_dsa_batch_2");
const seedDsaBatch3 = require("./scripts/seed_dsa_batch_3");
const seedDsaBatch4 = require("./scripts/seed_dsa_batch_4");
const seedDsaBatch5 = require("./scripts/seed_dsa_batch_5");
const seedDsaBatch6 = require("./scripts/seed_dsa_batch_6");
const seedDsaBatch7 = require("./scripts/seed_dsa_batch_7");
const seedDsaBatch8 = require("./scripts/seed_dsa_batch_8");
const seedDsaBatch9 = require("./scripts/seed_dsa_batch_9");
const seedDsaBatch10 = require("./scripts/seed_dsa_batch_10");
const seedDsaBatch11 = require("./scripts/seed_dsa_batch_11");
const seedDsaBatch12 = require("./scripts/seed_dsa_batch_12");
const seedDsaBatch13 = require("./scripts/seed_dsa_batch_13");
const seedDsaBatch14 = require("./scripts/seed_dsa_batch_14");
const seedDsaBatch15 = require("./scripts/seed_dsa_batch_15");
const seedDsaBatch16 = require("./scripts/seed_dsa_batch_16");
const seedDsaBatch17 = require("./scripts/seed_dsa_batch_17");
const seedDsaBatch18 = require("./scripts/seed_dsa_batch_18");
const seedDsaBatch19 = require("./scripts/seed_dsa_batch_19");
const seedDsaBatch20 = require("./scripts/seed_dsa_batch_20");
const seedDsaBatch21 = require("./scripts/seed_dsa_batch_21");
const seedDsaBatch22 = require("./scripts/seed_dsa_batch_22");
const seedDsaBatch23 = require("./scripts/seed_dsa_batch_23");
const seedDsaBatch24 = require("./scripts/seed_dsa_batch_24");
const seedDsaBatch25 = require("./scripts/seed_dsa_batch_25");
const seedDsaBatch26 = require("./scripts/seed_dsa_batch_26");
const seedDsaBatch27 = require("./scripts/seed_dsa_batch_27");
const seedDsaBatch28 = require("./scripts/seed_dsa_batch_28");
const seedDsaBatch29 = require("./scripts/seed_dsa_batch_29");
const seedDsaBatch30 = require("./scripts/seed_dsa_batch_30");
const seedDsaBatch31 = require("./scripts/seed_dsa_batch_31");
createOtpTable().catch((err) => console.error("OTP table migration failed:", err.message));
seedPathsData().catch((err) => console.error("Paths seeding failed:", err.message));
seedTopicContent().catch((err) => console.error("Topic content migration failed:", err.message));
seedCompletePillars()
    .then(() => seedModularTracks())
    .then(() => seedDsaBatch1())
    .then(() => seedDsaBatch2())
    .then(() => seedDsaBatch3())
    .then(() => seedDsaBatch4())
    .then(() => seedDsaBatch5())
    .then(() => seedDsaBatch6())
    .then(() => seedDsaBatch7())
    .then(() => seedDsaBatch8())
    .then(() => seedDsaBatch9())
    .then(() => seedDsaBatch10())
    .then(() => seedDsaBatch11())
    .then(() => seedDsaBatch12())
    .then(() => seedDsaBatch13())
    .then(() => seedDsaBatch14())
    .then(() => seedDsaBatch15())
    .then(() => seedDsaBatch16())
    .then(() => seedDsaBatch17())
    .then(() => seedDsaBatch18())
    .then(() => seedDsaBatch19())
    .then(() => seedDsaBatch20())
    .then(() => seedDsaBatch21())
    .then(() => seedDsaBatch22())
    .then(() => seedDsaBatch23())
    .then(() => seedDsaBatch24())
    .then(() => seedDsaBatch25())
    .then(() => seedDsaBatch26())
    .then(() => seedDsaBatch27())
    .then(() => seedDsaBatch28())
    .then(() => seedDsaBatch29())
    .then(() => seedDsaBatch30())
    .then(() => seedDsaBatch31())
    .catch((err) => console.error("Complete pillars / modular tracks / DSA Batches migration failed:", err.message));
migrateQuizzes()
    .then(() => seedQuizzes())
    .then(() => seedCnQuiz())
    .catch((err) => console.error("Quiz migration/seeding failed:", err.message));
require("./config/passport");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");


// Route Imports
const authRoutes = require("./routes/authRoutes");
const preparationRoutes = require("./routes/preparationRoutes");
const progressRoutes = require("./routes/progress");
const resourceRoutes = require("./routes/resources");
const dashboardRoutes = require("./routes/dashboard");
const missionRoutes = require("./routes/missions");
const studyTimeRoutes = require("./routes/studyTime");
const quizRoutes = require("./routes/quiz");

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

app.set('trust proxy', 1);

// 2. CORS Setup
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// 3. Body Parser & Cookie Parser
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// 4. Authentication Initialization
app.use(passport.initialize());

// 5. Mount Interactive Swagger Documentation Route
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            withCredentials: true,
            requestInterceptor: (req) => {
                req.credentials = "include";
                return req;
            },
        },
    })
);
// 6. Rate Limiting Middlewares
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// 7. System Health Check Endpoint
app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        return res.status(200).json({
            status: "UP",
            timestamp: result.rows[0].now,
            database: "connected",
        });
    } catch (error) {
        console.error("Health check database failure:", error);
        return res.status(500).json({
            status: "DOWN",
            database: "disconnected",
            error: error.message,
        });
    }
});

// Root Ping Route
app.get("/", (req, res) => {
    res.json({ message: "Placement Platform API is active. Documentation at /api-docs" });
});

// 8. API Routes
app.use("/api/auth", authRoutes);
app.use("/api", preparationRoutes);
app.use("/api", progressRoutes);
app.use("/api", resourceRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", missionRoutes);
app.use("/api", studyTimeRoutes);
app.use("/api", quizRoutes);

// 9. 404 Handler for Unmatched Endpoints
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

// 10. Centralized Error Handler (Must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Interactive API Docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;