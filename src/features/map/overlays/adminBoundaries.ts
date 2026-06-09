import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { getRegion } from "@/data/regions";
import { addLayer, addSource, getFirstSymbolLayerId } from "@/shared";

const BOUNDARY_SOURCE_ID = "region-boundary";
const BOUNDARY_FILL_LAYER_ID = "region-boundary-fill";
const BOUNDARY_OUTLINE_LAYER_ID = "region-boundary-outline";

const boundaryCache = new Map<string, FeatureCollection<Geometry>>();
const inflightRequests = new Map<string, Promise<FeatureCollection<Geometry> | null>>();

function normalizeBoundaryGeoJson(raw: unknown, regionId: string): FeatureCollection<Geometry> {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid boundary GeoJSON");
  }

  const withRegionId = (feature: Feature<Geometry>): Feature<Geometry> => ({
    ...feature,
    properties: {
      ...(feature.properties ?? {}),
      regionId,
    },
  });

  const typed = raw as { type?: string; features?: Feature<Geometry>[] };

  if (typed.type === "FeatureCollection" && Array.isArray(typed.features)) {
    return {
      type: "FeatureCollection",
      features: typed.features.map(withRegionId),
    };
  }

  if ((raw as Feature<Geometry>).type === "Feature") {
    return {
      type: "FeatureCollection",
      features: [withRegionId(raw as Feature<Geometry>)],
    };
  }

  throw new Error("Unsupported GeoJSON type for boundary");
}

export function addBoundarySource(map: MapLibreMap): void {
  addSource(map, BOUNDARY_SOURCE_ID, { type: "FeatureCollection", features: [] });
}

export function addBoundaryLayers(map: MapLibreMap): void {
  addBoundarySource(map);
  const beforeId = getFirstSymbolLayerId(map);

  addLayer(
    map,
    {
      id: BOUNDARY_FILL_LAYER_ID,
      type: "fill",
      source: BOUNDARY_SOURCE_ID,
      paint: {
        "fill-color": "#3a9ad9",
        "fill-opacity": 0.08,
      },
    },
    beforeId,
  );

  addLayer(
    map,
    {
      id: BOUNDARY_OUTLINE_LAYER_ID,
      type: "line",
      source: BOUNDARY_SOURCE_ID,
      paint: {
        "line-color": "#4aa3ff",
        "line-width": 1.4,
        "line-opacity": 0.6,
      },
    },
    beforeId,
  );
}

export function updateBoundaryFilter(map: MapLibreMap, regionId: string | null): void {
  const target = regionId ?? "__none__";

  if (map.getLayer(BOUNDARY_FILL_LAYER_ID)) {
    map.setFilter(BOUNDARY_FILL_LAYER_ID, ["==", ["get", "regionId"], target]);
  }

  if (map.getLayer(BOUNDARY_OUTLINE_LAYER_ID)) {
    map.setFilter(BOUNDARY_OUTLINE_LAYER_ID, ["==", ["get", "regionId"], target]);
  }
}

export async function loadRegionBoundary(
  map: MapLibreMap,
  regionId: string,
): Promise<FeatureCollection<Geometry> | null> {
  const region = getRegion(regionId);
  if (!region) {
    console.warn(`[boundary] region missing: ${regionId}`);
    return null;
  }

  if (!region.boundaryPath) {
    console.info(`[boundary] missing boundary for ${regionId}`);
    return null;
  }

  addBoundarySource(map);
  const source = map.getSource(BOUNDARY_SOURCE_ID) as GeoJSONSource | undefined;
  if (!source) {
    console.warn(`[boundary] source unavailable for ${regionId}`);
    return null;
  }

  const cached = boundaryCache.get(regionId);
  if (cached) {
    source.setData(cached);
    console.info(`[boundary] cached ${regionId}`);
    return cached;
  }

  const inflight = inflightRequests.get(regionId);
  if (inflight) {
    const data = await inflight;
    if (data) {
      source.setData(data);
      console.info(`[boundary] cached (inflight) ${regionId}`);
      return data;
    }
    return null;
  }

  const request = fetch(region.boundaryPath)
    .then(async (resp) => {
      if (!resp.ok) {
        console.info(`[region] boundary missing for ${regionId} (status ${resp.status})`);
        return null;
      }
      const text = await resp.text();
      try {
        const parsed = JSON.parse(text);
        return normalizeBoundaryGeoJson(parsed, regionId);
      } catch (err) {
        console.info(`[region] boundary missing for ${regionId} (invalid JSON)`);
        return null;
      }
    });

  inflightRequests.set(regionId, request);

  try {
    const data = await request;
    if (!data) {
      return null;
    }
    boundaryCache.set(regionId, data);
    source.setData(data);
    console.info(`[boundary] loaded ${regionId}`);
    return data;
  } catch (err) {
    console.warn(`[boundary] failed to load ${regionId}`, err);
    return null;
  } finally {
    inflightRequests.delete(regionId);
  }
}
