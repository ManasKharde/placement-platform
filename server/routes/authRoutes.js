const express = require("express");
const router = express.Router();
const passport = require("passport");
const { signup, login, refresh, logout, googleCallback, getCurrentUser} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"], session: false}));
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login", session: false}), googleCallback);
router.get("/me", authenticateToken, getCurrentUser);
module.exports = router;