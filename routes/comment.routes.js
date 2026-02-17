import express from "express";
import { addComment, getComments } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// ✅ UPDATED: Import specific limiters
import { interactionLimiter, apiLimiter } from "../middlewares/ratelimiter.middleware.js";

import {
  validate,
  addCommentValidation,
  getCommentsValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

// ✅ UPDATED: Use interactionLimiter for adding comments (30 req / min)
router.post(
  "/:id/comments", 
  authMiddleware, 
  interactionLimiter,  // ✅ Changed to interactionLimiter
  validate(addCommentValidation),
  addComment
);

// ✅ UPDATED: Use apiLimiter for reading comments (100 req / min)
router.get(
  "/:id/comments", 
  apiLimiter,  // ✅ Changed to apiLimiter
  validate(getCommentsValidation),
  getComments
);

export default router;