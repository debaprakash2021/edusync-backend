import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    videoPublicId: {
      type: String,
    },
    duration: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        title: { type: String },
        fileUrl: { type: String },
        fileType: { type: String },
      },
    ],
  },
  { timestamps: true }
);

lectureSchema.index({ section: 1, order: 1 });
lectureSchema.index({ course: 1 });

export default mongoose.model("Lecture", lectureSchema);