const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  refresh,
  logout,
  googleCallback,
  getCurrentUser,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateVerifyOtp,
  validateResetPassword,
} = require("../middleware/validateInput");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/verify-otp", validateVerifyOtp, verifyOtp);
router.post("/reset-password", validateResetPassword, resetPassword);

router.post("/refresh", refresh);
router.post("/refresh-token", refresh);
router.post("/logout", logout);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);
router.get("/me", authenticateToken, getCurrentUser);

module.exports = router;