import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config();

if (!process.env.DATABASE_URL) {
  console.log("🔴 Cannot find database url");
}

export default {
  schema: "./src/lib/db",
  driver: "pg",
  out: "./drizzle",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
