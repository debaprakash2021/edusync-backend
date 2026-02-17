import express from "express";
import { 
  initiateSignup, 
  verifySignupOtp, 
  login 
} from "../controllers/auth.controller.js";

// ✅ UPDATED: Import specific limiters
import { authLimiter, otpLimiter } from "../middlewares/ratelimiter.middleware.js";

import { 
  validate,
  signupInitiateValidation,
  signupVerifyValidation,
  loginValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

// ✅ UPDATED: Use otpLimiter for OTP generation (very strict)
router.post(
  "/signup/initiate", 
  otpLimiter,  // ✅ Changed from rateLimiter to otpLimiter (3 req / 15min)
  validate(signupInitiateValidation),
  initiateSignup
);

// ✅ UPDATED: Use authLimiter for signup verification
router.post(
  "/signup/verify", 
  authLimiter,  // ✅ Changed to authLimiter (5 req / 15min)
  validate(signupVerifyValidation),
  verifySignupOtp
);

// ✅ UPDATED: Use authLimiter for login (prevent brute force)
router.post(
  "/login", 
  authLimiter,  // ✅ Changed to authLimiter (5 req / 15min)
  validate(loginValidation),
  login
);

export default router;