import express from "express";
import {
  toggleBookmark,
  getMyBookmarks,
} from "../controllers/bookmark.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter, interactionLimiter } from "../middlewares/ratelimiter.middleware.js";

const router = express.Router();

router.post("/lectures/:lectureId", authMiddleware, interactionLimiter, toggleBookmark);
router.get("/my", authMiddleware, apiLimiter, getMyBookmarks);

export default router;