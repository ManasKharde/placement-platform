// routes/studyTime.js
const router = require("express").Router();
const {authenticateToken} = require("../middleware/auth");
const { setStudyTime, getPathPacing } = require("../controllers/studyTimeController");

router.put("/user/study-time", authenticateToken, setStudyTime);
router.get("/user/pacing", authenticateToken, getPathPacing);

module.exports = router;