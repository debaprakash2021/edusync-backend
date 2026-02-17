import express from "express";
import { addComment, getComments } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// ✅ ADD THIS
import {
  validate,
  addCommentValidation,
  getCommentsValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post(
  "/:id/comments", 
  authMiddleware, 
  validate(addCommentValidation),  // ✅ NEW
  addComment
);

router.get(
  "/:id/comments", 
  validate(getCommentsValidation),  // ✅ NEW
  getComments
);

export default router;