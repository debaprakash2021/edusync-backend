import { asyncHandler } from "../middlewares/errorHandler.middleware.js";
import { ApiResponse } from "../utils/response.js";
import { getChatsByThreadService, sendChatService } from "../services/chat.service.js";

export const getChartByThread = asyncHandler(async (req, res) => {
  // ✅ threadId already validated!
  const { threadId } = req.params;
  const chats = await getChatsByThreadService(threadId);

  return ApiResponse.success(res, { chats }, "Chats retrieved successfully");
});

export const sendChat = asyncHandler(async (req, res) => {
  // ✅ receiverId and message already validated!
  const senderId = req.user.id;
  const { receiverId, message } = req.body;

  const chat = await sendChatService(senderId, receiverId, message);

  return ApiResponse.created(res, { chat }, "Message sent successfully");
});