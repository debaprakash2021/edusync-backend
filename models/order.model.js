import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpayPaymentId: {
    type: String,
    default: null,
    },
    originalAmount: {
    type: Number,
    default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    status: {
      type: String,
      enum: ["CREATED", "PAID", "FAILED"],
      default: "CREATED",
    },
  },
  { timestamps: true }
);

orderSchema.index({ student: 1, course: 1 });
orderSchema.index({ razorpayOrderId: 1 });

export default mongoose.model("Order", orderSchema);