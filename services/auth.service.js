import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/users.models.js";
import OTP from "../models/otp.models.js";
import RefreshToken from "../models/refreshToken.model.js";
import { generateOTP } from "../utils/generateOtp.js";
import { sendOtpEmail, sendPasswordResetEmail } from "./email.service.js";

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

const generateRefreshToken = () => crypto.randomBytes(64).toString("hex");

export const initiateSignupService = async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  await OTP.deleteMany({ email });

  const otp = generateOTP();
  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendOtpEmail(email, otp);

  return { message: "OTP sent to your email", expiresIn: "5 minutes" };
};

export const verifySignupOtpService = async ({ email, otp, name, password, role }) => {
  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) throw new Error("OTP expired or not found");
  if (otpRecord.expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    throw new Error("OTP expired");
  }

  const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValidOtp) throw new Error("Invalid OTP");

  const user = await User.create({ name, email, password, role });
  await OTP.deleteOne({ email });

  return { id: user._id, name: user.name, email: user.email };
};

export const loginService = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const accessToken = generateAccessToken(user);
  const refreshTokenValue = generateRefreshToken();

  await RefreshToken.create({
    user: user._id,
    token: refreshTokenValue,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export const refreshTokenService = async (token) => {
  const record = await RefreshToken.findOne({ token }).populate("user");
  if (!record) throw new Error("Invalid refresh token");
  if (record.expiresAt < Date.now()) {
    await RefreshToken.deleteOne({ token });
    throw new Error("Refresh token expired");
  }
  const accessToken = generateAccessToken(record.user);
  return { accessToken };
};

export const logoutService = async (token) => {
  await RefreshToken.deleteOne({ token });
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No account found with this email");

  await OTP.deleteMany({ email });
  const otp = generateOTP();
  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendPasswordResetEmail(email, otp);
  return { message: "Password reset OTP sent to your email" };
};

export const resetPasswordService = async (email, otp, newPassword) => {
  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) throw new Error("OTP expired or not found");
  if (otpRecord.expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    throw new Error("OTP expired");
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValid) throw new Error("Invalid OTP");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  user.password = newPassword;
  await user.save();
  await OTP.deleteOne({ email });

  return { message: "Password reset successful" };
};

export const updateProfileService = async (userId, data) => {
  const allowed = ["name", "bio", "avatar"];
  const updates = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updates[key] = data[key];
  }

  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  if (!user) throw new Error("User not found");

  return { id: user._id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar };
};