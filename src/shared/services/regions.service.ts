import {
	getAncestorChain,
	getChildren,
	getRegion,
	REGIONS,
	type Region,
	searchRegions,
} from "@/data/regions"

export interface RegionQueryOptions {
	id?: string
	parentId?: string
	searchQuery?: string
}

export const regionsService = {
	async getRegionById(id: string): Promise<Region | undefined> {
		return getRegion(id)
	},

	async getChildren(parentId: string): Promise<Region[]> {
		return getChildren(parentId)
	},

	async getAncestorChain(id: string): Promise<Region[]> {
		return getAncestorChain(id)
	},

	async search(query: string): Promise<Region[]> {
		return searchRegions(query)
	},

	async getAll(): Promise<Region[]> {
		return REGIONS
	},
}
