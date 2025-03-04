import { index, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const RequestStatusEnums = pgEnum("request_status", [
  "pending",
  "accepted",
  "rejected",
]);

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
