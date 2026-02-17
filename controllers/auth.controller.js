import { asyncHandler } from "../middlewares/errorHandler.middleware.js";
import { ApiResponse } from "../utils/response.js";
import { ValidationError } from "../utils/errors.js";
import {
  initiateSignupService,
  verifySignupOtpService,
  loginService
} from "../services/auth.service.js";

export const initiateSignup = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError("Email is required");
  }

  const result = await initiateSignupService(email);

  return ApiResponse.success(res, result, "OTP generated successfully");
});

export const verifySignupOtp = asyncHandler(async (req, res) => {
  const { email, otp, name, password, role } = req.body;

  if (!email || !otp || !name || !password) {
    throw new ValidationError("All fields are required");
  }

  const user = await verifySignupOtpService({
    email,
    otp,
    name,
    password,
    role
  });

  return ApiResponse.created(res, { user }, "User signed up successfully");
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await loginService(email, password);

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000
  });

  return ApiResponse.success(res, { user: result.user }, "Login successful");
});