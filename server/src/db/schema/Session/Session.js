import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { User } from "../User/User.js";

export const Session = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    refreshTokenHash: text("refresh_token_hash").notNull().unique(),
    deviceInfo: text("device_info"),
    ipAddress: text("ip_address"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("sessions_refresh_token_hash_idx").on(table.refreshTokenHash),
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_ip_address_idx").on(table.ipAddress),
  ],
);
