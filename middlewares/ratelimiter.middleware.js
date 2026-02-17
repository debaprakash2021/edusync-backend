import rateLimit from "express-rate-limit";

// ==========================================
// AUTHENTICATION RATE LIMITER
// Very strict for sensitive auth operations
// Prevents brute force attacks
// ==========================================
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful login attempts
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many authentication attempts. Please try again later.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// ==========================================
// GENERAL API RATE LIMITER
// Moderate limits for general API usage
// Allows normal browsing and interaction
// ==========================================
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute (generous for normal use)
  message: {
    success: false,
    message: "Too many requests from this IP, please slow down"
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Rate limit exceeded. Please slow down.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// ==========================================
// FILE UPLOAD RATE LIMITER
// Strict limits for resource-intensive uploads
// Prevents server overload
// ==========================================
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    success: false,
    message: "Upload limit exceeded. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true, // Don't count failed uploads
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "You've exceeded the upload limit. Please try again in an hour.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// ==========================================
// CHAT/MESSAGING RATE LIMITER
// Prevents chat spam while allowing normal conversation
// ==========================================
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 messages per minute
  message: {
    success: false,
    message: "You're sending messages too quickly"
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Slow down! You're sending messages too fast.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// ==========================================
// OTP GENERATION RATE LIMITER
// Extra strict to prevent OTP spam/abuse
// ==========================================
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 OTP requests per 15 minutes
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many OTP requests. Please wait before requesting again.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// ==========================================
// STRICT ADMIN OPERATIONS LIMITER
// For sensitive admin operations
// ==========================================
export const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 requests per 5 minutes
  message: {
    success: false,
    message: "Too many admin requests"
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.role !== 'ADMIN', // Only apply to admins
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Admin operation limit exceeded. Please wait.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// ==========================================
// COMMENT/LIKE RATE LIMITER
// Prevents spam while allowing normal interaction
// ==========================================
export const interactionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 interactions per minute
  message: {
    success: false,
    message: "Too many interactions. Please slow down."
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "You're interacting too quickly. Please slow down.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// ==========================================
// PASSWORD RESET RATE LIMITER
// Strict limits for password reset requests
// ==========================================
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour
  message: {
    success: false,
    message: "Too many password reset attempts"
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many password reset attempts. Please try again later.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Default export for backward compatibility
export default rateLimit;

// ==========================================
// USAGE SUMMARY:
// ==========================================
/*
RATE LIMITER GUIDE:

1. authLimiter (5 req / 15min)
   - Login
   - Signup verification
   - Token refresh

2. otpLimiter (3 req / 15min)
   - OTP generation
   - Email verification

3. uploadLimiter (10 req / hour)
   - File uploads
   - Image uploads

4. chatLimiter (20 req / min)
   - Send messages
   - Real-time chat

5. interactionLimiter (30 req / min)
   - Comments
   - Likes
   - Follows

6. apiLimiter (100 req / min)
   - Get artifacts
   - Get comments
   - Get users
   - General browsing

7. adminLimiter (50 req / 5min)
   - Delete users
   - Manage content
   - Admin dashboard

8. passwordResetLimiter (3 req / hour)
   - Forgot password
   - Reset password

HEADERS RETURNED:
- X-RateLimit-Limit: Maximum requests allowed
- X-RateLimit-Remaining: Requests remaining
- X-RateLimit-Reset: When the limit resets (timestamp)
- Retry-After: Seconds until retry (when blocked)

ERROR RESPONSE FORMAT:
{
  "success": false,
  "message": "Rate limit exceeded",
  "retryAfter": 900 // seconds
}
*/



// ==========================================
// RATE LIMITER MAPPING SUMMARY:
// ==========================================

/*
ENDPOINT TYPE              | LIMITER             | LIMIT
---------------------------|---------------------|-------------------------
Login                      | authLimiter         | 5 req / 15 min
Signup Verify              | authLimiter         | 5 req / 15 min
OTP Generation             | otpLimiter          | 3 req / 15 min
File Upload                | uploadLimiter       | 10 req / hour
Send Chat                  | chatLimiter         | 20 req / min
Add Comment                | interactionLimiter  | 30 req / min
Toggle Like                | interactionLimiter  | 30 req / min
Get Artifacts              | apiLimiter          | 100 req / min
Get Comments               | apiLimiter          | 100 req / min
Get Likes                  | apiLimiter          | 100 req / min
Get Chats                  | apiLimiter          | 100 req / min

WHY DIFFERENT LIMITS?

1. AUTH & OTP - Very strict (prevent brute force, spam)
2. UPLOADS - Limited (resource intensive)
3. CHAT - Moderate (prevent spam, allow conversation)
4. INTERACTIONS - Generous (allow normal use, prevent spam)
5. READ OPERATIONS - Very generous (browsing should be easy)
*/


