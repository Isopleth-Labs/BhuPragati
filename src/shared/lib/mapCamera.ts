import type { LngLatBoundsLike, Map } from "maplibre-gl";
import { getRegion } from "@/data/regions";

export interface CameraOptions {
  durationMs?: number;
  zoom?: number;
  padding?: number | { top: number; right: number; bottom: number; left: number };
  bearing?: number;
  pitch?: number;
  animate?: boolean;
}

export interface FitBoundsOptions {
  durationMs?: number;
  padding?: number | { top: number; right: number; bottom: number; left: number };
  maxZoom?: number;
  animate?: boolean;
}

export interface RegionCameraTarget {
  centroid: { lon: number; lat: number };
  bbox: { north: number; south: number; east: number; west: number };
  defaultZoom: number;
}

export function getRegionCameraTarget(regionId: string): RegionCameraTarget | undefined {
  const region = getRegion(regionId);
  if (!region) return undefined;
  return {
    centroid: region.centroid,
    bbox: region.bbox,
    defaultZoom: region.defaultZoom,
  };
}

export function flyToRegion(
  map: Map,
  regionId: string,
  options: CameraOptions = {},
): void {
  const target = getRegionCameraTarget(regionId);
  if (!target) return;

  map.easeTo({
    center: [target.centroid.lon, target.centroid.lat],
    zoom: options.zoom ?? target.defaultZoom,
    duration: options.durationMs ?? 900,
    bearing: options.bearing ?? map.getBearing(),
    pitch: options.pitch ?? map.getPitch(),
    easing: (t) => t,
    animate: options.animate ?? true,
  });
}

export function fitRegionBounds(
  map: Map,
  regionId: string,
  options: FitBoundsOptions = {},
): void {
  const region = getRegion(regionId);
  console.log("[fitRegionBounds call]", regionId, region);
  if (!region) {
    console.error("[fitRegionBounds] region undefined", { regionId });
    return;
  }

  const target = getRegionCameraTarget(regionId);
  if (!target) {
    console.error("[fitRegionBounds] target missing", { regionId });
    return;
  }

  const bboxArr = [target.bbox.west, target.bbox.south, target.bbox.east, target.bbox.north];
  const centroidArr = [target.centroid.lon, target.centroid.lat];

  const bboxValid = Array.isArray(bboxArr) && bboxArr.length === 4 && bboxArr.every((v) => Number.isFinite(v));
  const centroidValid =
    Array.isArray(centroidArr) && centroidArr.length === 2 && centroidArr.every((v) => Number.isFinite(v));

  if (!bboxValid) {
    console.error("[fitRegionBounds] invalid bbox", region);
    return;
  }

  if (!centroidValid) {
    console.error("[fitRegionBounds] invalid centroid", region);
    return;
  }

  console.log("[fitRegionBounds final]", region.id, centroidArr, bboxArr);

  const bounds: LngLatBoundsLike = [
    [target.bbox.west, target.bbox.south],
    [target.bbox.east, target.bbox.north],
  ];

  console.log("[fitBounds args]", bounds);

  map.fitBounds(bounds, {
    duration: 0,
    padding: 8,
    maxZoom: options.maxZoom,
    animate: options.animate ?? true,
  });
}
