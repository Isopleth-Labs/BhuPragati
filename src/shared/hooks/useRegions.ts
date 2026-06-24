import { useQuery } from "@tanstack/react-query"
import { REGIONS } from "@/data/regions"
import { regionsService } from "../services/regions.service"

export interface UseRegionsOptions {
	id?: string
	parentId?: string
	searchQuery?: string
}

export function useRegions(options: UseRegionsOptions = {}) {
	const { id, parentId, searchQuery } = options

	return useQuery({
		queryKey: ["regions", { id, parentId, searchQuery }],
		queryFn: async () => {
			if (id) {
				const result = await regionsService.getRegionById(id)
				return result ? [result] : []
			}
			if (parentId) {
				return regionsService.getChildren(parentId)
			}
			if (searchQuery) {
				return regionsService.search(searchQuery)
			}
			return regionsService.getAll()
		},
		initialData: () => {
			if (id) {
				const result = REGIONS.find((r) => r.id === id)
				return result ? [result] : []
			}
			if (parentId) {
				return REGIONS.filter((r) => r.parentId === parentId)
			}
			if (searchQuery) {
				return REGIONS.filter((r) =>
					r.name.en.toLowerCase().includes(searchQuery.toLowerCase()),
				)
			}
			return REGIONS
		},
		staleTime: 24 * 60 * 60 * 1000, // Highly static region meta data
		gcTime: 48 * 60 * 60 * 1000,
	})
}
