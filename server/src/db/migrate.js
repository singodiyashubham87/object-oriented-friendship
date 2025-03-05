import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const makeMigrations = async () => {
	try {
		console.log("🎯💈 Starting database migration...💈🎯");
		await migrate(db, {
			migrationsFolder: "src/db/migrations",
		});
		console.log("✅ Database migration completed successfully.");
	} catch (error) {
		console.error("❌ Error during database migration:", error);
	}
};

makeMigrations();
