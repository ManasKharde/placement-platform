// routes/quiz.js
const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { getTopicQuiz, submitTopicQuiz } = require("../controllers/quizController");

/**
 * @openapi
 * /topics/{topicId}/quiz:
 *   get:
 *     summary: Retrieve practical assessment quiz questions for a topic (without leaking answers)
 *     tags:
 *       - Quizzes & Assessments
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
 *         description: Assessment configuration, randomized question items, and user's previous attempt history
 *       400:
 *         description: Invalid topic ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Topic or assessment not found
 */
router.get("/topics/:topicId/quiz", authenticateToken, getTopicQuiz);

/**
 * @openapi
 * /quizzes/{topicId}:
 *   get:
 *     summary: Retrieve assessment quiz details and questions by topic ID
 *     tags:
 *       - Quizzes & Assessments
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
 *         description: Assessment configuration and question items
 *       400:
 *         description: Invalid topic ID format
 *       401:
 *         description: Unauthorized
 */
router.get("/quizzes/:topicId", authenticateToken, getTopicQuiz);

/**
 * @openapi
 * /topics/{topicId}/quiz/submit:
 *   post:
 *     summary: Submit assessment answers, calculate score, and unlock topic completion gateway
 *     tags:
 *       - Quizzes & Assessments
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: object
 *                 description: Map of questionId to user selected option index (0-3 or A-D)
 *                 example:
 *                   "1": 2
 *                   "2": 0
 *                   "3": 3
 *     responses:
 *       200:
 *         description: Assessment evaluated. If score >= 70%, topic is automatically marked as completed in user progress.
 *       400:
 *         description: Invalid topic ID or invalid answers payload
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found for this topic
 */
router.post("/topics/:topicId/quiz/submit", authenticateToken, submitTopicQuiz);

/**
 * @openapi
 * /quizzes/submit:
 *   post:
 *     summary: Submit assessment score and answer payload
 *     tags:
 *       - Quizzes & Assessments
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topicId
 *               - answers
 *             properties:
 *               topicId:
 *                 type: integer
 *                 example: 22264
 *               answers:
 *                 type: object
 *                 description: Map of questionId to user selected option index
 *                 example:
 *                   "1": 2
 *                   "2": 0
 *     responses:
 *       200:
 *         description: Assessment evaluation result and pass/fail gate status
 *       400:
 *         description: Invalid topic ID or answers payload
 *       401:
 *         description: Unauthorized
 */
router.post("/quizzes/submit", authenticateToken, (req, res, next) => {
  if (!req.params.topicId && req.body.topicId) {
    req.params.topicId = req.body.topicId;
  }
  return submitTopicQuiz(req, res, next);
});

module.exports = router;

