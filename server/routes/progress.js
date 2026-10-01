// routes/progress.js
const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { toggleTopicProgress, getUserProgress } = require("../controllers/progressController");

// Atomic topic progress toggle routes
router.post("/progress/toggle", authenticateToken, toggleTopicProgress);
router.post("/user/topics/:topicId/toggle", authenticateToken, toggleTopicProgress);
router.post("/topics/:topicId/toggle", authenticateToken, toggleTopicProgress);

// User progress status query routes
router.get("/progress", authenticateToken, getUserProgress);
router.get("/user/progress", authenticateToken, getUserProgress);

module.exports = router;