const router = require("express").Router();
const { getAllPaths, getPathById, getTrackTopics, selectUserPath, getUserPath, getUserRoadmap } = require("../controllers/preparationController");
const { authenticateToken } = require("../middleware/auth");

router.get("/preparation-paths", authenticateToken, getAllPaths);
router.get("/preparation-paths/:id", authenticateToken, getPathById);
router.get("/tracks/:id/topics", authenticateToken, getTrackTopics);

router.post("/user/preparation-path", authenticateToken, selectUserPath);
router.get("/user/preparation-path", authenticateToken, getUserPath);
router.get("/user/roadmap", authenticateToken, getUserRoadmap);

module.exports = router;