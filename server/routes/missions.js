// routes/missions.js
const router = require("express").Router();
const {authenticateToken} = require("../middleware/auth");
const { getTodaysMissions } = require("../controllers/missionController");

router.get("/user/missions", authenticateToken, getTodaysMissions);

module.exports = router;