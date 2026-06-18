/**
 * Region type definitions
 * Matches spec contract: types/region.ts
 */

export type RegionLevel =
	| "country"
	| "state"
	| "district"
	| "block"
	| "panchayat"
	| "village"

export interface Region {
	id: string
	slug: string
	name: string
	name_hi?: string
	level: RegionLevel
	parentId?: string
	centroid: [number, number] // [lon, lat]
	bbox: [number, number, number, number] // [west, south, east, north]
	zoom: number
}

export interface RegionHierarchy {
	country: Region
	states: Region[]
	districts: Region[]
	blocks: Region[]
	villages?: Region[]
}
