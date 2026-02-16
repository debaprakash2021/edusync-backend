import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// ✅ FIXED: Added next() call and error handling
otpSchema.pre("save", async function (next) {
  // Prevent re-hashing for security 
  if (!this.isModified("otp")) return next();

  try {
    const saltRounds = 10;
    this.otp = await bcrypt.hash(this.otp, saltRounds);
    next(); // ✅ ADDED: Tell Mongoose we're done
  } catch (error) {
    next(error); // ✅ ADDED: Pass error to Mongoose error handler
  }
});

export default mongoose.model("OTP", otpSchema);