import stateJson from "./state-indicators.json"

export interface RegionIndicators {
	id: string
	name: string
	level: "state" | "district" | "block" | "panchayat" | "village"
	parentId: string
	populationText: string
	gdpText?: string
	metrics: {
		overall: number
		population: number
		infrastructure: number
		health: number
		education: number
		agriculture: number
		connectivity: number
		power: number
	}
	metadata?: Record<string, unknown>
}

export const STATE_INDICATORS_DATA: Record<string, RegionIndicators> =
	Object.fromEntries((stateJson as RegionIndicators[]).map((s) => [s.id, s]))
