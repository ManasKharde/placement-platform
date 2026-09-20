const { param, body, validationResult } = require("express-validator");

// Helper to catch validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Invalid request data",
      details: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

// Common Validation Rules
const validateTopicId = [
  param("id").isInt({ min: 1 }).withMessage("Topic ID must be a positive integer"),
  validate,
];

const validateProgressToggle = [
  body("topicId").isInt({ min: 1 }).withMessage("Topic ID must be a positive integer"),
  body("status")
    .optional()
    .isIn(["not_started", "in_progress", "completed"])
    .withMessage("Status must be 'not_started', 'in_progress', or 'completed'"),
  validate,
];

const validateStudyTime = [
  body("dailyMinutes")
    .isInt({ min: 5, max: 720 })
    .withMessage("Daily study time must be between 5 and 720 minutes (12 hours)"),
  validate,
];

module.exports = {
  validateTopicId,
  validateProgressToggle,
  validateStudyTime,
};