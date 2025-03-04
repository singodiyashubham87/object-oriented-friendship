import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
