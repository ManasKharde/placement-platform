const rateLimit = require("express-rate-limit");

// General API Rate Limiter — 300 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes." },
});

// Auth Rate Limiter — protects login/signup endpoints, skips session check /me
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 30 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    req.path === "/me" ||
    req.path === "/health" ||
    req.path === "/refresh" ||
    req.path === "/refresh-token",
  message: { error: "Too many authentication attempts, please try again later." },
});

module.exports = {
  apiLimiter,
  authLimiter,
};