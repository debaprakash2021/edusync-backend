// ==========================================
// middlewares/validation.middleware.js
// Comprehensive Input Validation using express-validator
// ==========================================

import { body, param, query, validationResult } from "express-validator";

// ==========================================
// VALIDATION MIDDLEWARE FACTORY
// Runs all validations and returns errors if any
// ==========================================
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }
    next();
  };
};

// ==========================================
// AUTH VALIDATIONS
// ==========================================

/**
 * Validation for POST /auth/signup/initiate
 * Requires: email
 */
export const signupInitiateValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail() // Sanitize: lowercase, remove dots from gmail
    .trim()
];

/**
 * Validation for POST /auth/signup/verify
 * Requires: email, otp, name, password, role (optional)
 */
export const signupVerifyValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail()
    .trim(),
  
  body("otp")
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits")
    .isNumeric().withMessage("OTP must contain only numbers")
    .trim(),
  
  body("name")
    .notEmpty().withMessage("Name is required")
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/).withMessage("Name can only contain letters and spaces"),
  
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage("Password must contain at least one letter and one number")
    .matches(/^(?=.*[!@#$%^&*])/).withMessage("Password must contain at least one special character (!@#$%^&*)"),
  
  body("role")
    .optional()
    .isIn(["ADMIN", "EDITOR", "VIEWER"]).withMessage("Invalid role. Must be ADMIN, EDITOR, or VIEWER")
];

/**
 * Validation for POST /auth/login
 * Requires: email, password
 */
export const loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail()
    .trim(),
  
  body("password")
    .notEmpty().withMessage("Password is required")
];

// ==========================================
// ARTIFACT VALIDATIONS
// ==========================================

/**
 * Validation for POST /artifacts
 * Requires: title, content
 * Optional: status
 */
export const createArtifactValidation = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),
  
  body("content")
    .notEmpty().withMessage("Content is required")
    .trim()
    .isLength({ min: 10 }).withMessage("Content must be at least 10 characters long"),
  
  body("status")
    .optional()
    .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"]).withMessage("Invalid status. Must be DRAFT, PUBLISHED, or ARCHIVED")
];

/**
 * Validation for PATCH /artifacts/:id
 * All fields optional but at least one required
 */
export const updateArtifactValidation = [
  param("id")
    .isMongoId().withMessage("Invalid artifact ID format"),
  
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),
  
  body("content")
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage("Content must be at least 10 characters long"),
  
  body("status")
    .optional()
    .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"]).withMessage("Invalid status")
];

/**
 * Validation for GET /artifacts
 * Query params: page, limit, status
 */
export const getArtifactsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer")
    .toInt(),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
    .toInt(),
  
  query("status")
    .optional()
    .isIn(["DRAFT", "PUBLISHED", "ARCHIVED"]).withMessage("Invalid status filter")
];

/**
 * Validation for GET /artifacts/:id
 */
export const getArtifactByIdValidation = [
  param("id")
    .isMongoId().withMessage("Invalid artifact ID format")
];

// ==========================================
// COMMENT VALIDATIONS
// ==========================================

/**
 * Validation for POST /artifacts/:id/comments
 * Requires: text
 */
export const addCommentValidation = [
  param("id")
    .isMongoId().withMessage("Invalid artifact ID format"),
  
  body("text")
    .notEmpty().withMessage("Comment text is required")
    .trim()
    .isLength({ min: 1, max: 1000 }).withMessage("Comment must be between 1 and 1000 characters")
];

/**
 * Validation for GET /artifacts/:id/comments
 */
export const getCommentsValidation = [
  param("id")
    .isMongoId().withMessage("Invalid artifact ID format")
];

/**
 * Validation for DELETE /comments/:id
 */
export const deleteCommentValidation = [
  param("id")
    .isMongoId().withMessage("Invalid comment ID format")
];

// ==========================================
// LIKE VALIDATIONS
// ==========================================

/**
 * Validation for POST /artifacts/:id/like
 */
export const toggleLikeValidation = [
  param("id")
    .isMongoId().withMessage("Invalid artifact ID format")
];

/**
 * Validation for GET /artifacts/:id/likes
 */
export const getLikeCountValidation = [
  param("id")
    .isMongoId().withMessage("Invalid artifact ID format")
];

// ==========================================
// CHAT VALIDATIONS
// ==========================================

/**
 * Validation for POST /chat
 * Requires: receiverId, message
 */
export const sendChatValidation = [
  body("receiverId")
    .notEmpty().withMessage("Receiver ID is required")
    .isMongoId().withMessage("Invalid receiver ID format"),
  
  body("message")
    .notEmpty().withMessage("Message is required")
    .trim()
    .isLength({ min: 1, max: 2000 }).withMessage("Message must be between 1 and 2000 characters")
];

/**
 * Validation for GET /chat/:threadId
 */
export const getChatsByThreadValidation = [
  param("threadId")
    .isMongoId().withMessage("Invalid thread ID format")
];

// ==========================================
// USER VALIDATIONS
// ==========================================

/**
 * Validation for PATCH /users/:id
 */
export const updateUserValidation = [
  param("id")
    .isMongoId().withMessage("Invalid user ID format"),
  
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/).withMessage("Name can only contain letters and spaces"),
  
  body("email")
    .optional()
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  
  body("role")
    .optional()
    .isIn(["ADMIN", "EDITOR", "VIEWER"]).withMessage("Invalid role")
];

/**
 * Validation for DELETE /users/:id
 */
export const deleteUserValidation = [
  param("id")
    .isMongoId().withMessage("Invalid user ID format")
];

// ==========================================
// PAGINATION VALIDATIONS
// ==========================================

/**
 * Reusable pagination validation
 */
export const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer")
    .toInt(),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
    .toInt()
];

// ==========================================
// SEARCH VALIDATIONS
// ==========================================

/**
 * Validation for search endpoints
 */
export const searchValidation = [
  query("q")
    .notEmpty().withMessage("Search query is required")
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Search query must be between 2 and 100 characters"),
  
  ...paginationValidation
];

// ==========================================
// MONGODB ID VALIDATION (Reusable)
// ==========================================

/**
 * Helper to validate MongoDB ObjectId in params
 * @param {string} paramName - Name of the param (e.g., 'id', 'userId')
 */
export const mongoIdValidation = (paramName = "id") => [
  param(paramName)
    .isMongoId().withMessage(`Invalid ${paramName} format`)
];