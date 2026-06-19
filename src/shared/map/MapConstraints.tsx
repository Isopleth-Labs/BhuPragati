import type maplibregl from "maplibre-gl"

export const INDIA_CENTER: [number, number] = [78.9629, 22.5937]

export const INDIA_BOUNDS: [number, number, number, number] = [
	68.1, 6.5, 97.4, 37.1,
]

export const INDIA_MAX_BOUNDS: maplibregl.LngLatBoundsLike = [
	[55.0, -2.0],
	[110.0, 45.0],
]

export const MAP_MIN_ZOOM = 3.0
export const MAP_MAX_ZOOM = 18

export type MapStyleType =
	| "dark"
	| "light"
	| "voyager"
	| "liberty"
	| "bright"
	| "fiord"
	| "stadia_dark"
	| "stadia_light"
	| "stadia_satellite"
// Map style JSON sheets from CartoDB
export const MAP_STYLE_URLS: Record<MapStyleType, string> = {
	dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
	light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
	voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
	liberty: "https://tiles.openfreemap.org/styles/liberty",
	bright: "https://tiles.openfreemap.org/styles/bright",
	fiord: "https://tiles.openfreemap.org/styles/fiord",
	stadia_dark: "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json",
	stadia_light: "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
	stadia_satellite:
		"https://tiles.stadiamaps.com/styles/alidade_satellite.json",
}

export const MAP_DEFAULT_STYLE: MapStyleType = "dark"
