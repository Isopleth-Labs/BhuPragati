// Lightweight helpers shared across map overlays.

import type { Map } from "maplibre-gl";

export function addSource(map : Map, id: string, data: any) {
  if (map.getSource(id)) return;
  map.addSource(id, { type: "geojson", data });
}

export function addLayer(map : Map, layer : any , beforeId?: string) {
  if (map.getLayer(layer.id)) return;
  map.addLayer(layer, beforeId);
}

export function getFirstSymbolLayerId(map : Map) {
  return map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id;
}

export function getFitPadding(container: HTMLElement | null) {
  const width = container?.clientWidth ?? 1200;

  if (width < 760) {
    return { top: 96, right: 24, bottom: 300, left: 24 };
  }
  if (width < 1120) {
    return { top: 104, right: 260, bottom: 230, left: 280 };
  }
  return { top: 92, right: 420, bottom: 210, left: 420 };
}

export function getPopupMarkup(properties: any) {
  const title = properties.title ?? "Infrastructure Signal";
  const status = properties.status ?? "Observed";
  const metric = properties.metric ?? "GIS intelligence layer";
  const note = properties.note ?? "Layer details are available in the dashboard.";

  return `
    <section class="map-popup">
      <div class="map-popup__eyebrow">${status}</div>
      <h3>${title}</h3>
      <p class="map-popup__metric">${metric}</p>
      <p>${note}</p>
    </section>
  `;
}
