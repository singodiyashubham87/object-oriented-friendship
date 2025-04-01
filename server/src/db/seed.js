import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { seed } from "drizzle-seed";
import { Bookmark, Chat, Message, Request, User } from "./schema/index.js";

const seedCount = 10;

async function seedDatabase(seedCount) {
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  try {
    console.log("🌱 Starting database seeding...🌱");
    await seed(
      db,
      { User, Request, Bookmark, Chat, Message },
      { count: seedCount },
    );
    console.log("✅ Database seeding completed successfully.");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  }
}

seedDatabase(seedCount);
