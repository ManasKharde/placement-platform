// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || "Internal Server Error",
  };

  // Include error details in development mode
  if (process.env.NODE_ENV === "development" && err.details) {
    response.details = err.details;
  }

  return res.status(statusCode).json(response);
};

// Wrapper utility for async route handlers to catch uncaught exceptions automatically
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
};