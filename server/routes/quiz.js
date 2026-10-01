// routes/quiz.js
const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { getTopicQuiz, submitTopicQuiz } = require("../controllers/quizController");

router.get("/topics/:topicId/quiz", authenticateToken, getTopicQuiz);
router.post("/topics/:topicId/quiz/submit", authenticateToken, submitTopicQuiz);

module.exports = router;
