import express from "express";
import { getChartByThread, sendChat } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// ✅ ADD THIS
import {
  validate,
  sendChatValidation,
  getChatsByThreadValidation
} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.get(
  "/:threadId",
  authMiddleware,
  validate(getChatsByThreadValidation),  // ✅ NEW
  getChartByThread
);

router.post(
  "/",
  authMiddleware,
  validate(sendChatValidation),  // ✅ NEW
  sendChat
);

export default router;