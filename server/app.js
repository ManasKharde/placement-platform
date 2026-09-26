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

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

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