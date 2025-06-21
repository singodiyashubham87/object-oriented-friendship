import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const User = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name"),
    userName: text("username").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    avatar: text("avatar"),
    phone: text("phone"),
    bio: text("bio"),
    skills: text("skills").array().default([]),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index(table.userName),
    index(table.email),
    index(table.createdAt),
  ],
);
