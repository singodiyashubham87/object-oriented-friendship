import { index, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { User } from "../User/User.js";

export const RequestStatusEnums = pgEnum("request_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const Request = pgTable(
  "request",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    senderId: uuid("sender_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    receiverId: uuid("receiver_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    status: RequestStatusEnums("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index(table.senderId),
    index(table.receiverId),
    index(table.status),
  ],
);
