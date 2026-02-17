import express from "express";
import { getChartByThread, sendChat } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// ✅ UPDATED: Import specific limiters
import { chatLimiter, apiLimiter } from "../middlewares/ratelimiter.middleware.js";

import {
  validate,
  sendChatValidation,
  getChatsByThreadValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

// ✅ UPDATED: Use apiLimiter for reading chats (100 req / min)
router.get(
  "/:threadId",
  authMiddleware,
  apiLimiter,  // ✅ Changed to apiLimiter
  validate(getChatsByThreadValidation),
  getChartByThread
);

// ✅ UPDATED: Use chatLimiter for sending messages (20 req / min)
router.post(
  "/",
  authMiddleware,
  chatLimiter,  // ✅ Changed to chatLimiter
  validate(sendChatValidation),
  sendChat
);

export default router;