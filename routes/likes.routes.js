import express from "express";
import { toggleLike, getLikeCount } from "../controllers/likes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// ✅ UPDATED: Import specific limiters
import { interactionLimiter, apiLimiter } from "../middlewares/ratelimiter.middleware.js";

import {
  validate,
  toggleLikeValidation,
  getLikeCountValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

// ✅ UPDATED: Use interactionLimiter for toggling likes (30 req / min)
router.post(
  "/:id/like", 
  authMiddleware, 
  interactionLimiter,  // ✅ Changed to interactionLimiter
  validate(toggleLikeValidation),
  toggleLike
);

// ✅ UPDATED: Use apiLimiter for getting like count (100 req / min)
router.get(
  "/:id/likes", 
  apiLimiter,  // ✅ Changed to apiLimiter
  validate(getLikeCountValidation),
  getLikeCount
);

export default router;
