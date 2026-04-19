import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["MCQ", "TRUE_FALSE"],
    required: true,
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false },
    },
  ],
  explanation: {
    type: String,
    default: "",
  },
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      default: null,
    },
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    questions: [questionSchema],
    passingScore: {
      type: Number,
      default: 60,
      min: 0,
      max: 100,
    },
    timeLimit: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

quizSchema.index({ course: 1 });
quizSchema.index({ lecture: 1 });

export default mongoose.model("Quiz", quizSchema);