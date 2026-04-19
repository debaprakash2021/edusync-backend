import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

bookmarkSchema.index({ student: 1, lecture: 1 }, { unique: true });
bookmarkSchema.index({ student: 1, course: 1 });

export default mongoose.model("Bookmark", bookmarkSchema);