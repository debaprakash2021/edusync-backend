import Enrollment from "../models/enrollment.model.js";
import WatchProgress from "../models/watchProgress.model.js";
import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";

export const enrollService = async (studentId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");
  if (course.status !== "PUBLISHED") throw new Error("Course is not available");

  const existing = await Enrollment.findOne({ student: studentId, course: courseId });
  if (existing) throw new Error("Already enrolled in this course");

  const enrollment = await Enrollment.create({ student: studentId, course: courseId });

  await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

  return enrollment;
};

export const unenrollService = async (studentId, courseId) => {
  const enrollment = await Enrollment.findOneAndDelete({
    student: studentId,
    course: courseId,
  });
  if (!enrollment) throw new Error("Enrollment not found");

  await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: -1 } });

  return { message: "Unenrolled successfully" };
};

export const getMyCoursesService = async (studentId) => {
  const enrollments = await Enrollment.find({ student: studentId })
    .populate({
      path: "course",
      select: "title thumbnail instructor category totalDuration",
      populate: { path: "instructor", select: "name avatar" },
    })
    .sort({ lastAccessedAt: -1 });

  return enrollments;
};

export const markLectureWatchedService = async (studentId, lectureId, watchedSeconds) => {
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) throw new Error("Lecture not found");

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: lecture.course,
  });
  if (!enrollment) throw new Error("Not enrolled in this course");

  const isCompleted = lecture.duration > 0
    ? watchedSeconds / lecture.duration >= 0.9
    : true;

  await WatchProgress.findOneAndUpdate(
    { student: studentId, lecture: lectureId },
    {
      student: studentId,
      lecture: lectureId,
      course: lecture.course,
      watchedSeconds,
      isCompleted,
    },
    { upsert: true, new: true }
  );

  if (isCompleted && !enrollment.completedLectures.includes(lectureId)) {
    enrollment.completedLectures.push(lectureId);

    const totalLectures = await Lecture.countDocuments({ course: lecture.course });
    enrollment.completionPercent = totalLectures > 0
      ? Math.round((enrollment.completedLectures.length / totalLectures) * 100)
      : 0;

    if (enrollment.completionPercent === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    enrollment.lastAccessedAt = new Date();
    await enrollment.save();
  }

  return { watchedSeconds, isCompleted, completionPercent: enrollment.completionPercent };
};

export const getCourseProgressService = async (studentId, courseId) => {
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });
  if (!enrollment) throw new Error("Not enrolled in this course");

  const watchProgress = await WatchProgress.find({
    student: studentId,
    course: courseId,
  });

  return {
    completionPercent: enrollment.completionPercent,
    completedLectures: enrollment.completedLectures,
    completedAt: enrollment.completedAt,
    lectureProgress: watchProgress,
  };
};