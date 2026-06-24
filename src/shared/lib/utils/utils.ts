// Lightweight helpers shared across map overlays.
import type { LayerSpecification, Map as MaplibreMap } from "maplibre-gl"

export function addSource(map: MaplibreMap, id: string, data: GeoJSON.GeoJSON) {
	if (map.getSource(id)) return
	map.addSource(id, { type: "geojson", data })
}

export function addLayer(
	map: MaplibreMap,
	layer: { id: string; [key: string]: unknown },
	beforeId?: string,
) {
	if (map.getLayer(layer.id)) return
	// `map.addLayer` expects the library's layer spec; cast once at the callsite.
	map.addLayer(layer as unknown as LayerSpecification, beforeId)
}

export function getFirstSymbolLayerId(map: MaplibreMap) {
	return map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id
}

export function getFitPadding(container: HTMLElement | null) {
	const width = container?.clientWidth ?? 1200

	if (width < 760) {
		return { top: 96, right: 24, bottom: 300, left: 24 }
	}
	if (width < 1120) {
		return { top: 104, right: 260, bottom: 230, left: 280 }
	}
	return { top: 92, right: 420, bottom: 210, left: 420 }
}

export function getPopupMarkup(
	properties: Partial<{
		title: string
		status: string
		metric: string
		note: string
	}>,
) {
	const title = properties.title ?? "Infrastructure Signal"
	const status = properties.status ?? "Observed"
	const metric = properties.metric ?? "GIS intelligence layer"
	const note =
		properties.note ?? "Layer details are available in the dashboard."

	return `
    <section class="w-[280px] p-3.5 text-left">
      <div class="mb-1.5 text-[0.76rem] font-bold text-[#ff7665] uppercase leading-none">${status}</div>
      <h3 class="m-0 mb-2 font-['Barlow_Condensed',Barlow,sans-serif] text-[1.45rem] font-bold leading-none text-white uppercase">${title}</h3>
      <p class="m-0 mb-2 text-[0.9rem] font-bold text-white leading-snug">${metric}</p>
      <p class="m-0 text-[0.9rem] text-[#e0ebff]/72 leading-[1.35]">${note}</p>
    </section>
  `
}
