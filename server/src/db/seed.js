import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { seed } from "drizzle-seed";
import { Bookmarks, Chats, Messages, Requests, Users } from "./schema/index.js";

const seedCount = 10;

async function seedDatabase(seedCount) {
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  try {
    console.log("🌱 Starting database seeding...🌱");
    await seed(
      db,
      { Users, Requests, Bookmarks, Chats, Messages },
      { count: seedCount },
    );
    console.log("✅ Database seeding completed successfully.");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  }
}

seedDatabase(seedCount);
