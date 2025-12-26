import { Bookmark } from "./Bookmark/Bookmark.js";
import { Chat } from "./Chat/Chat.js";
import { Message, MessageTypeEnums } from "./Message/Message.js";
import { Notification } from "./Notification/Notification.js";
import { PasswordReset } from "./PasswordReset/PasswordReset.js";
import { Request, RequestStatusEnums } from "./Request/Request.js";
import { User } from "./User/User.js";

// Export enum types first to avoid enum errors while creating table in DB
export { RequestStatusEnums, MessageTypeEnums };

// Export all the tables to be created in DB after enum creation
export { User, Request, Bookmark, Chat, Message, PasswordReset, Notification };
