// routes/dashboard.js
const router = require("express").Router();
const {authenticateToken} = require("../middleware/auth");
const { getStudentDashboard } = require("../controllers/dashboardController");

router.get("/user/dashboard", authenticateToken, getStudentDashboard);

module.exports = router;