import type { Feature, FeatureCollection, Geometry } from "geojson";
import { addRegions, type Region } from "@/data/regions";
import { useRegionStore } from "@/shared/store/region";

let inflight: Promise<void> | null = null;
let loaded = false;
let cachedFeatures: FeatureCollection<Geometry> | null = null;

function normalizeRegion(feature: Feature<Geometry>): Region | null {
  const props = feature.properties as Record<string, unknown> | null;
  if (!props) return null;

  const id = typeof props.id === "string" ? props.id : undefined;
  const nameEn = typeof props.name_en === "string" ? props.name_en : undefined;
  const iso = typeof props.iso_code === "string" ? props.iso_code : undefined;
  const centroidArr = Array.isArray(props.centroid) ? props.centroid : undefined;
  const bboxArr = Array.isArray(props.bbox) ? props.bbox : undefined;

  if (!id || !nameEn || !iso || !centroidArr || !bboxArr) return null;

  const centroid = { lon: Number(centroidArr[0]), lat: Number(centroidArr[1]) };
  const bbox = {
    west: Number(bboxArr[0]),
    south: Number(bboxArr[1]),
    east: Number(bboxArr[2]),
    north: Number(bboxArr[3]),
  };

  const valid =
    Number.isFinite(centroid.lon) &&
    Number.isFinite(centroid.lat) &&
    Number.isFinite(bbox.west) &&
    Number.isFinite(bbox.south) &&
    Number.isFinite(bbox.east) &&
    Number.isFinite(bbox.north);
  if (!valid) {
    console.warn("[states] invalid numeric values", { id, centroid, bbox });
    return null;
  }

  return {
    id,
    slug: id,
    name: { en: nameEn },
    level: "state",
    parentId: "india",
    centroid,
    bbox,
    pinCodes: [],
    lgdCode: undefined,
    aliases: [],
    boundaryPath: undefined,
    defaultZoom: 6.5,
  };
}

export async function loadStatesRegistry(): Promise<void> {
  if (loaded) return;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const resp = await fetch("/geojson/india/states.geojson");
      if (!resp.ok) {
        console.error(`[states] failed to load: status ${resp.status}`);
        return;
      }
      console.info(`[states] fetch status=${resp.status}`);

      const parsed = (await resp.json()) as FeatureCollection<Geometry>;
      if (!Array.isArray(parsed.features)) {
        console.error("[states] invalid GeoJSON structure");
        return;
      }

      console.info(`[states] features loaded=${parsed.features.length}`);

      const features = parsed.features;
      if (features.length !== 36) {
        console.error(`[states] expected 36 features, got ${features.length}`);
        return;
      }

      const regions: Region[] = [];
      for (const feat of features) {
        const region = normalizeRegion(feat);
        if (region) {
          regions.push(region);
        }
      }

      if (regions.length !== 36) {
        console.error(`[states] normalized count mismatch: ${regions.length}`);
        return;
      }

      addRegions(regions);
      cachedFeatures = parsed;
      useRegionStore.getState().setRegistryReady(true);
      console.info("[states] registry ready");
      console.info("[states] count=36");
      regions.slice(0, 5).forEach((r) => {
        console.log("[states] sample", r.id, r.bbox, r.centroid);
      });
      loaded = true;
    } catch (err) {
      console.error("[states] failed to load registry", err);
    }
  })();

  return inflight;
}

export function getStatesFeatureCollection(): FeatureCollection<Geometry> | null {
  return cachedFeatures;
}

export function getStateFeatureById(id: string): Feature<Geometry> | null {
  if (!cachedFeatures) return null;
  const match = cachedFeatures.features.find((f) => (f.properties as Record<string, unknown> | null)?.id === id);
  return match ?? null;
}
