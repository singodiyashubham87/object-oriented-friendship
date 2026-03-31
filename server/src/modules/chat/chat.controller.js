import Response from "../../utils/response.js";
import * as chatService from "./chat.service.js";

const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await chatService.getAllChats(userId);

    return Response.success(res, "Chats fetched successfully", { chats });
  } catch (error) {
    return Response.exception(res, "Failed to fetch chats", error);
  }
};

const createChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetUserId = req.params.userId;

    if (!targetUserId) throw new Error("Target user ID is required");

    const chat = await chatService.createOrGetChat(userId, targetUserId);

    return Response.success(res, "Chat created successfully", { chat });
  } catch (error) {
    if (error.message === "You can only chat with friends") {
      return Response.forbidden(res, error.message);
    }
    return Response.exception(res, "Failed to create chat", error);
  }
};

export { getAllChats, createChat };
