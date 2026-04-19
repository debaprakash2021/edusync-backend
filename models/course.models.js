import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "mathematics",
        "science",
        "physics",
        "chemistry",
        "biology",
        "computer-science",
        "english",
        "history",
        "geography",
        "economics",
        "other",
      ],
    },
    subject: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    language: {
      type: String,
      default: "english",
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text", tags: "text" });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ instructor: 1 });

export default mongoose.model("Course", courseSchema);