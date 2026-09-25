// routes/missions.js
const router = require("express").Router();
const {authenticateToken} = require("../middleware/auth");
const { getTodaysMissions } = require("../controllers/missionController");

/**
 * @openapi
 * /user/missions:
 *   get:
 *     summary: Rule-based "Today's Missions" recommendations
 *     tags:
 *       - Missions
 *     responses:
 *       200:
 *         description: Top 3 recommended actionable topics for the active user
 */
router.get("/user/missions", authenticateToken, getTodaysMissions);

module.exports = router;