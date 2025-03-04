import { Bookmarks } from "./Bookmarks/Bookmarks";
import { Chats } from "./Chats/Chats";
import { MessageTypeEnums, Messages } from "./Messages/Messages";
import { RequestStatusEnums, Requests } from "./Requests/Requests";
import { Users } from "./Users/Users";

// Export enum types first to avoid enum errors while creating table in DB
export { RequestStatusEnums, MessageTypeEnums };

// Export all the tables to be created in DB after enum creation
export { Users, Requests, Bookmarks, Chats, Messages };
