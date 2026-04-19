import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    discountApplied: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

couponUsageSchema.index({ coupon: 1, student: 1 }, { unique: true });

export default mongoose.model("CouponUsage", couponUsageSchema);