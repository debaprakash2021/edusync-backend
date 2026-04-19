import {
  createCourseService,
  getCoursesService,
  getCourseByIdService,
  updateCourseService,
  createSectionService,
  createLectureService,
} from "../services/course.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const createCourse = async (req, res) => {
  try {
    const course = await createCourseService(req.user.id, req.body);
    sendSuccess(res, 201, "Course created", course);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await getCoursesService(req.query);
    sendSuccess(res, 200, "Courses fetched", courses);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const getCourseById = async (req, res) => {
  try {
    const data = await getCourseByIdService(req.params.id);
    sendSuccess(res, 200, "Course fetched", data);
  } catch (err) {
    sendError(res, 404, err.message);
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await updateCourseService(req.params.id, req.user.id, req.body);
    sendSuccess(res, 200, "Course updated", course);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const createSection = async (req, res) => {
  try {
    const { title, order } = req.body;
    const section = await createSectionService(req.params.courseId, req.user.id, title, order);
    sendSuccess(res, 201, "Section created", section);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const createLecture = async (req, res) => {
  try {
    const lecture = await createLectureService(
      req.params.sectionId,
      req.user.id,
      req.body,
      req.file
    );
    sendSuccess(res, 201, "Lecture created", lecture);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};