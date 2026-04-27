import mongoose from "mongoose";

const earningSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    saleAmount: {
      type: Number,
      required: true,
    },
    platformFeePercent: {
      type: Number,
      required: true,
      default: 30,
    },
    instructorEarning: {
      type: Number,
      required: true,
    },
    platformEarning: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

earningSchema.index({ instructor: 1, status: 1 });
earningSchema.index({ course: 1 });
earningSchema.index({ order: 1 });

export default mongoose.model("Earning", earningSchema);