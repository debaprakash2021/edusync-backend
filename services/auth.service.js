import bcrypt from "bcrypt";
import User from "../models/users.models.js";
import OTP from "../models/otp.models.js";
import { generateOTP } from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";

export const initiateSignupService = async (email) => {
  // 1. Check if user already exists

  console.log("Initiating signup for email:", email);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. Destroy any existing OTPs for this email
  await OTP.deleteMany({ email });
 
  // 3. Generate new OTP (6-digit numeric)

  const otp = generateOTP();
  console.log("Generated OTP:", otp);

  // 4. Hash OTP before saving
  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  return {
    otp,
    expiresIn: "5 minutes"
  };
};


export const verifySignupOtpService = async ({
  email,
  otp,
  name,
  password,
  role,
}) => {
  // 1. Find OTP record for the email
  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) {
    throw new Error("OTP expired or not found");
  }

  // 2. Check if OTP is expired
  if (otpRecord.expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    throw new Error("OTP expired");
  }

  // 3. Verify OTP
  const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValidOtp) {
    throw new Error("Invalid OTP");
  }

  // 4. Create user (password hashed via pre-save middleware)
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // 5. Destroy OTP (one-time use)
  await OTP.deleteOne({ email });

  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
};


// Login service
export const loginService = async (email, password) => {
  const user = await User
    .findOne({ email })
    .select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};