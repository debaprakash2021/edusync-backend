import express from "express";
import {
  createOrder,
  verifyPayment,
  razorpayWebhook,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.post("/:courseId/order", authMiddleware, apiLimiter, createOrder);
router.post("/verify", authMiddleware, apiLimiter, verifyPayment);
router.post("/webhook", razorpayWebhook);

export default router;