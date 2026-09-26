const { param, body, validationResult } = require("express-validator");

// Helper to catch validation errors and return standard JSON error
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErr = errors.array()[0];
    return res.status(400).json({
      error: firstErr.msg,
      message: firstErr.msg,
      details: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

const passwordStrengthValidator = (fieldName = "password") =>
  body(fieldName)
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .custom((value) => {
      if (!/[A-Z]/.test(value)) {
        throw new Error("Password must include at least 1 uppercase letter.");
      }
      if (!/[a-z]/.test(value)) {
        throw new Error("Password must include at least 1 lowercase letter.");
      }
      if (!/[0-9]/.test(value)) {
        throw new Error("Password must include at least 1 number.");
      }
      const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (!specialCharRegex.test(value)) {
        throw new Error("Password must include at least 1 special character (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?).");
      }
      return true;
    });

// Auth Validation Rules
const validateSignup = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail({ gmail_remove_dots: false }),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters.")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain alphanumeric characters, underscores, or hyphens."),
  passwordStrengthValidator("password"),
  validate,
];

const validateLogin = [
  body("password").notEmpty().withMessage("Password is required."),
  body().custom((_, { req }) => {
    const rawId = req.body.identifier || req.body.email || req.body.username;
    if (!rawId || (typeof rawId === "string" && !rawId.trim())) {
      throw new Error("Email or username is required.");
    }
    // Trim sanitized identifier back onto body
    if (typeof rawId === "string") {
      req.body.sanitizedIdentifier = rawId.trim();
    }
    return true;
  }),
  validate,
];

const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail({ gmail_remove_dots: false }),
  validate,
];

const validateVerifyOtp = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail({ gmail_remove_dots: false }),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP code is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits.")
    .isNumeric()
    .withMessage("OTP must contain numbers only."),
  validate,
];

const validateResetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail({ gmail_remove_dots: false }),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP code is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits.")
    .isNumeric()
    .withMessage("OTP must contain numbers only."),
  passwordStrengthValidator("newPassword"),
  validate,
];

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
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateVerifyOtp,
  validateResetPassword,
  validateTopicId,
  validateProgressToggle,
  validateStudyTime,
};