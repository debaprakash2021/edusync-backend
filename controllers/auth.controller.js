import {
  initiateSignupService,
  verifySignupOtpService,
  loginService
} from "../services/auth.service.js";


// POST /auth/signup/initiate
// Controller to initiate signup by generating OTP
export const initiateSignup = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const result = await initiateSignupService(email);

    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// POST /auth/signup/verify
// Controller to verify OTP and complete user registration
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp, name, password,role } = req.body;

    if (!email || !otp || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await verifySignupOtpService({
      email,
      otp,
      name,
      password,
      role
    });

    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      user:user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// Login controller with cookie-based authentication
// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,                           // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

