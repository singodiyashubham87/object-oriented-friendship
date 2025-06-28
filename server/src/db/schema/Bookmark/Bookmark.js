import { index, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { User } from "../User/User.js";

export const Bookmark = pgTable(
  "bookmark",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    bookmarkerId: uuid("bookmarker_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    bookmarkedId: uuid("bookmarked_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index(table.bookmarkerId),
    index(table.bookmarkedId),
    unique("unique_bookmark").on(table.bookmarkerId, table.bookmarkedId),
  ],
);
