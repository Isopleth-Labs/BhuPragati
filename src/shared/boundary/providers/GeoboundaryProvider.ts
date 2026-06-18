import type { BoundaryProvider } from "../types"

// Interface stub for the geoBoundaries.org-style external API. Not
// implemented this phase — exists only to satisfy the BoundaryProvider
// contract so the registry can reference it.
export const GeoboundaryProvider: BoundaryProvider = {
	id: "geoboundary",

	supportsLevel() {
		return false
	},

	async getSourceDescriptor() {
		throw new Error("GeoboundaryProvider is not implemented yet.")
	},

	async getRegionMeta() {
		throw new Error("GeoboundaryProvider is not implemented yet.")
	},

	async getChildren() {
		throw new Error("GeoboundaryProvider is not implemented yet.")
	},
}
