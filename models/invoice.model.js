import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
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
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    pdfUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ student: 1 });
invoiceSchema.index({ order: 1 });

export default mongoose.model("Invoice", invoiceSchema);