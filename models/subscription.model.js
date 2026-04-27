import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["CREATED", "ACTIVE", "EXPIRED", "FAILED"],
      default: "CREATED",
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ student: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

export default mongoose.model("Subscription", subscriptionSchema);