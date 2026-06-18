import type { BoundaryProvider } from "../types"

// Interface stub. PMTiles support is Phase 3+ per map_engine.md's library
// table — not implemented yet. Exists so resolveBoundaryProvider() can be
// pointed at "pmtiles" in config without a missing-module error, the day
// a level's config/levelProviders.json entry is switched to it.
export const PmtilesBoundaryProvider: BoundaryProvider = {
	id: "pmtiles",

	supportsLevel() {
		return false
	},

	async getSourceDescriptor() {
		throw new Error("PmtilesBoundaryProvider is not implemented yet.")
	},

	async getRegionMeta() {
		throw new Error("PmtilesBoundaryProvider is not implemented yet.")
	},

	async getChildren() {
		throw new Error("PmtilesBoundaryProvider is not implemented yet.")
	},
}
