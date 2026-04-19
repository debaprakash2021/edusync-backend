import {
  enrollService,
  unenrollService,
  getMyCoursesService,
  markLectureWatchedService,
  getCourseProgressService,
} from "../services/enrollment.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const enroll = async (req, res) => {
  try {
    const enrollment = await enrollService(req.user.id, req.params.courseId);
    sendSuccess(res, 201, "Enrolled successfully", enrollment);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const unenroll = async (req, res) => {
  try {
    const result = await unenrollService(req.user.id, req.params.courseId);
    sendSuccess(res, 200, result.message);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const enrollments = await getMyCoursesService(req.user.id);
    sendSuccess(res, 200, "Enrolled courses fetched", enrollments);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const markLectureWatched = async (req, res) => {
  try {
    const { watchedSeconds } = req.body;
    const result = await markLectureWatchedService(
      req.user.id,
      req.params.lectureId,
      watchedSeconds || 0
    );
    sendSuccess(res, 200, "Progress updated", result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const result = await getCourseProgressService(req.user.id, req.params.courseId);
    sendSuccess(res, 200, "Progress fetched", result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};