import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Initialize Neon connection
export const sql = neon(process.env.DATABASE_URL!)

// Initialize Drizzle ORM
export const db = drizzle(sql)

// Helper function for transactions
export async function transaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
  const result = await sql.transaction(async (tx: any) => {
    return await callback(tx)
  })
  return result
}
