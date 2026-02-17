import express from "express";
import { toggleLike, getLikeCount } from "../controllers/likes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// ✅ ADD THIS
import {
  validate,
  toggleLikeValidation,
  getLikeCountValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post(
  "/:id/like", 
  authMiddleware, 
  validate(toggleLikeValidation),  // ✅ NEW
  toggleLike
);

router.get(
  "/:id/likes", 
  validate(getLikeCountValidation),  // ✅ NEW
  getLikeCount
);

export default router;