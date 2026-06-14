// Centralized GIS coordinate / view configuration.

export const MAP_STYLE_URL =
	"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export const KUSHESHWAR_CENTER = [86.285, 25.796];

export const INITIAL_VIEW_STATE = {
	center: KUSHESHWAR_CENTER,
	zoom: 10.45,
	pitch: 58,
	bearing: -18,
};

export const MAP_MAX_BOUNDS = [
	[85.45, 25.55],
	[86.78, 26.62],
];

export const MAP_FIT_BOUNDS = [
	[85.88, 25.62],
	[86.6, 26.08],
];

export const MAP_ZOOM_LIMITS = {
	min: 8.8,
	max: 15.5,
};

export const SATELLITE_TILE_URL =
	"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export const FOCUS_EASE = {
	center: [86.27, 25.84],
	zoom: 10.33,
	duration: 900,
};
