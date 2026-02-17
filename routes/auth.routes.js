import express from "express";
import { 
  initiateSignup, 
  verifySignupOtp, 
  login 
} from "../controllers/auth.controller.js";
import { rateLimiter } from "../middlewares/ratelimiter.middleware.js";

// ✅ ADD THIS: Import validation
import { 
  validate,
  signupInitiateValidation,
  signupVerifyValidation,
  loginValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

// ✅ ADD validate() middleware to each route
router.post(
  "/signup/initiate", 
  rateLimiter, 
  validate(signupInitiateValidation),  // ✅ NEW
  initiateSignup
);

router.post(
  "/signup/verify", 
  rateLimiter, 
  validate(signupVerifyValidation),  // ✅ NEW
  verifySignupOtp
);

router.post(
  "/login", 
  rateLimiter, 
  validate(loginValidation),  // ✅ NEW
  login
);

export default router;