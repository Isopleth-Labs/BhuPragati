import regionJson from "./regions.json" with { type: "json" };

export type RegionLevel =
	| "planet"
	| "country"
	| "state"
	| "district"
	| "block"
	| "panchayat"
	| "village"
	| "pin";

export type Coordinates = {
	lat: number;
	lon: number;
};

export type BoundingBox = {
	north: number;
	south: number;
	east: number;
	west: number;
};

export type Region = {
	id: string;
	slug: string;
	name: {
		en: string;
		hi?: string;
	};
	level: RegionLevel;
	parentId: string | null;
	// Navigation centroid (fallback when boundary geometry is unavailable)
	centroid: Coordinates;
	// Navigation bbox (fallback when boundary geometry is unavailable)
	bbox: BoundingBox;
	pinCodes: string[];
	lgdCode?: string | null;
	aliases: string[];
	// Authoritative boundary source (used when present for fit / highlight)
	boundaryPath?: string | null;
	defaultZoom: number;
};

const REGIONS: Region[] = regionJson as Region[];

const REGION_INDEX: Map<string, Region> = new Map(
	REGIONS.map((region) => [region.id, region]),
);

export function getRegion(id: string): Region | undefined {
	return REGION_INDEX.get(id);
}

export function getChildren(parentId: string): Region[] {
	return REGIONS.filter((region) => region.parentId === parentId);
}

export function getAncestorChain(id: string): Region[] {
	const chain: Region[] = [];
	let cursor = getRegion(id);

	while (cursor) {
		chain.push(cursor);
		cursor = cursor.parentId ? getRegion(cursor.parentId) : undefined;
	}

	return chain.reverse();
}

function normalize(value: string): string {
	return value.toLowerCase().trim();
}

function matchesQuery(region: Region, query: string): boolean {
	const q = normalize(query);
	if (!q) return false;

	const nameEn = normalize(region.name.en);
	if (nameEn.includes(q)) return true;

	if (region.name.hi && normalize(region.name.hi).includes(q)) return true;

	if (region.aliases.some((alias) => normalize(alias).includes(q))) return true;

	if (region.pinCodes.some((pin) => pin === q)) return true;

	return false;
}

export function searchRegions(query: string): Region[] {
	if (!query.trim()) return [];
	return REGIONS.filter((region) => matchesQuery(region, query));
}

export function addRegions(regions: Region[]): void {
	regions.forEach((region) => {
		if (REGION_INDEX.has(region.id)) {
			return;
		}
		REGIONS.push(region);
		REGION_INDEX.set(region.id, region);
	});
}

export { REGIONS };
