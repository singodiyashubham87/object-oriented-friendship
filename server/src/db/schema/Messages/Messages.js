import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const MessageTypeEnums = pgEnum("message_type", [
  "text",
  "audio",
  "video",
  "image",
  "file",
]);

export const Messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    chatId: uuid("chat_id")
      .references(() => Chats.id, { onDelete: "cascade" })
      .notNull(),
    senderId: uuid("sender_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    contentType: MessageTypeEnums("content_type").default("text").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index(table.chatId),
    index(table.senderId),
    index(table.contentType),
    index(table.createdAt),
  ],
);
