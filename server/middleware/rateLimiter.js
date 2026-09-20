const rateLimit = require("express-rate-limit");

// General API Rate Limiter — 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes." },
});

// Auth Rate Limiter — 10 requests per 15 minutes (protects OAuth/Login endpoints)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later." },
});

module.exports = {
  apiLimiter,
  authLimiter,
};