import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Initialize Neon connection
export const sql = neon(process.env.DATABASE_URL!)

// Initialize Drizzle ORM
export const db = drizzle(sql)

// Usage example:
async function example() {
  await db.transaction(async (tx) => {
    // Use tx for your queries, e.g.:
    // await tx.insert(...);
  });
}
// Call example() somewhere appropriate, or just keep it as a reference.
