// Centralized GIS coordinate / view configuration.

export const MAP_STYLE_URL =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export const INDIA_CENTER = [78.9629, 20.5937];

export const INITIAL_VIEW_STATE = {
  center: INDIA_CENTER,
  zoom: 4.5,
  pitch: 0,
  bearing: 0,
};

export const MAP_MAX_BOUNDS = [
  [60, 5],
  [105, 38],
];

export const MAP_FIT_BOUNDS = [
  [71, 6],
  [98, 37],
];

export const MAP_ZOOM_LIMITS = {
  min: 3,
  max: 14,
};

export const SATELLITE_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export const FOCUS_EASE = {
  center: INDIA_CENTER,
  zoom: 4.5,
  duration: 800,
};
