const router = require("express").Router();
const { getAllPaths, getPathById, getTrackTopics } = require("../controllers/preparationController");
const { authenticateToken } = require("../middleware/auth");

router.get("/preparation-paths", authenticateToken, getAllPaths);
router.get("/preparation-paths/:id", authenticateToken, getPathById);
router.get("/tracks/:id/topics", authenticateToken, getTrackTopics);

module.exports = router;