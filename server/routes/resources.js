// routes/resources.js
const router = require("express").Router();
const {authenticateToken} = require("../middleware/auth");
const { getTopicResources } = require("../controllers/resourceController");

router.get("/topics/:id/resources", authenticateToken, getTopicResources);

module.exports = router;