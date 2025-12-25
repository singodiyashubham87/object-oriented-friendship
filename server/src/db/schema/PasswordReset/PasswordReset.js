import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { User } from "../User/User.js";

export const PasswordReset = pgTable(
  "password_resets",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("password_resets_token_hash_idx").on(table.tokenHash),
    index("password_resets_expires_at_idx").on(table.expiresAt),
  ],
);
