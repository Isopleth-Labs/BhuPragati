import type { BoundaryProvider } from "../types";

// Interface stub for a future first-party backend endpoint. Not
// implemented this phase — exists only to satisfy the BoundaryProvider
// contract so the registry can reference it.
export const ApiBoundaryProvider: BoundaryProvider = {
	id: "api",

	supportsLevel() {
		return false;
	},

	async getSourceDescriptor() {
		throw new Error("ApiBoundaryProvider is not implemented yet.");
	},

	async getRegionMeta() {
		throw new Error("ApiBoundaryProvider is not implemented yet.");
	},

	async getChildren() {
		throw new Error("ApiBoundaryProvider is not implemented yet.");
	},
};
