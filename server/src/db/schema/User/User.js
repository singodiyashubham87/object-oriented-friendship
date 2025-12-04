import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const User = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name"),
    userName: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    location: text("location"),
    age: integer("age"),
    gender: text("gender"),
    avatar: text("avatar"),
    phone: text("phone"),
    bio: text("bio"),
    skills: text("skills").array().notNull().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("user_created_at_idx").on(table.createdAt)],
);
