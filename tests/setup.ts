import {
	PostgreSqlContainer,
	type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"

import postgres from "postgres"

let container: StartedPostgreSqlContainer | null = null
let sql: ReturnType<typeof postgres> | null = null

export type TestDB = {
	container: StartedPostgreSqlContainer
	sql: ReturnType<typeof postgres>
}

export async function startTestDB(): Promise<TestDB> {
	container = await new PostgreSqlContainer("postgres:18")
		.withDatabase("test")
		.withUsername("postgres")
		.withPassword("postgres")
		.start()

	sql = postgres(container.getConnectionUri(), { max: 1 })

	const db: TestDB = { container, sql }

	;(globalThis as unknown as { __TEST_DB__: TestDB }).__TEST_DB__ = db

	return db
}

export async function stopTestDB() {
	if (sql) await sql.end()
	if (container) await container.stop()

	container = null
	sql = null
}
