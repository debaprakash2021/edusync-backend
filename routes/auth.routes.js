import express from "express";
import {
  initiateSignup,
  verifySignupOtp,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authLimiter, otpLimiter, passwordResetLimiter } from "../middlewares/ratelimiter.middleware.js";
import { validate, signupInitiateValidation, signupVerifyValidation, loginValidation } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/signup/initiate", otpLimiter, validate(signupInitiateValidation), initiateSignup);
router.post("/signup/verify", authLimiter, validate(signupVerifyValidation), verifySignupOtp);
router.post("/login", authLimiter, validate(loginValidation), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.patch("/profile", authMiddleware, updateProfile);

export default router;