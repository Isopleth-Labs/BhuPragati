import levelProviders from "./config/levelProviders.json";
import { ApiBoundaryProvider } from "./providers/ApiBoundaryProvider";
import { GeoboundaryProvider } from "./providers/GeoboundaryProvider";
import { GeoJsonBoundaryProvider } from "./providers/GeoJsonBoundaryProvider";
import { PmtilesBoundaryProvider } from "./providers/PmtilesBoundaryProvider";
import type { BoundaryProvider, RegionLevel, RegionMeta } from "./types";

const providers: Record<string, BoundaryProvider> = {
	geojson: GeoJsonBoundaryProvider,
	pmtiles: PmtilesBoundaryProvider,
	geoboundary: GeoboundaryProvider,
	api: ApiBoundaryProvider,
};

// Single entry point — feature code must call this instead of importing
// a concrete provider or fetching boundary files directly.
export function resolveBoundaryProvider(level: RegionLevel): BoundaryProvider {
	const providerId = (levelProviders as Record<string, string>)[level];
	const provider = providers[providerId];
	if (!provider) {
		throw new Error(`No BoundaryProvider configured for level "${level}".`);
	}
	return provider;
}

// getRegionMeta() takes no level — callers who only have a regionId (e.g.
// a viewport-fit hook) can't pick a provider via resolveBoundaryProvider()
// first. Tries each distinct configured provider once instead of guessing
// a level.
export async function getRegionMetaAnyProvider(
	regionId: string,
): Promise<RegionMeta | null> {
	const seen = new Set<BoundaryProvider>();
	for (const providerId of Object.values(
		levelProviders as Record<string, string>,
	)) {
		const provider = providers[providerId];
		if (!provider || seen.has(provider)) continue;
		seen.add(provider);

		const meta = await provider.getRegionMeta(regionId);
		if (meta) return meta;
	}
	return null;
}
