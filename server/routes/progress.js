// routes/progress.js
const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { toggleTopicProgress, getUserProgress } = require("../controllers/progressController");

// Atomic topic progress toggle routes
router.post("/progress/toggle", authenticateToken, toggleTopicProgress);

/**
 * @openapi
 * /user/topics/{topicId}/toggle:
 *   post:
 *     summary: Toggle topic completion status for active user (enforces 70% assessment gating)
 *     tags:
 *       - Topic Progress
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the topic to toggle
 *         example: 22264
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed]
 *                 description: Explicit target status (if omitted, toggles between completed and not_started)
 *                 example: completed
 *     responses:
 *       200:
 *         description: Topic status updated successfully with recalculated path completion velocity
 *       400:
 *         description: Valid numeric topicId required or invalid status value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - A minimum score of 70% on the assessment is required to complete this topic
 *       404:
 *         description: Topic not found
 */
router.post("/user/topics/:topicId/toggle", authenticateToken, toggleTopicProgress);

/**
 * @openapi
 * /topics/{topicId}/toggle:
 *   post:
 *     summary: Toggle topic completion status (enforces 70% assessment gating)
 *     tags:
 *       - Topic Progress
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the topic
 *         example: 22264
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Topic status updated successfully
 *       400:
 *         description: Valid numeric topicId required or invalid status value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - A minimum score of 70% on the assessment is required to complete this topic
 *       404:
 *         description: Topic not found
 */
router.post("/topics/:topicId/toggle", authenticateToken, toggleTopicProgress);

// User progress status query routes
router.get("/progress", authenticateToken, getUserProgress);

/**
 * @openapi
 * /user/progress:
 *   get:
 *     summary: Fetch authenticated user's topic progress metrics and completion percentages
 *     tags:
 *       - Topic Progress
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Completed topic counts, total path topic counts, and percentage progress
 *       401:
 *         description: Unauthorized
 */
router.get("/user/progress", authenticateToken, getUserProgress);

module.exports = router;