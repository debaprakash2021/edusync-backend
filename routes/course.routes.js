import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  createSection,
  createLecture,
} from "../controllers/course.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { apiLimiter, uploadLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.get("/", apiLimiter, getCourses);
router.get("/:id", apiLimiter, getCourseById);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  createCourse
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  updateCourse
);

router.post(
  "/:courseId/sections",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  createSection
);

router.post(
  "/sections/:sectionId/lectures",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  uploadLimiter,
  upload.single("video"),
  createLecture
);

export default router;