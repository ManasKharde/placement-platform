// routes/progress.js
const router = require("express").Router();
const {authenticateToken} = require("../middleware/auth");
const { toggleTopicProgress, getUserProgress } = require("../controllers/progressController");


router.post("/progress/toggle", authenticateToken, toggleTopicProgress);
router.get("/progress", authenticateToken, getUserProgress);

module.exports = router;