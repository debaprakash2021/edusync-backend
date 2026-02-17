import { asyncHandler } from "../middlewares/errorHandler.middleware.js";
import { ApiResponse } from "../utils/response.js";
import {
  initiateSignupService,
  verifySignupOtpService,
  loginService
} from "../services/auth.service.js";

// ✅ AFTER: No manual validation (handled by middleware)
export const initiateSignup = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // ✅ Email is already validated by middleware!

  const result = await initiateSignupService(email);
  return ApiResponse.success(res, result, "OTP generated successfully");
});

// ✅ AFTER: Clean controller
export const verifySignupOtp = asyncHandler(async (req, res) => {
  const { email, otp, name, password, role } = req.body;
  // ✅ All fields already validated by middleware!

  const user = await verifySignupOtpService({
    email,
    otp,
    name,
    password,
    role
  });

  return ApiResponse.created(res, { user }, "User signed up successfully");
});

// ✅ AFTER: Clean controller
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // ✅ Already validated by middleware!

  const result = await loginService(email, password);

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000
  });

  return ApiResponse.success(res, { user: result.user }, "Login successful");
});