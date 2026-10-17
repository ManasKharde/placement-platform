// routes/resources.js
const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { getTopicResources, getTopicDetail } = require("../controllers/resourceController");

/**
 * @openapi
 * /topics/{topicId}:
 *   get:
 *     summary: Fetch comprehensive topic details, curated theory, official docs, and practice items
 *     tags:
 *       - Topics & Resources
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
 *     responses:
 *       200:
 *         description: Topic details including curriculum tracks, official documentation, theory markdown, and practical evaluation items
 *       400:
 *         description: Invalid topic ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Topic not found
 */
router.get("/topics/:id", authenticateToken, getTopicDetail);

/**
 * @openapi
 * /topics/{id}/resources:
 *   get:
 *     summary: Fetch all external learning materials and estimated reading minutes for a topic
 *     tags:
 *       - Topics & Resources
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Topic ID
 *         example: 1
 *     responses:
 *       200:
 *         description: List of video lectures and documentation resources with duration estimates
 *       400:
 *         description: Invalid topic ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Topic not found
 */
router.get("/topics/:id/resources", authenticateToken, getTopicResources);

module.exports = router;