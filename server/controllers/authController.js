const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  findUserByUsernameOrEmail,
  findUserByEmail,
  createUser,
  updateUserPassword,
} = require("../models/userModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenGenerator");
const { sendPasswordResetOtpEmail } = require("../utils/emailService");
const pool = require("../config/db");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required.",
        message: "Username, email, and password are required.",
      });
    }

    const cleanUsername = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Check if email already exists
    const existingEmail = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [cleanEmail]
    );
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists.",
        message: "An account with this email already exists.",
      });
    }

    // 2. Check if username already exists
    const existingUsername = await pool.query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER($1)",
      [cleanUsername]
    );
    if (existingUsername.rows.length > 0) {
      return res.status(409).json({
        error: "Username is already taken.",
        message: "Username is already taken.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(cleanUsername, cleanEmail, hashedPassword, "local");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query(
      "UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [refreshToken, user.id]
    );

    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;
    const rawId = req.body.sanitizedIdentifier || identifier || email || username || "";
    const loginId = typeof rawId === "string" ? rawId.trim() : "";

    if (!loginId || !password) {
      return res.status(400).json({
        error: "Invalid email or password.",
        message: "Invalid email or password.",
      });
    }

    const user = await findUserByUsernameOrEmail(loginId);
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
        message: "Invalid email or password.",
      });
    }

    // Safeguard against logging into OAuth-only accounts with standard passwords
    if (!user.password_hash || user.auth_provider === "google") {
      return res.status(400).json({
        error: "This account was created via Google. Please log in using Google.",
        message: "This account was created via Google. Please log in using Google.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "Invalid email or password.",
        message: "Invalid email or password.",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query(
      "UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [refreshToken, user.id]
    );

    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successful",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Internal Server Error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = String(email).trim().toLowerCase();

    const user = await findUserByEmail(cleanEmail);

    // Prevent user enumeration: generic success if user doesn't exist
    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, a password reset code has been sent.",
      });
    }

    // Google OAuth safeguard
    if (!user.password_hash || user.auth_provider === "google") {
      return res.status(400).json({
        error: "This account was created via Google. Please log in using Google.",
        message: "This account was created via Google. Please log in using Google.",
      });
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate existing OTPs for this user
    await pool.query("DELETE FROM password_reset_otps WHERE user_id = $1", [user.id]);

    // Insert new OTP record
    await pool.query(
      "INSERT INTO password_reset_otps (user_id, otp_hash, expires_at) VALUES ($1, $2, $3)",
      [user.id, otpHash, expiresAt]
    );

    // Send email with OTP via real SMTP
    try {
      await sendPasswordResetOtpEmail(user.email, otp, user.username);
    } catch (emailErr) {
      // Rollback inserted OTP since email failed to deliver
      await pool.query("DELETE FROM password_reset_otps WHERE user_id = $1", [user.id]);
      return res.status(500).json({
        error: "Failed to dispatch password reset email. Please check server email configuration.",
        message: "Failed to dispatch password reset email. Please check server email configuration.",
      });
    }

    return res.status(200).json({
      message: "A 6-digit verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      error: "Unable to process password reset request. Please try again later.",
      message: "Unable to process password reset request. Please try again later.",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const user = await findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired verification code.",
        message: "Invalid or expired verification code.",
      });
    }

    const otpResult = await pool.query(
      "SELECT id, otp_hash, expires_at FROM password_reset_otps WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1",
      [user.id]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        error: "Invalid or expired verification code.",
        message: "Invalid or expired verification code.",
      });
    }

    const isMatch = await bcrypt.compare(cleanOtp, otpResult.rows[0].otp_hash);
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid or expired verification code.",
        message: "Invalid or expired verification code.",
      });
    }

    return res.status(200).json({
      message: "Verification code confirmed successfully.",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      error: "Failed to verify code. Please try again.",
      message: "Failed to verify code. Please try again.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const user = await findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired verification code.",
        message: "Invalid or expired verification code.",
      });
    }

    const otpResult = await pool.query(
      "SELECT id, otp_hash, expires_at FROM password_reset_otps WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1",
      [user.id]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        error: "Invalid or expired verification code.",
        message: "Invalid or expired verification code.",
      });
    }

    const isMatch = await bcrypt.compare(cleanOtp, otpResult.rows[0].otp_hash);
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid or expired verification code.",
        message: "Invalid or expired verification code.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and revoke existing refresh token
    await updateUserPassword(user.id, hashedPassword);

    // Remove used OTP
    await pool.query("DELETE FROM password_reset_otps WHERE user_id = $1", [user.id]);

    return res.status(200).json({
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      error: "Failed to reset password. Please try again.",
      message: "Failed to reset password. Please try again.",
    });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.cookies?.refreshtoken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh Token not found",
      });
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userResult = await pool.query(
      `SELECT id, username, email FROM users WHERE id = $1 AND refresh_token = $2`,
      [payload.id, refreshToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(403).json({
        message: "Invalid or revoked refresh token",
      });
    }

    const user = userResult.rows[0];
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Refresh Token Rotation: Update in database
    await pool.query(
      "UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [newRefreshToken, user.id]
    );

    res.cookie("accesstoken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access Token successfully refreshed",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Refresh Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.cookies?.refreshtoken;

    if (refreshToken) {
      const payload = jwt.decode(refreshToken);
      if (payload && payload.id) {
        await pool.query(
          `UPDATE users SET refresh_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [payload.id]
        );
      }
    }

    res.clearCookie("accesstoken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query(
      `UPDATE users SET refresh_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [refreshToken, user.id]
    );

    console.log(`Updated refresh token for user ID: ${user.id}`);

    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error("Google Callback Error:", error);
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.accesstoken;

    if (!token) {
      return res.status(401).json({ message: "Unauthenticated: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const userResult = await pool.query(
      `SELECT id, username, email, created_at FROM users WHERE id = $1`,
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({ user: userResult.rows[0] });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  refresh,
  logout,
  googleCallback,
  getCurrentUser,
};