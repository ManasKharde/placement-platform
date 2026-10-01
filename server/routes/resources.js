// routes/resources.js
const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { getTopicResources, getTopicDetail } = require("../controllers/resourceController");

router.get("/topics/:id", authenticateToken, getTopicDetail);
router.get("/topics/:id/resources", authenticateToken, getTopicResources);

module.exports = router;