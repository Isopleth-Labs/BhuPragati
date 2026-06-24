// ─── Utility: Deterministic Random ───
export function srand(seed: number): number {
	return Math.abs(Math.sin(seed * 9876.54321)) % 1
}

export interface Region {
	id: number
	x: number
	y: number
	minTier: number
	size: number
	type: string
}

export interface Corridor {
	id: number
	r1: Region
	r2: Region
	waypoints: { x: number; y: number }[]
	minTier: number
	type: string
	length: number
}

// ─── Geographic Corridor Network Definition ───
// Built to look like an infrastructure planning dashboard.
export function buildInfrastructureData() {
	const regions: Region[] = []
	const corridors: Corridor[] = []
	let id = 0

	// Add a region/city cluster
	const addRegion = (
		x: number,
		y: number,
		minTier: number,
		size: number,
		type = "hub",
	) => {
		const region = { id: id++, x, y, minTier, size, type }
		regions.push(region)
		return region
	}

	// Add a corridor with intermediate waypoints for geographic realism
	const addCorridor = (
		r1: Region | undefined,
		r2: Region | undefined,
		minTier: number,
		type = "highway",
	) => {
		if (!r1 || !r2) return
		const waypoints: { x: number; y: number }[] = []
		const dist = Math.hypot(r2.x - r1.x, r2.y - r1.y)
		const numWaypoints = Math.max(1, Math.floor(dist / 25))

		for (let i = 1; i < numWaypoints; i++) {
			const t = i / numWaypoints
			const jx = (srand(r1.id + i * 10) - 0.5) * 8 // jitter
			const jy = (srand(r2.id + i * 10) - 0.5) * 8
			waypoints.push({
				x: r1.x + (r2.x - r1.x) * t + jx,
				y: r1.y + (r2.y - r1.y) * t + jy,
			})
		}

		corridors.push({
			id: id++,
			r1,
			r2,
			waypoints,
			minTier,
			type,
			length: dist,
		})
	}

	// Canvas bounds: roughly 200x120

	// 1. TIER 0: Current State (Sparse, Gaps)
	// Major Northern Corridor
	const delhi = addRegion(60, 25, 0, 1.0, "mega-hub")
	const lucknow = addRegion(90, 35, 0, 0.6, "regional")
	const patna = addRegion(125, 45, 0, 0.7, "regional")
	addCorridor(delhi, lucknow, 0, "highway")
	addCorridor(lucknow, patna, 0, "highway")

	// Major Western Corridor
	const ahmedabad = addRegion(40, 50, 0, 0.8, "regional")
	const mumbai = addRegion(35, 75, 0, 1.0, "mega-hub")
	addCorridor(delhi, ahmedabad, 0, "highway")
	addCorridor(ahmedabad, mumbai, 0, "highway")

	// Disconnected Eastern Cluster
	const kolkata = addRegion(160, 60, 0, 0.9, "mega-hub")
	const guwahati = addRegion(185, 45, 0, 0.5, "regional")
	addCorridor(kolkata, guwahati, 0, "rail") // Only local rail, no highway west

	// Disconnected Southern Cluster
	const bangalore = addRegion(75, 100, 0, 0.9, "mega-hub")
	const chennai = addRegion(105, 95, 0, 0.8, "regional")
	addCorridor(bangalore, chennai, 0, "highway")

	// Central Void - Isolated settlements
	const nagpur = addRegion(95, 65, 0, 0.4, "settlement")
	const raipur = addRegion(115, 60, 0, 0.3, "settlement")
	// No corridors to them

	// 2. TIER 1: Investment Scenario (New Corridors Under Construction)
	// Bridging the East Gap
	const asansol = addRegion(145, 50, 1, 0.5, "settlement")
	addCorridor(patna, asansol, 1, "highway")
	addCorridor(asansol, kolkata, 1, "highway")

	// Bridging the South Gap (Mumbai to Bangalore)
	const pune = addRegion(50, 80, 1, 0.6, "regional")
	const belgaum = addRegion(60, 90, 1, 0.4, "settlement")
	addCorridor(mumbai, pune, 1, "highway")
	addCorridor(pune, belgaum, 1, "highway")
	addCorridor(belgaum, bangalore, 1, "highway")

	// Central Grid Initiation
	addRegion(95, 65, 1, 0.7, "regional") // Upgraded Nagpur
	const hyderabad = addRegion(85, 80, 1, 0.8, "regional")
	addCorridor(delhi, nagpur, 1, "rail")
	addCorridor(nagpur, hyderabad, 1, "rail")
	addCorridor(hyderabad, bangalore, 1, "rail")

	// 3. TIER 2: Projected Outcome (Fully Connected Resilience)
	// East Coast Corridor
	const bhubaneswar = addRegion(135, 75, 2, 0.6, "regional")
	const vizag = addRegion(120, 85, 2, 0.5, "regional")
	const vijayawada = addRegion(105, 90, 2, 0.5, "regional")
	addCorridor(kolkata, bhubaneswar, 2, "highway")
	addCorridor(bhubaneswar, vizag, 2, "highway")
	addCorridor(vizag, vijayawada, 2, "highway")
	addCorridor(vijayawada, chennai, 2, "highway")

	// Trans-Central Cross Links
	addCorridor(nagpur, raipur, 2, "highway")
	addCorridor(raipur, kolkata, 2, "highway")

	const indore = addRegion(65, 55, 2, 0.6, "regional")
	addCorridor(ahmedabad, indore, 2, "highway")
	addCorridor(indore, nagpur, 2, "highway")
	addCorridor(hyderabad, vijayawada, 2, "highway")

	return { regions, corridors }
}

export const INFRA_DATA = buildInfrastructureData()

// ─── Theming & Configs ───
export const THEMES = [
	{
		colorRGB: "255, 107, 87", // Red/Orange - Current State
		bgColor: "rgba(255, 107, 87, 0.05)",
	},
	{
		colorRGB: "255, 211, 77", // Yellow - Investment
		bgColor: "rgba(255, 211, 77, 0.08)",
	},
	{
		colorRGB: "39, 255, 208", // Cyan - Outcome
		bgColor: "rgba(39, 255, 208, 0.08)",
	},
]
