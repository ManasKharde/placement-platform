// routes/studyTime.js
const router = require("express").Router();
const {authenticateToken} = require("../middleware/auth");
const { setStudyTime, getPathPacing } = require("../controllers/studyTimeController");

router.put("/user/study-time", authenticateToken, setStudyTime);

/**
 * @openapi
 * /user/pacing:
 *   get:
 *     summary: Fetch path velocity and completion timeline pacing
 *     tags:
 *       - Pacing & Study Time
 *     responses:
 *       200:
 *         description: Remaining topics, resource minutes, and projected completion days
 */
router.get("/user/pacing", authenticateToken, getPathPacing);

module.exports = router;