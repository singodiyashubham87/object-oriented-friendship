import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { Chat } from "../Chat/Chat.js";
import { User } from "../User/User.js";

export const MessageTypeEnums = pgEnum("message_type", [
  "text",
  "audio",
  "video",
  "image",
  "file",
]);

export const Message = pgTable(
  "message",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    chatId: uuid("chat_id")
      .references(() => Chat.id, { onDelete: "cascade" })
      .notNull(),
    senderId: uuid("sender_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    contentType: MessageTypeEnums("content_type").default("text").notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("chat_id_idx").on(table.chatId),
    index("sender_id_idx").on(table.senderId),
    index("created_at_idx").on(table.createdAt),
  ],
);
