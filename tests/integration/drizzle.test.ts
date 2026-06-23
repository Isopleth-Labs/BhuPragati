/**
 * Integration test for Drizzle ORM + PostgreSQL (Testcontainers).
 *
 * This test:
 * - Starts a real PostgreSQL container using Testcontainers
 * - Connects to it using postgres.js driver
 * - Wraps the connection with Drizzle ORM
 * - Executes a simple query through Drizzle
 * - Validates that Drizzle is correctly wired to the database
 */

import {
	PostgreSqlContainer,
	type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let container: StartedPostgreSqlContainer
let sql: ReturnType<typeof postgres>
let db: ReturnType<typeof drizzle>

describe("Drizzle integration", () => {
	beforeAll(async () => {
		container = await new PostgreSqlContainer("postgres:18")
			.withDatabase("test")
			.withUsername("postgres")
			.withPassword("postgres")
			.start()

		sql = postgres(container.getConnectionUri(), { max: 1 })
		db = drizzle(sql)
	})

	afterAll(async () => {
		await sql.end()
		await container.stop()
	})

	it("should run query via drizzle", async () => {
		const result = await db.execute("select 1 as ok")

		expect(result).toHaveLength(1)
		expect(result[0]?.ok).toBe(1)
	})
})