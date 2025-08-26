const { body, validationResult } = require("express-validator");

// Validation middleware to check for validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const userValidation = {
  signup: [
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be between 3 and 30 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores"
      ),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("first_name")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage(
        "First name is required and must be less than 50 characters"
      ),
    body("last_name")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Last name is required and must be less than 50 characters"),
    validateRequest,
  ],
  signin: [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
};

// Project validation rules
const projectValidation = {
  create: [
    body("name")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage(
        "Project name is required and must be less than 100 characters"
      ),
    body("description")
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("status")
      .optional()
      .isIn(["active", "on-hold", "completed", "archived"])
      .withMessage(
        "Status must be one of: active, on-hold, completed, archived"
      ),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Priority must be one of: low, medium, high, urgent"),
    validateRequest,
  ],
  update: [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Project name must be less than 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("status")
      .optional()
      .isIn(["active", "on-hold", "completed", "archived"])
      .withMessage(
        "Status must be one of: active, on-hold, completed, archived"
      ),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Priority must be one of: low, medium, high, urgent"),
    validateRequest,
  ],
};

// Task validation rules
const taskValidation = {
  create: [
    body("title")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage(
        "Task title is required and must be less than 200 characters"
      ),
    body("description")
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description must be less than 1000 characters"),
    body("project_id").isMongoId().withMessage("Valid project ID is required"),
    body("status")
      .optional()
      .isIn(["new", "in-progress", "completed"])
      .withMessage("Status must be one of: new, in-progress, completed"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Priority must be one of: low, medium, high, urgent"),
    validateRequest,
  ],
  update: [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Task title must be less than 200 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description must be less than 1000 characters"),
    body("status")
      .optional()
      .isIn(["new", "in-progress", "completed"])
      .withMessage("Status must be one of: new, in-progress, completed"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Priority must be one of: low, medium, high, urgent"),
    validateRequest,
  ],
  subtask: [
    body("title")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage(
        "Subtask title is required and must be less than 200 characters"
      ),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    validateRequest,
  ],
};

module.exports = {
  validateRequest,
  userValidation,
  projectValidation,
  taskValidation,
};
