import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

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
