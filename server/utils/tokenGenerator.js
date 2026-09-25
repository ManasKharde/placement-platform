// utils/tokenGenerator.js
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  // Pass ONLY the user ID (and basic non-sensitive fields if required)
  return jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };