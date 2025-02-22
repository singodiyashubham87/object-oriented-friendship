import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const requestStatusEnums = pgEnum("request_status", [
  "pending",
  "accepted",
  "rejected",
]);

const messageTypeEnums = pgEnum("message_type", [
  "text",
  "audio",
  "video",
  "image",
  "file",
]);

export const Users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    fullName: text("full_name").notNull(),
    username: text("username").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    profilePic: text("profile_pic").notNull(),
    bio: text("bio"),
    skills: text("skills").array().default([]),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index(table.username),
    index(table.email),
    index(table.createdAt),
  ],
);

export const Requests = pgTable(
  "requests",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    senderId: uuid("sender_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    receiverId: uuid("receiver_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    status: requestStatusEnums("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index(table.senderId),
    index(table.receiverId),
    index(table.status),
  ],
);

export const Bookmarks = pgTable(
  "bookmarks",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    bookmarkerId: uuid("bookmarker_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    bookmarkedId: uuid("bookmarked_id")
      .references(() => Users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index(table.bookmarkerId), index(table.bookmarkedId)],
);

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
    contentType: messageTypeEnums("content_type").default("text").notNull(),
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

// If not exported then neondb(whoever the provider is) won't know that these enums types has to be created for the tables
export { requestStatusEnums, messageTypeEnums };
