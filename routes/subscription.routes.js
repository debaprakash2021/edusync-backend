import express from "express";
import {
  createPlan,
  getPlans,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  getMySubscription,
} from "../controllers/subscription.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { apiLimiter, interactionLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.get("/plans", apiLimiter, getPlans);

router.post(
  "/plans",
  authMiddleware,
  authorizeRoles("ADMIN"),
  createPlan
);

router.post(
  "/plans/:planId/order",
  authMiddleware,
  interactionLimiter,
  createSubscriptionOrder
);

router.post(
  "/verify",
  authMiddleware,
  interactionLimiter,
  verifySubscriptionPayment
);

router.get(
  "/my",
  authMiddleware,
  apiLimiter,
  getMySubscription
);

export default router;