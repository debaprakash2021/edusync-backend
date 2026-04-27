import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "PAID"],
      default: "PENDING",
    },
    bankDetails: {
      accountHolderName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      bankName: { type: String, required: true },
    },
    adminNote: {
      type: String,
      default: "",
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

withdrawalSchema.index({ instructor: 1, status: 1 });

export default mongoose.model("Withdrawal", withdrawalSchema);