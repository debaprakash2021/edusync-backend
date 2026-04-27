import express from "express";
import {
  createCoupon,
  validateCoupon,
  deactivateCoupon,
  getAllCoupons,
} from "../controllers/coupon.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { apiLimiter, interactionLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  createCoupon
);

router.post(
  "/validate",
  authMiddleware,
  interactionLimiter,
  validateCoupon
);

router.patch(
  "/:couponId/deactivate",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deactivateCoupon
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  apiLimiter,
  getAllCoupons
);

export default router;