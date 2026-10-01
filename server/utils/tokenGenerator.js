// utils/tokenGenerator.js
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  // Pass user ID
  return jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  // Include unique UUID (jti) so rotated tokens are cryptographically distinct
  return jwt.sign(
    { id: user.id, jti: crypto.randomUUID() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };