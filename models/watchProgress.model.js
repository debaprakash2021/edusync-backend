import mongoose from "mongoose";

const watchProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    watchedSeconds: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

watchProgressSchema.index({ student: 1, lecture: 1 }, { unique: true });
watchProgressSchema.index({ student: 1, course: 1 });

export default mongoose.model("WatchProgress", watchProgressSchema);