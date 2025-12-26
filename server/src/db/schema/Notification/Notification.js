import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { User } from "../User/User.js";

export const Notification = pgTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    // The user who will receive this notification
    userId: uuid("user_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),

    // The user who triggered this notification (e.g., sender of request)
    actorId: uuid("actor_id").references(() => User.id, {
      onDelete: "cascade",
    }),

    // Type of notification (e.g., "request_sent", "request_received", "request_accepted", etc.)
    // Using text for flexibility - no migration needed to add new types
    type: text("type").notNull(),

    // Short title, e.g., "New Friend Request"
    title: text("title").notNull(),

    // Notification message, e.g., "John Doe sent you a friend request"
    message: text("message").notNull(),

    // Additional metadata (request ID, message ID, etc.)
    metadata: jsonb("metadata").default({}).notNull(),

    // Link to navigate when clicked, e.g., "/requests", "/messages/chat-id"
    actionUrl: text("action_url"),

    isRead: boolean("is_read").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("notification_user_id_idx").on(table.userId),
    index("notification_actor_id_idx").on(table.actorId),
    index("notification_created_at_idx").on(table.createdAt),
    index("notification_is_read_idx").on(table.isRead),
    // Compound index for common query pattern: get user's unread notifications
    index("notification_user_read_idx").on(table.userId, table.isRead),
  ],
);
