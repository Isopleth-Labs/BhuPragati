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
  lgdCode?: string;
  aliases: string[];
  // Authoritative boundary source (used when present for fit / highlight)
  boundaryPath?: string | null;
  defaultZoom: number;
};

const REGIONS: Region[] = [
  {
    id: "earth",
    slug: "earth",
    name: { en: "Earth" },
    level: "planet",
    parentId: null,
    centroid: { lon: 0, lat: 0 },
    bbox: { north: 90, south: -90, east: 180, west: -180 },
    pinCodes: [],
    lgdCode: undefined,
    aliases: ["planet"],
    boundaryPath: null,
    defaultZoom: 1.5,
  },
  {
    id: "india",
    slug: "india",
    name: { en: "India", hi: "भारत" },
    level: "country",
    parentId: "earth",
    centroid: { lon: 78.9629, lat: 20.5937 },
    bbox: { north: 37, south: 6, east: 98, west: 68 },
    pinCodes: [],
    lgdCode: undefined,
    aliases: ["bharat", "india", "भारत"],
    boundaryPath: "/geojson/india/country.geojson",
    defaultZoom: 4.5,
  },
  {
    id: "bihar",
    slug: "bihar",
    name: { en: "Bihar", hi: "बिहार" },
    level: "state",
    parentId: "india",
    centroid: { lon: 85.3131, lat: 25.0961 },
    bbox: { north: 27.5, south: 24.2, east: 88.3, west: 83.3 },
    pinCodes: [],
    lgdCode: undefined,
    aliases: ["bihar", "बिहार"],
    boundaryPath: "/geojson/india/states/bihar.geojson",
    defaultZoom: 7,
  },
  {
    id: "darbhanga",
    slug: "darbhanga",
    name: { en: "Darbhanga", hi: "दरभंगा" },
    level: "district",
    parentId: "bihar",
    centroid: { lon: 85.8956, lat: 26.1542 },
    bbox: { north: 26.45, south: 25.85, east: 86.35, west: 85.45 },
    pinCodes: ["846001"],
    lgdCode: undefined,
    aliases: ["darbhanga", "दरभंगा"],
    boundaryPath: "/geojson/bihar/districts/darbhanga.geojson",
    defaultZoom: 10,
  },
  {
    id: "kusheshwar-asthan",
    slug: "kusheshwar-asthan",
    name: { en: "Kusheshwar Asthan", hi: "कुशेश्वर अस्थान" },
    level: "block",
    parentId: "darbhanga",
    centroid: { lon: 86.2804523, lat: 25.8324313 },
    bbox: { north: 25.9079689, south: 25.7530878, east: 86.330223, west: 86.2166974 },
    pinCodes: ["848213"],
    lgdCode: undefined,
    aliases: ["kusheshwar", "ka", "कुशेश्वर अस्थान"],
    boundaryPath: "/geojson/bihar/darbhanga/blocks/kusheshwar-asthan.geojson",
    defaultZoom: 12,
  },
  {
    id: "darbhanga-sadar",
    slug: "darbhanga-sadar",
    name: { en: "Darbhanga Sadar", hi: "दरभंगा सदर" },
    level: "block",
    parentId: "darbhanga",
    centroid: { lon: 85.8995065, lat: 26.156999 },
    bbox: { north: 26.316999, south: 25.996999, east: 86.0595065, west: 85.7395065 },
    pinCodes: ["846001"],
    lgdCode: undefined,
    aliases: ["sadar", "darbhanga sadar", "दरभंगा सदर"],
    boundaryPath: "/geojson/bihar/darbhanga/blocks/darbhanga-sadar.geojson",
    defaultZoom: 11.5,
  },
  {
    id: "biraul",
    slug: "biraul",
    name: { en: "Biraul", hi: "बिरौल" },
    level: "block",
    parentId: "darbhanga",
    centroid: { lon: 86.1801131, lat: 25.9565302 },
    bbox: { north: 26.0314892, south: 25.8813236, east: 86.303873, west: 86.0748648 },
    pinCodes: ["848213"],
    lgdCode: undefined,
    aliases: ["biraul", "बिरौल"],
    boundaryPath: "/geojson/bihar/darbhanga/blocks/biraul.geojson",
    defaultZoom: 11.5,
  },
];

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
