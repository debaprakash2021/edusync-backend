import express from "express";
import {
  addReview,
  updateReview,
  deleteReview,
  getCourseReviews,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter, interactionLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.get("/:courseId/reviews", apiLimiter, getCourseReviews);
router.post("/:courseId/reviews", authMiddleware, interactionLimiter, addReview);
router.patch("/reviews/:reviewId", authMiddleware, updateReview);
router.delete("/reviews/:reviewId", authMiddleware, deleteReview);

export default router;