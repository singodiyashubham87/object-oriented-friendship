import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { Users } from "../Users/Users";

export const Chats = pgTable(
  "chats",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    senderId: uuid("sender_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    receiverId: uuid("receiver_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    lastMessage: text("last_message"),
    lastMessageAt: timestamp("last_message_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index(table.senderId), index(table.receiverId)],
);
