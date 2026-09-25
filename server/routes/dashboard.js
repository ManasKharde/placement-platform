// routes/dashboard.js
const router = require("express").Router();
const {authenticateToken} = require("../middleware/auth");
const { getStudentDashboard } = require("../controllers/dashboardController");

/**
 * @openapi
 * /user/dashboard:
 *   get:
 *     summary: Aggregated student dashboard metrics
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Student profile, active path, and track-by-track percentage progress
 */
router.get("/user/dashboard", authenticateToken, getStudentDashboard);

module.exports = router;