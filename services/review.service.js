import Review from "../models/review.model.js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";

const recalculateCourseRating = async (courseId) => {
  const reviews = await Review.find({ course: courseId });
  const count = reviews.length;
  const average = count > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
    : 0;

  await Course.findByIdAndUpdate(courseId, {
    "rating.average": Math.round(average * 10) / 10,
    "rating.count": count,
  });
};

export const addReviewService = async (studentId, courseId, rating, comment) => {
  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment) throw new Error("You must be enrolled to review this course");

  const existing = await Review.findOne({ student: studentId, course: courseId });
  if (existing) throw new Error("You have already reviewed this course");

  const review = await Review.create({ student: studentId, course: courseId, rating, comment });
  await recalculateCourseRating(courseId);

  return review;
};

export const updateReviewService = async (reviewId, studentId, rating, comment) => {
  const review = await Review.findOne({ _id: reviewId, student: studentId });
  if (!review) throw new Error("Review not found or unauthorized");

  review.rating = rating ?? review.rating;
  review.comment = comment ?? review.comment;
  await review.save();
  await recalculateCourseRating(review.course);

  return review;
};

export const deleteReviewService = async (reviewId, studentId) => {
  const review = await Review.findOneAndDelete({ _id: reviewId, student: studentId });
  if (!review) throw new Error("Review not found or unauthorized");
  await recalculateCourseRating(review.course);
  return { message: "Review deleted" };
};

export const getCourseReviewsService = async (courseId) => {
  const reviews = await Review.find({ course: courseId })
    .populate("student", "name avatar")
    .sort({ createdAt: -1 });
  return reviews;
};

