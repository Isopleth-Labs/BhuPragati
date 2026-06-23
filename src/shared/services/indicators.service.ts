import {
	type RegionIndicators,
	STATE_INDICATORS_DATA,
} from "@/data/state-indicators"

export const indicatorsService = {
	async getIndicatorById(id: string): Promise<RegionIndicators | undefined> {
		return STATE_INDICATORS_DATA[id]
	},

	async getAllIndicators(): Promise<Record<string, RegionIndicators>> {
		return STATE_INDICATORS_DATA
	},

	async getRankings(
		activeIndicator: string,
		limit = 8,
	): Promise<Array<{ id: string; name: string; score: number }>> {
		return Object.values(STATE_INDICATORS_DATA)
			.map((state) => ({
				id: state.id,
				name: state.name,
				score: (state.metrics as Record<string, number>)[activeIndicator] ?? 0,
			}))
			.sort((a, b) => b.score - a.score)
			.slice(0, limit)
	},
}
