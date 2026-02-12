import { getChatsByThreadService, sendChatService } from "../services/chat.service.js";

export const getChartByThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        const chats = await getChatsByThreadService(threadId);
        res.status(200).json({
            success: true,
            data: chats
        });
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch chats"
        });
    }
}

export const sendChat = async (req, res) => {
    try {
        const senderId = req.user._id || req.user.id;
        const { receiverId, message } = req.body;
        const chat = await sendChatService(senderId, receiverId, message);
        res.status(201).json({
            success: true,
            data: chat
        });
    } catch (error) {
        console.error("Error sending chat:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send chat"
        });
    }
}