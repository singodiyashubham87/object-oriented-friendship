import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { User } from "../User/User.js";

export const Chat = pgTable(
  "chat",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    senderId: uuid("sender_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    receiverId: uuid("receiver_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    lastMessage: text("last_message"),
    lastMessageAt: timestamp("last_message_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("chat_sender_id_idx").on(table.senderId),
    index("chat_receiver_id_idx").on(table.receiverId),
    index("chat_last_message_at_idx").on(table.lastMessageAt),
    unique("unique_chat_thread").on(table.senderId, table.receiverId),
  ],
);
