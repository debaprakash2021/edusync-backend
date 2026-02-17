// ==========================================
// middlewares/errorHandler.middleware.js
// Global Error Handler & Async Wrapper
// ==========================================

import { AppError } from "../utils/errors.js";

/**
 * Global Error Handler Middleware
 * Catches all errors and sends consistent error responses
 * MUST be registered LAST in app.js (after all routes)
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Log error for debugging
  console.error('🔴 Error:', {
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query
    })
  });

  // MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err = new AppError(`${field} already exists`, 409);
  }

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    err = new AppError(errors.join(', '), 400);
  }

  // MongoDB CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    err = new AppError('Token expired', 401);
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      err = new AppError('File size too large (max 5MB)', 400);
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      err = new AppError('Too many files uploaded', 400);
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      err = new AppError('Unexpected file field', 400);
    } else {
      err = new AppError(err.message, 400);
    }
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

/**
 * Async Error Wrapper
 * Eliminates the need for try-catch in controllers
 * Automatically catches async errors and passes to error handler
 * 
 * Usage:
 * export const myController = asyncHandler(async (req, res) => {
 *   // No try-catch needed!
 *   const data = await someAsyncOperation();
 *   return ApiResponse.success(res, data);
 * });
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found Handler
 * Catches requests to non-existent routes
 * MUST be registered BEFORE errorHandler in app.js
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404
  );
  next(error);
};