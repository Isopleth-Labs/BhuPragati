import type { Region } from "@/data/regions"
import { regionsService } from "@/shared/services/regions.service"
import { BoundaryCache } from "../cache"
import boundarySources from "../config/boundarySources.json"
import type {
	BoundaryProvider,
	BoundarySourceDescriptor,
	RegionLevel,
	RegionMeta,
} from "../types"

const SUPPORTED_LEVELS: readonly RegionLevel[] = [
	"country",
	"state",
	"district",
	"block",
	"panchayat",
	"village",
]

const sourceCache = new BoundaryCache<BoundarySourceDescriptor | null>()

// boundarySources.json entries are either a single path (one dataset for
// the whole level) or a map keyed by parentId (one dataset per state, e.g.
// district boundaries split by which state they belong to).
type BoundarySourceConfig = string | Record<string, string> | null

function resolveSourcePath(
	config: BoundarySourceConfig,
	parentId?: string,
): string | null {
	if (typeof config === "string") return config
	if (config && parentId) return config[parentId] ?? null
	return null
}

function isBoundaryLevel(level: string): level is RegionLevel {
	return (SUPPORTED_LEVELS as readonly string[]).includes(level)
}

function toRegionMeta(region: Region | undefined): RegionMeta | null {
	if (!region || !isBoundaryLevel(region.level)) return null
	return {
		id: region.id,
		slug: region.slug,
		name: region.name,
		level: region.level,
		parentId: region.parentId,
		centroid: region.centroid,
		bbox: region.bbox,
		defaultZoom: region.defaultZoom,
	}
}

// Real implementation of BoundaryProvider. Backs metadata off the existing
// @/data/regions registry (already JSON-backed) and, for geometry, reads
// a path from config/boundarySources.json keyed by level (and, for
// per-state datasets like district boundaries, by parentId too).
// fetch() here is the sanctioned boundary — it lives inside the provider,
// never in feature code.
export const GeoJsonBoundaryProvider: BoundaryProvider = {
	id: "geojson",

	supportsLevel(level) {
		return SUPPORTED_LEVELS.includes(level)
	},

	async getSourceDescriptor(level, parentId) {
		const cacheKey = parentId ? `${level}:${parentId}` : level

		return sourceCache.getOrLoad(cacheKey, async () => {
			const config = (boundarySources as Record<string, BoundarySourceConfig>)[
				level
			]
			const path = resolveSourcePath(config, parentId)
			if (!path) return null

			const res = await fetch(path)
			if (!res.ok) return null

			const data = (await res.json()) as GeoJSON.FeatureCollection
			return { type: "geojson", data }
		})
	},

	async getRegionMeta(regionId) {
		const region = await regionsService.getRegionById(regionId)
		return toRegionMeta(region)
	},

	async getChildren(parentId) {
		const children = await regionsService.getChildren(parentId)
		return children
			.map(toRegionMeta)
			.filter((meta): meta is RegionMeta => meta !== null)
	},
}
