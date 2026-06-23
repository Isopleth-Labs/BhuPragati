import { useQuery } from "@tanstack/react-query"
import { STATE_INDICATORS_DATA } from "@/data/state-indicators"
import { indicatorsService } from "../services/indicators.service"

export interface UseIndicatorsOptions {
	id?: string
	activeIndicator?: string
	limit?: number
}

export function useIndicators(options: UseIndicatorsOptions = {}) {
	const { id, activeIndicator, limit = 8 } = options

	return useQuery({
		queryKey: ["indicators", { id, activeIndicator, limit }],
		queryFn: async () => {
			if (activeIndicator) {
				return indicatorsService.getRankings(activeIndicator, limit)
			}
			if (id) {
				const result = await indicatorsService.getIndicatorById(id)
				return result ? [result] : []
			}
			const all = await indicatorsService.getAllIndicators()
			return Object.values(all)
		},
		initialData: () => {
			if (activeIndicator) {
				return Object.values(STATE_INDICATORS_DATA)
					.map((state) => ({
						id: state.id,
						name: state.name,
						score:
							(state.metrics as Record<string, number>)[activeIndicator] ?? 0,
					}))
					.sort((a, b) => b.score - a.score)
					.slice(0, limit)
			}
			if (id) {
				const result = STATE_INDICATORS_DATA[id]
				return result ? [result] : []
			}
			return Object.values(STATE_INDICATORS_DATA)
		},
		staleTime: 5 * 60 * 1000, // 5 minutes standard indicator stale time
		gcTime: 10 * 60 * 1000,
	})
}
