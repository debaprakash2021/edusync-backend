import mongoose from "mongoose";

const studentNoteSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    timestampSeconds: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

studentNoteSchema.index({ student: 1, lecture: 1 });
studentNoteSchema.index({ student: 1, course: 1 });

export default mongoose.model("StudentNote", studentNoteSchema);