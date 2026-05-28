// Lazy registry for heavy GIS infrastructure overlays.
// Each entry is loaded on demand via dynamic import so the
// initial map bundle stays lightweight, leaving room for
// future WebGL-heavy layers and AI analytics modules.

export const heavyOverlayLoaders = {
  flood: () => import("./flood").then((m) => m.addFloodOverlay),
  road: () => import("./road").then((m) => m.addRoadOverlay),
  healthcare: () => import("./healthcare").then((m) => m.addHealthcareOverlay),
  agriculture: () => import("./agriculture").then((m) => m.addAgricultureOverlay),
  electricity: () => import("./electricity").then((m) => m.addElectricityOverlay),
};

export async function loadHeavyOverlays(map) {
  const entries = Object.entries(heavyOverlayLoaders);
  const adders = await Promise.all(entries.map(([, load]) => load()));
  adders.forEach((add) => add(map));
}
