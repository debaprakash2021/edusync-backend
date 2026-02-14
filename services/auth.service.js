import bcrypt from "bcrypt";
import User from "../models/users.models.js";
import OTP from "../models/otp.models.js";
import { generateOTP } from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";


// Signup initiation service
export const initiateSignupService = async (email) => {
  console.log("Initiating signup for email:", email);  // 1. Check if the user already exists with the same email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  await OTP.deleteMany({ email }); // 2. Destroy any existing OTPs for this email
 
  const otp = generateOTP();        // 3. Generate new OTP (6-digit numeric)
  console.log("Generated OTP:", otp);

  await OTP.create({                    // 4. Hash OTP before saving
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  return {
    otp,
    expiresIn: "5 minutes"
  };
};



// Signup verification service
export const verifySignupOtpService = async ({email,otp,name,password,role}) => {

  const otpRecord = await OTP.findOne({ email });     // 1. Find OTP record for the email
  if (!otpRecord) {
    throw new Error("OTP expired or not found");
  }

  if (otpRecord.expiresAt < Date.now()) {           // 2. Check if OTP is expired
    await OTP.deleteOne({ email }); 
    throw new Error("OTP expired");
  }


  const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);   // 3. Verify OTP
  if (!isValidOtp) {
    throw new Error("Invalid OTP");
  }

  const user = await User.create({      // 4. Create user - password hashed via pre-save middleware
    name,
    email,
    password,
    role,
  });

 
  await OTP.deleteOne({ email });    // 5. Destroy the OTP because of it's one-time use only policy

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