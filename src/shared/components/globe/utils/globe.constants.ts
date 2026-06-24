import type * as THREE from "three"

export const EARTH_TEXTURE_URL = "/homepage-earth/earth-day.jpg"
export const EARTH_RADIUS = 1.35
export const STAR_COUNT = 2200
export const INDIA_FOCUS = { lat: 22.5, lon: 78.9 }
export const AXIS_TILT_DEG = 0
export const CAMERA_DISTANCE = EARTH_RADIUS * 4.0
export const CAMERA_LIFT = EARTH_RADIUS * 0.05
export const INDIA_Y_ADJUST = 0
export const COUNTRY_GEOJSON_URL = "/homepage-earth/countries-110m.geojson"
export const _INDIA_NAME = "India"
export const BORDER_OFFSET = 1.0012
export const LABEL_OFFSET = 1.01

// Zoom limits, inertia decay, damping, camera defaults, magic numbers
export const MIN_RADIUS = EARTH_RADIUS * 3.0
export const MAX_RADIUS = EARTH_RADIUS * 5.2
export const DAMPING = 0.92
export const POINTER_SENSITIVITY = 0.005
export const ZOOM_SENSITIVITY = 0.0012
export const PINCH_ZOOM_SENSITIVITY = 0.005
export const INERTIA_THRESHOLD = 0.00001
export const LINE_THRESHOLD = 0.02

// Light values
export const AMBIENT_LIGHT_COLOR = 0x141c2b
export const AMBIENT_LIGHT_INTENSITY = 0.6
export const SUN_LIGHT_COLOR = 0xffffff
export const SUN_LIGHT_INTENSITY = 2.1
export const SUN_LIGHT_POSITION = { x: 0, y: 3.7, z: 8.36 }

export interface CountryPoint {
	lat: number
	lon: number
}

export interface BoundingBox {
	minLon: number
	maxLon: number
	minLat: number
	maxLat: number
}

export interface CountryEntry {
	name: string
	polygons: CountryPoint[][][]
	bbox: BoundingBox
	line: THREE.LineSegments
	fill: THREE.Mesh | null
	centroidVec: THREE.Vector3
	centroidLat: number
	centroidLon: number
	featureIndex: number
	featureId: string | number | null
}
