export type RegionLevel =
	| "country"
	| "state"
	| "district"
	| "block"
	| "panchayat"
	| "village"

// What a layer component hands to MapLibre's addSource — provider-agnostic.
// 'geojson' carries inline data; 'vector' carries a tile URL/template
// (covers PMTiles and any generic vector-tile API with one source shape).
export interface BoundarySourceDescriptor {
	type: "geojson" | "vector"
	data?: GeoJSON.FeatureCollection
	url?: string
	promoteId?: string
	minzoom?: number
	maxzoom?: number
}

export interface RegionMeta {
	id: string
	slug: string
	name: { en: string; hi?: string }
	level: RegionLevel
	parentId: string | null
	centroid: { lon: number; lat: number }
	bbox: { north: number; south: number; east: number; west: number }
	defaultZoom: number
}

export interface BoundaryProvider {
	readonly id: string
	supportsLevel(level: RegionLevel): boolean
	getSourceDescriptor(
		level: RegionLevel,
		parentId?: string,
	): Promise<BoundarySourceDescriptor | null>
	getRegionMeta(regionId: string): Promise<RegionMeta | null>
	getChildren(parentId: string): Promise<RegionMeta[]>
}
