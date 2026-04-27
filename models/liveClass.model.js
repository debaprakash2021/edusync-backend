import mongoose from "mongoose";

const liveClassSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 60,
    },
    agoraChannel: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },
    recordingUrl: {
      type: String,
      default: null,
    },
    attendeeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

liveClassSchema.index({ course: 1, scheduledAt: 1 });
liveClassSchema.index({ instructor: 1 });
liveClassSchema.index({ status: 1 });

export default mongoose.model("LiveClass", liveClassSchema);