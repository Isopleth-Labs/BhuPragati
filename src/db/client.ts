// src/db/client.ts

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const url = process.env.DATABASE_URL
if (!url) {
	throw new Error("DATABASE_URL is not defined")
}
const sql = postgres(url)

export const db = drizzle(sql)
