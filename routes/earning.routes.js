import express from "express";
import {
  getMyEarnings,
  getCourseEarnings,
  requestWithdrawal,
  getAllWithdrawals,
  updateWithdrawalStatus,
} from "../controllers/earning.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { apiLimiter, interactionLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

// instructor routes
router.get(
  "/my",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  apiLimiter,
  getMyEarnings
);

router.get(
  "/courses/:courseId",
  authMiddleware,
  authorizeRoles("ADMIN", "EDITOR"),
  apiLimiter,
  getCourseEarnings
);

router.post(
  "/withdraw",
  authMiddleware,
  authorizeRoles("EDITOR"),
  interactionLimiter,
  requestWithdrawal
);

// admin routes
router.get(
  "/withdrawals",
  authMiddleware,
  authorizeRoles("ADMIN"),
  apiLimiter,
  getAllWithdrawals
);

router.patch(
  "/withdrawals/:withdrawalId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateWithdrawalStatus
);

export default router;