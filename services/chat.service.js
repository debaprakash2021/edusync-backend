import Chat from "../models/chat.model.js";
import Thread from "../models/thread.model.js";


// Service to get all chats for a thread
export const getChatsByThreadService = async (threadId) => {
    return await Chat.find({ thread: threadId })
                     .populate("sender", "name email")
                     .sort({ createdAt: 1 });  // Sort by creation time ascending - oldest first

};


// Service to send a chat message
export const sendChatService = async (senderId,receiverId, message) => {
    const thread = await findOrCreateThreadService(senderId, receiverId);
    // Create and save the chat message
    const chat = new Chat({
        thread: thread._id,
        sender: senderId,
        message: message
    });
    // persist chat
    const savedChat = await chat.save();
    console.log(thread._id, senderId, message);
    // Update the thread's last message and timestamp
    thread.lastMessage = message;
    thread.lastMessageAt = new Date();
    await thread.save();

    return savedChat;

}


// Helper function to find or create a thread between two users
export const findOrCreateThreadService = async (userId1, userId2) => {

    const participants = [userId1, userId2].sort(); // Sort to ensure consistent order

    let thread = await Thread.findOne({
        participants: { $all: [userId1, userId2] },
        $expr : { $eq: [{ $size: "$participants" }, 2] }
    });

    if(!thread){
        thread = await Thread.create({
            participants: [userId1, userId2]
        });
    }

    return thread;
}