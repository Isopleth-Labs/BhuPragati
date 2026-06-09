import { getRegion } from "@/data/regions";

const REGION_PARAM = "region";

function getUrl(): URL {
  return new URL(window.location.href);
}

export function getRegionFromUrl(): string | null {
  const url = getUrl();
  const regionId = url.searchParams.get(REGION_PARAM);
  if (!regionId) return null;
  return getRegion(regionId) ? regionId : null;
}

export function setRegionInUrl(regionId: string): void {
  const region = getRegion(regionId);
  if (!region) return;

  const url = getUrl();
  url.searchParams.set(REGION_PARAM, regionId);
  window.history.replaceState({}, "", url.toString());
}

export function clearRegionFromUrl(): void {
  const url = getUrl();
  url.searchParams.delete(REGION_PARAM);
  window.history.replaceState({}, "", url.toString());
}

export function syncStoreFromUrl(): string | null {
  return getRegionFromUrl();
}

export { REGION_PARAM };
