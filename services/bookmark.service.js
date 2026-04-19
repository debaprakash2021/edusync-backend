import Bookmark from "../models/bookmark.model.js";
import Enrollment from "../models/enrollment.model.js";
import Lecture from "../models/lecture.model.js";

export const toggleBookmarkService = async (studentId, lectureId) => {
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) throw new Error("Lecture not found");

  const enrollment = await Enrollment.findOne({ student: studentId, course: lecture.course });
  if (!enrollment) throw new Error("Not enrolled in this course");

  const existing = await Bookmark.findOne({ student: studentId, lecture: lectureId });

  if (existing) {
    await Bookmark.deleteOne({ _id: existing._id });
    return { bookmarked: false };
  }

  await Bookmark.create({ student: studentId, lecture: lectureId, course: lecture.course });
  return { bookmarked: true };
};

export const getMyBookmarksService = async (studentId, courseId) => {
  const query = { student: studentId };
  if (courseId) query.course = courseId;

  const bookmarks = await Bookmark.find(query)
    .populate("lecture", "title order videoUrl duration")
    .populate("course", "title thumbnail")
    .sort({ createdAt: -1 });

  return bookmarks;
};