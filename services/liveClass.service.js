import { RtcTokenBuilder, RtcRole } from "agora-token";
import { agoraConfig } from "../config/agora.js";
import LiveClass from "../models/liveClass.model.js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import crypto from "crypto";

const generateChannelName = () => {
  return "class_" + crypto.randomBytes(8).toString("hex");
};

const generateAgoraToken = (channelName, uid, role) => {
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  return RtcTokenBuilder.buildTokenWithUid(
    agoraConfig.appId,
    agoraConfig.appCertificate,
    channelName,
    uid,
    role,
    expirationTimeInSeconds,
    privilegeExpiredTs
  );
};

export const scheduleLiveClassService = async (instructorId, courseId, data) => {
  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) throw new Error("Course not found or unauthorized");

  const agoraChannel = generateChannelName();

  const liveClass = await LiveClass.create({
    course: courseId,
    instructor: instructorId,
    title: data.title,
    description: data.description,
    scheduledAt: new Date(data.scheduledAt),
    durationMinutes: data.durationMinutes || 60,
    agoraChannel,
  });

  return liveClass;
};

export const getUpcomingClassesService = async (courseId, studentId) => {
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });
  if (!enrollment) throw new Error("Not enrolled in this course");

  const classes = await LiveClass.find({
    course: courseId,
    status: { $in: ["SCHEDULED", "LIVE"] },
    scheduledAt: { $gte: new Date() },
  })
    .populate("instructor", "name avatar")
    .sort({ scheduledAt: 1 });

  return classes;
};

export const getInstructorClassesService = async (instructorId) => {
  const classes = await LiveClass.find({ instructor: instructorId })
    .populate("course", "title thumbnail")
    .sort({ scheduledAt: -1 });

  return classes;
};

export const joinLiveClassService = async (liveClassId, userId, isInstructor) => {
  const liveClass = await LiveClass.findById(liveClassId).populate("course");
  if (!liveClass) throw new Error("Live class not found");

  if (liveClass.status === "CANCELLED") throw new Error("This class has been cancelled");
  if (liveClass.status === "COMPLETED") throw new Error("This class has already ended");

  if (!isInstructor) {
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: liveClass.course._id,
    });
    if (!enrollment) throw new Error("Not enrolled in this course");
  }

  const now = new Date();
  const classTime = new Date(liveClass.scheduledAt);
  const minutesUntilClass = (classTime - now) / 1000 / 60;

  if (minutesUntilClass > 15 && !isInstructor) {
    throw new Error(
      `Class starts in ${Math.ceil(minutesUntilClass)} minutes. You can join 15 minutes before.`
    );
  }

  if (isInstructor && liveClass.status === "SCHEDULED") {
    liveClass.status = "LIVE";
    await liveClass.save();
  }

  const role = isInstructor ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const uid = Math.floor(Math.random() * 100000);
  const token = generateAgoraToken(liveClass.agoraChannel, uid, role);

  if (!isInstructor) {
    await LiveClass.findByIdAndUpdate(liveClassId, {
      $inc: { attendeeCount: 1 },
    });
  }

  return {
    token,
    uid,
    channelName: liveClass.agoraChannel,
    appId: agoraConfig.appId,
    liveClass: {
      id: liveClass._id,
      title: liveClass.title,
      durationMinutes: liveClass.durationMinutes,
      status: liveClass.status,
    },
  };
};

export const endLiveClassService = async (liveClassId, instructorId) => {
  const liveClass = await LiveClass.findOne({
    _id: liveClassId,
    instructor: instructorId,
  });
  if (!liveClass) throw new Error("Live class not found or unauthorized");

  liveClass.status = "COMPLETED";
  await liveClass.save();

  return { message: "Live class ended", liveClassId };
};

export const cancelLiveClassService = async (liveClassId, instructorId) => {
  const liveClass = await LiveClass.findOne({
    _id: liveClassId,
    instructor: instructorId,
  });
  if (!liveClass) throw new Error("Live class not found or unauthorized");
  if (liveClass.status === "LIVE") throw new Error("Cannot cancel a class that is live");

  liveClass.status = "CANCELLED";
  await liveClass.save();

  return { message: "Live class cancelled" };
};