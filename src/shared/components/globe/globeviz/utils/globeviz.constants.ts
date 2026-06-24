import * as THREE from "three"

// ── Camera ──
export const CAMERA_FOV = 32
export const CAMERA_NEAR = 0.1
export const CAMERA_FAR = 2000
export const CAMERA_POS_X = 0
export const CAMERA_POS_Y = 0.08
export const CAMERA_POS_Z = 4.0

// ── Controls ──
export const CONTROLS_DAMPING_FACTOR = 0.06
export const CONTROLS_MIN_DISTANCE = 2.8
export const CONTROLS_MAX_DISTANCE = 10.0
export const CONTROLS_ROTATE_SPEED = 0.4
export const CONTROLS_ZOOM_SPEED = 0.6

// ── Globe geometry ──
export const GLOBE_RADIUS = 1.0
export const GLOBE_SEGMENTS = 128
export const CLOUD_RADIUS_SCALE = 1.006
export const ATM_RADIUS_SCALE = 1.01
export const BORDER_RADIUS_SCALE = 1.002
export const FILL_RADIUS_SCALE = 1.0015

// ── Globe material ──
export const GLOBE_COLOR = new THREE.Color(0x757575)
export const GLOBE_BUMP_SCALE = 0.008
export const GLOBE_ROUGHNESS = 0.9
export const GLOBE_METALNESS = 0.02
export const GLOBE_CLEARCOAT = 0.0
export const GLOBE_CLEARCOAT_ROUGHNESS = 0.8
export const GLOBE_EMISSIVE = new THREE.Color(0xffffff)
export const GLOBE_EMISSIVE_INTENSITY = 1.0

// ── Cloud material ──
export const CLOUD_TARGET_OPACITY = 0.36

// ── Atmosphere ──
export const ATM_COLOR = 0x1a2636
export const ATM_TARGET_OPACITY = 0.054

// ── Renderer ──
export const CLEAR_COLOR = 0x000000
export const TONE_MAPPING_EXPOSURE = 1.55
export const FOG_DENSITY = 0.012

// ── Lighting ──
export const HEMI_SKY_COLOR = 0xbfd1e5
export const HEMI_GROUND_COLOR = 0x030305
export const HEMI_INTENSITY = 0.12
export const SUN_COLOR = 0xfffbf4
export const SUN_INTENSITY = 1.35
export const SUN_POSITION = new THREE.Vector3(320, 180, -220)

// ── Stars ──
export const STAR_COUNT = 30000
export const STAR_ANCHOR_COUNT = 15
export const STAR_MIN_RADIUS = 120
export const STAR_RADIUS_RANGE = 160
export const STAR_ANCHOR_MIN_RADIUS = 140
export const STAR_ANCHOR_RADIUS_RANGE = 100

// ── Milky Way ──
export const MW_RADIUS = 400
export const MW_SEGMENTS = 64
export const MW_COLOR = new THREE.Color(0x808080)
export const MW_OPACITY = 0.04
export const MW_ROTATION_X = Math.PI / 6

// ── Border materials ──
export const BORDER_COLOR = 0x9bb0c8
export const BORDER_TARGET_OPACITY = 0.35
export const HOVER_BORDER_COLOR = 0x7fc8ff
export const SELECTED_BORDER_COLOR = 0xaee4ff
export const HIGHLIGHT_COLOR = 0x3a8fd6
export const HIGHLIGHT_MAX_OPACITY = 0.3

// ── India orientation ──
export const INDIA_LAT_DEG = 22.5
export const INDIA_LON_DEG = 78.9

// ── Animation ──
export const FADE_SPEED = 0.04
export const SELECTED_PULSE_SPEED = 8
export const BG_ROTATION_SPEED = 0.0018
export const CAMERA_LERP_FACTOR = 0.05
export const CAMERA_LERP_THRESHOLD = 0.01
export const FILL_FADE_STEP = 0.06
export const CLICK_DISTANCE_THRESHOLD = 5

// ── Texture paths ──
export const TEX_DAY = "/homepage-earth/earth-day-topo.jpg"
export const TEX_NIGHT = "/homepage-earth/earth-night.jpg"
export const TEX_BUMP = "/homepage-earth/earth-topology.png"
export const TEX_SPEC = "/homepage-earth/earth-water.png"
export const TEX_CLOUD = "/homepage-earth/earth-clouds.png"
export const TEX_MILKY_WAY = "/homepage-earth/8k_stars_milky_way.jpg"
export const GEOJSON_URL = "/homepage-earth/countries-110m.geojson"

// ── Shader sources ──
export const STAR_VERTEX_SHADER = `
  attribute float size;
  attribute float opacity;
  attribute float phase;
  varying float vOpacity;
  varying float vPhase;
  void main() {
    vOpacity = opacity;
    vPhase = phase;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
  }
`

export const STAR_FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform float fade;
  uniform float time;
  varying float vOpacity;
  varying float vPhase;
  void main() {
    // Circular star shape
    vec2 coord = gl_PointCoord - vec2(0.5);
    if (length(coord) > 0.5) discard;
    
    // Organic, time-based smooth starlight twinkling
    float twinkle = 1.0;
    if (vOpacity < 1.0) {
      twinkle = 0.7 + 0.3 * sin(time * 1.5 + vPhase);
    } else {
      twinkle = 0.95 + 0.05 * sin(time * 0.5 + vPhase); // Anchor stars are stable
    }
    
    gl_FragColor = vec4(color, vOpacity * fade * twinkle);
  }
`

// ── Country entry type ──
export interface GlobeVizCountryEntry {
	name: string
	type: string
	coordinates: number[][][] | number[][][][]
	fillMeshes: THREE.Mesh[]
	borderMeshes: THREE.Line[]
	centroid: THREE.Vector3
}
