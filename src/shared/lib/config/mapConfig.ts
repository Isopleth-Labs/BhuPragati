// Centralized GIS coordinate / view configuration.

export const MAP_STYLE_URL =
	"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

export const KUSHESHWAR_CENTER = [86.285, 25.796]

export const INITIAL_VIEW_STATE = {
	center: KUSHESHWAR_CENTER,
	zoom: 10.45,
	pitch: 58,
	bearing: -18,
}

export const MAP_MAX_BOUNDS = [
	[85.45, 25.55],
	[86.78, 26.62],
]

export const MAP_FIT_BOUNDS = [
	[85.88, 25.62],
	[86.6, 26.08],
]

export const MAP_ZOOM_LIMITS = {
	min: 8.8,
	max: 15.5,
}

export const SATELLITE_TILE_URL =
	"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

export const FOCUS_EASE = {
	center: [86.27, 25.84],
	zoom: 10.33,
	duration: 900,
}

// ── India-level view constants (used by /state-map only) ─────────────────────
export const INDIA_CENTER = [81.5, 21.2] as [number, number]

export const INDIA_INITIAL_VIEW_STATE = {
	center: INDIA_CENTER,
	zoom: 4.0,
	pitch: 0,
	bearing: 0,
}

export const INDIA_FIT_BOUNDS = [
	[66.0, 5.0],
	[98.5, 37.5],
] as [[number, number], [number, number]]

export const INDIA_MAX_BOUNDS = [
	[60.0, 4.0],
	[105.0, 40.0],
] as [[number, number], [number, number]]

export const INDIA_ZOOM_LIMITS = {
	min: 2.2,
	max: 14,
}

// ── Bihar district-level view constants (used by /map DashboardShell) ────────
export const BIHAR_INITIAL_VIEW_STATE = {
	center: [85.3131, 25.0961] as [number, number],
	zoom: 7,
	pitch: 0,
	bearing: 0,
}

export const BIHAR_MAX_BOUNDS = [
	[82.5, 23.5],
	[89.5, 28.5],
] as [[number, number], [number, number]]

export const BIHAR_ZOOM_LIMITS = {
	min: 6.5,
	max: 15.5,
}
