// Centralized Overpass data adapter: retry/backoff, multi-endpoint failover,
// and localStorage caching. Returns GeoJSON-shaped collections for common use.

type OverpassNode = {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string,string>;
};

type OverpassWay = {
  type: 'way';
  id: number;
  geometry?: Array<{ lat: number; lon: number }>;
  tags?: Record<string,string>;
};

type OverpassResponse = { elements?: Array<OverpassNode|OverpassWay> };

const DEFAULT_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

const DEFAULT_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

function osmToGeoJson(osm: OverpassResponse) {
  const roads: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
  const places: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

  for (const el of osm.elements || []) {
    if (el.type === 'way' && el.geometry && el.tags?.highway) {
      roads.features.push({
        type: 'Feature',
        properties: {
          highway: el.tags.highway,
          name: el.tags.name || '',
          ref: el.tags.ref || '',
        },
        geometry: {
          type: 'LineString',
          coordinates: el.geometry.map((g) => [g.lon, g.lat]),
        },
      } as GeoJSON.Feature<GeoJSON.LineString, Record<string,string>>);
    } else if (el.type === 'node' && el.tags?.place && el.tags?.name) {
      places.features.push({
        type: 'Feature',
        properties: {
          place: el.tags.place,
          name: el.tags.name,
          population: el.tags.population ? Number(el.tags.population) : null,
        },
        geometry: { type: 'Point', coordinates: [el.lon, el.lat] },
      } as GeoJSON.Feature<GeoJSON.Point, Record<string,string|number|null>>);
    }
  }
  return { roads, places };
}

export async function fetchOverpassGeoJson(
  query: string,
  options?: {
    endpoints?: string[];
    cacheKey?: string;
    ttlMs?: number;
    timeoutMs?: number;
  }
): Promise<{ roads: GeoJSON.FeatureCollection; places: GeoJSON.FeatureCollection } | null> {
  const endpoints = options?.endpoints ?? DEFAULT_ENDPOINTS;
  const cacheKey = options?.cacheKey ?? 'overpass.cache.v1';
  const ttl = options?.ttlMs ?? DEFAULT_TTL;
  const timeoutMs = options?.timeoutMs ?? 30_000;

  // Try cache
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw) as { ts: number; data: { roads: GeoJSON.FeatureCollection; places: GeoJSON.FeatureCollection } };
      if (Date.now() - parsed.ts < ttl) return parsed.data;
    }
  } catch {
    // ignore cache errors
  }

  // Try endpoints with retry/backoff
  for (const endpoint of endpoints) {
    let attempt = 0;
    const maxAttempts = 3;
    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(endpoint, {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          signal: controller.signal,
        });
        clearTimeout(id);
        if (!res.ok) throw new Error(`status:${res.status}`);
        const json = (await res.json()) as OverpassResponse;
        const shaped = osmToGeoJson(json);
        try { localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: shaped })); } catch {}
        return shaped;
      } catch (_err) {
        // exponential backoff between attempts
        const backoff = 500 * 2 ** (attempt - 1);
        await sleep(backoff);
      }
    }
  }

  return null;
}
