import {
  initiateSignupService,
  verifySignupOtpService,
  loginService,
  refreshTokenService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
  updateProfileService,
} from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const initiateSignup = async (req, res) => {
  try {
    const result = await initiateSignupService(req.body.email);
    sendSuccess(res, 200, result.message, result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const verifySignupOtp = async (req, res) => {
  try {
    const user = await verifySignupOtpService(req.body);
    sendSuccess(res, 201, "Account created successfully", user);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body.email, req.body.password);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendSuccess(res, 200, "Login successful", {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    sendError(res, 401, err.message);
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return sendError(res, 401, "Refresh token missing");
    const result = await refreshTokenService(token);
    sendSuccess(res, 200, "Token refreshed", result);
  } catch (err) {
    sendError(res, 401, err.message);
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) await logoutService(token);
    res.clearCookie("refreshToken");
    sendSuccess(res, 200, "Logged out successfully");
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    sendSuccess(res, 200, result.message);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await resetPasswordService(email, otp, newPassword);
    sendSuccess(res, 200, result.message);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await updateProfileService(req.user.id, req.body);
    sendSuccess(res, 200, "Profile updated", user);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};