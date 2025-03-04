import { Bookmarks } from "./Bookmarks/Bookmarks.js";
import { Chats } from "./Chats/Chats.js";
import { MessageTypeEnums, Messages } from "./Messages/Messages.js";
import { RequestStatusEnums, Requests } from "./Requests/Requests.js";
import { Users } from "./Users/Users.js";

// Export enum types first to avoid enum errors while creating table in DB
export { RequestStatusEnums, MessageTypeEnums };

// Export all the tables to be created in DB after enum creation
export { Users, Requests, Bookmarks, Chats, Messages };
