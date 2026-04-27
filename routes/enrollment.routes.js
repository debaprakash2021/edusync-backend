import express from "express";
import {
  enroll,
  unenroll,
  getMyCourses,
  markLectureWatched,
  getCourseProgress,
} from "../controllers/enrollment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter, interactionLimiter } from "../middlewares/ratelimiter.middleware.js";
import { checkCourseAccess } from "../middlewares/subscription.middleware.js";

const router = express.Router();

router.post("/:courseId/enroll", authMiddleware, interactionLimiter, enroll);
router.post(
  "/lectures/:lectureId/progress",
  authMiddleware,
  checkCourseAccess,
  interactionLimiter,
  markLectureWatched
);
router.delete("/:courseId/unenroll", authMiddleware, unenroll);
router.get("/my", authMiddleware, apiLimiter, getMyCourses);
router.post("/lectures/:lectureId/progress", authMiddleware, interactionLimiter, markLectureWatched);
router.get("/:courseId/progress", authMiddleware, apiLimiter, getCourseProgress);

export default router;