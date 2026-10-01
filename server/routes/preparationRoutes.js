const router = require("express").Router();
const { getAllPaths, getPathById, getTrackTopics, selectUserPath, getUserPath, getUserRoadmap, getUserReadiness } = require("../controllers/preparationController");
const { authenticateToken } = require("../middleware/auth");

/**
 * @openapi
 * /preparation-paths:
 *   get:
 *     summary: Fetch all available preparation paths
 *     tags:
 *       - Preparation Paths
 *     responses:
 *       200:
 *         description: List of active engineering preparation paths
 */
router.get("/preparation-paths", authenticateToken, getAllPaths);

/**
 * @openapi
 * /preparation-paths/{id}/roadmap:
 *   get:
 *     summary: Fetch complete ordered roadmap for a preparation path
 *     tags:
 *       - Preparation Paths
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deeply nested tracks and topics roadmap
 */
router.get("/preparation-paths/:id", authenticateToken, getPathById);
router.get("/tracks/:id/topics", authenticateToken, getTrackTopics);

router.post("/user/preparation-path", authenticateToken, selectUserPath);
router.post("/user/preparation-path/switch", authenticateToken, selectUserPath);
router.get("/user/preparation-path", authenticateToken, getUserPath);
router.get("/user/roadmap", authenticateToken, getUserRoadmap);
router.get("/user/readiness", authenticateToken, getUserReadiness);
router.get("/readiness", authenticateToken, getUserReadiness);

module.exports = router;