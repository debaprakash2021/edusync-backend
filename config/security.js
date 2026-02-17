// ==========================================
// config/security.js
// Centralized Security Configuration
// ==========================================

import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

/**
 * Helmet Configuration
 * Sets various HTTP security headers
 */
export const helmetConfig = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"], // Allow images from HTTPS and data URIs
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  
  // Prevent clickjacking
  frameguard: {
    action: "deny" // or "sameorigin"
  },
  
  // Hide X-Powered-By header
  hidePoweredBy: true,
  
  // Strict Transport Security (HTTPS only)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // Prevent MIME type sniffing
  noSniff: true,
  
  // Control DNS prefetching
  dnsPrefetchControl: {
    allow: false
  },
  
  // Referrer Policy
  referrerPolicy: {
    policy: "no-referrer"
  }
});

/**
 * MongoDB Sanitization Configuration
 * Prevents NoSQL injection attacks
 */
export const mongoSanitizeConfig = mongoSanitize({
  // Replace prohibited characters with underscore
  replaceWith: '_',
  
  // Remove keys starting with $
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ Sanitized key: ${key} in request from ${req.ip}`);
  }
});

/**
 * HPP (HTTP Parameter Pollution) Configuration
 * Prevents parameter pollution attacks
 */
export const hppConfig = hpp({
  // Whitelist parameters that can have multiple values
  whitelist: [
    'page',
    'limit',
    'sort',
    'fields',
    'status'
  ]
});

/**
 * CORS Configuration
 * Controls cross-origin resource sharing
 */
export const corsConfig = {
  // Allow specific origins
  origin: function (origin, callback) {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL] // Production: Only specific domain
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173']; // Development: Multiple origins
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  // Allow credentials (cookies, authorization headers)
  credentials: true,
  
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  
  // Exposed headers (accessible to frontend)
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  
  // Preflight cache duration (in seconds)
  maxAge: 86400 // 24 hours
};

/**
 * Apply all security middleware to Express app
 * @param {Express} app - Express application instance
 */
export const applySecurityMiddleware = (app) => {
  // 1. Helmet - Security headers
  app.use(helmetConfig);
  
  // 2. MongoDB Sanitization - NoSQL injection prevention
  app.use(mongoSanitizeConfig);
  
  // 3. HPP - HTTP Parameter Pollution prevention
  app.use(hppConfig);
  
  console.log('✅ Security middleware applied');
};

// Export individual configs for custom usage
export default {
  helmetConfig,
  mongoSanitizeConfig,
  hppConfig,
  corsConfig,
  applySecurityMiddleware
};