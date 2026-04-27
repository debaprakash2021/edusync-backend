import {
  scheduleLiveClassService,
  getUpcomingClassesService,
  getInstructorClassesService,
  joinLiveClassService,
  endLiveClassService,
  cancelLiveClassService,
} from "../services/liveClass.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const scheduleLiveClass = async (req, res) => {
  try {
    const liveClass = await scheduleLiveClassService(
      req.user.id,
      req.params.courseId,
      req.body
    );
    sendSuccess(res, 201, "Live class scheduled", liveClass);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getUpcomingClasses = async (req, res) => {
  try {
    const classes = await getUpcomingClassesService(
      req.params.courseId,
      req.user.id
    );
    sendSuccess(res, 200, "Upcoming classes fetched", classes);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const getInstructorClasses = async (req, res) => {
  try {
    const classes = await getInstructorClassesService(req.user.id);
    sendSuccess(res, 200, "Classes fetched", classes);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

export const joinLiveClass = async (req, res) => {
  try {
    const isInstructor =
      req.user.role === "ADMIN" || req.user.role === "EDITOR";
    const result = await joinLiveClassService(
      req.params.liveClassId,
      req.user.id,
      isInstructor
    );
    sendSuccess(res, 200, "Joined live class", result);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const endLiveClass = async (req, res) => {
  try {
    const result = await endLiveClassService(
      req.params.liveClassId,
      req.user.id
    );
    sendSuccess(res, 200, result.message);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};

export const cancelLiveClass = async (req, res) => {
  try {
    const result = await cancelLiveClassService(
      req.params.liveClassId,
      req.user.id
    );
    sendSuccess(res, 200, result.message);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};