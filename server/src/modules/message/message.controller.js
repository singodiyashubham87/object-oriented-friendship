import Response from "../../utils/response.js";
import * as messageService from "./message.service.js";

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { cursor } = req.query;

    if (!chatId) throw new Error("Chat ID is required");

    const result = await messageService.getMessages(chatId, userId, cursor);

    return Response.success(res, "Messages fetched successfully", result);
  } catch (error) {
    if (error.message === "Chat not found or you are not a participant") {
      return Response.forbidden(res, error.message);
    }
    return Response.exception(res, "Failed to fetch messages", error);
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    if (!messageId) throw new Error("Message ID is required");

    const message = await messageService.markAsRead(messageId, userId);

    return Response.success(res, "Message marked as read", { message });
  } catch (error) {
    return Response.exception(res, "Failed to mark message as read", error);
  }
};

export { getMessages, markAsRead };
