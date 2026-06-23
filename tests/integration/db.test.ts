/**
 * Integration test that verifies PostgreSQL connectivity using Testcontainers.
 *
 * Purpose:
 * Ensures the app can connect to a real PostgreSQL instance and execute queries.
 */
import {
	PostgreSqlContainer,
	type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"

import postgres from "postgres"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let container: StartedPostgreSqlContainer
let sql: ReturnType<typeof postgres>

describe("DB connection", () => {
	beforeAll(async () => {
		container = await new PostgreSqlContainer("postgres:18")
			.withDatabase("test")
			.withUsername("postgres")
			.withPassword("postgres")
			.start()

		sql = postgres(container.getConnectionUri(), { max: 1 })
	})

	afterAll(async () => {
		await sql.end()
		await container.stop()
	})

	it("should connect to postgres", async () => {
		const result = await sql<{ ok: number }[]>`SELECT 1 as ok`

		expect(result).toHaveLength(1)
		expect(result[0]?.ok).toBe(1)
	})
})
