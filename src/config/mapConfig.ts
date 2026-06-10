// Centralized GIS coordinate / view configuration.

export const MAP_STYLE_URL =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export const INDIA_CENTER = [81.5, 21.2];

export const INITIAL_VIEW_STATE = {
  center: INDIA_CENTER,
  zoom: 4.0,
  pitch: 0,
  bearing: 0,
};

export const MAP_MAX_BOUNDS = [
  [60, 4],
  [105, 40],
];

export const MAP_FIT_BOUNDS = [
  [66.0, 5.0],
  [98.5, 37.5],
];

export const MAP_ZOOM_LIMITS = {
  min: 2.2,
  max: 14,
};

export const SATELLITE_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export const FOCUS_EASE = {
  center: INDIA_CENTER,
  zoom: 4.0,
  duration: 800,
};
