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

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: alex_coder
 *               name:
 *                 type: string
 *                 example: Alex Johnson
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Pass1234!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or weak password
 *       409:
 *         description: Email or username already exists
 */
router.post("/register", validateSignup, signup);

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Register a new user account (alias for /register)
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: alex_coder
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Pass1234!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or weak password
 *       409:
 *         description: Email or username already exists
 */
router.post("/signup", validateSignup, signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate user and receive JWT tokens & session cookies
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Pass1234!
 *     responses:
 *       200:
 *         description: Login successful with access token and secure cookies
 *       400:
 *         description: Invalid input or missing credentials
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", validateLogin, login);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *     responses:
 *       200:
 *         description: Reset OTP dispatched to registered email if found
 *       400:
 *         description: Invalid email address
 */
router.post("/forgot-password", validateForgotPassword, forgotPassword);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Validate 6-digit password reset OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid, expired, or incorrect OTP
 */
router.post("/verify-otp", validateVerifyOtp, verifyOtp);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with verified OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: student@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewSecurePass123!
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid password format or expired OTP
 */
router.post("/reset-password", validateResetPassword, resetPassword);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh expired access token using refresh token cookie or payload
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: New access token issued successfully
 *       401:
 *         description: Missing, invalid, or expired refresh token
 */
router.post("/refresh", refresh);
router.post("/refresh-token", refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out user, invalidate refresh token in database, and clear cookies
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", logout);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get currently authenticated user profile
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile details
 *       401:
 *         description: Unauthorized or token missing/expired
 */
router.get("/me", authenticateToken, getCurrentUser);

module.exports = router;