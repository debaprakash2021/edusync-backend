import express from "express";
import {
  scheduleLiveClass,
  getUpcomingClasses,
  getInstructorClasses,
  joinLiveClass,
  endLiveClass,
  cancelLiveClass,
} from "../controllers/liveClass.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { apiLimiter, interactionLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.post(
  "/courses/:courseId",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  scheduleLiveClass
);

router.get(
  "/courses/:courseId/upcoming",
  authMiddleware,
  apiLimiter,
  getUpcomingClasses
);

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  apiLimiter,
  getInstructorClasses
);

router.post(
  "/:liveClassId/join",
  authMiddleware,
  interactionLimiter,
  joinLiveClass
);

router.patch(
  "/:liveClassId/end",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  endLiveClass
);

router.patch(
  "/:liveClassId/cancel",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  cancelLiveClass
);

export default router;