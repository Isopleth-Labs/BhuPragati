import * as THREE from "three"

/**
 * Convert (lat, lon) in degrees to a THREE.Vector3 on a sphere of given radius.
 * Uses the GlobeViz convention: phi from +Y, theta mapped so texture aligns.
 */
export function latLonToVec3(
	lat: number,
	lon: number,
	r: number,
): THREE.Vector3 {
	const phi = (90 - lat) * (Math.PI / 180)
	const theta = (lon + 180) * (Math.PI / 180)
	return new THREE.Vector3(
		-r * Math.sin(phi) * Math.cos(theta),
		r * Math.cos(phi),
		r * Math.sin(phi) * Math.sin(theta),
	)
}

/**
 * Point-in-ring test using ray-casting algorithm.
 */
export function ringContains(
	lon: number,
	lat: number,
	ring: number[][],
): boolean {
	let inside = false
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i++) {
		const xi = ring[i][0],
			yi = ring[i][1]
		const xj = ring[j][0],
			yj = ring[j][1]
		const intersect =
			yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
		if (intersect) inside = !inside
	}
	return inside
}

/**
 * Point-in-polygon test (outer ring + holes).
 */
export function polygonContains(
	lon: number,
	lat: number,
	polygon: number[][][],
): boolean {
	const [outer, ...holes] = polygon
	if (!ringContains(lon, lat, outer)) return false
	for (const hole of holes) {
		if (ringContains(lon, lat, hole)) return false
	}
	return true
}

/**
 * Test whether a (lon, lat) point falls inside a GeoJSON feature's geometry.
 */
export function featureContains(
	lon: number,
	lat: number,
	coords: number[][][] | number[][][][],
	type: string,
): boolean {
	const polygons: number[][][][] =
		type === "Polygon"
			? [coords as number[][][]]
			: type === "MultiPolygon"
				? (coords as number[][][][])
				: []
	return polygons.some((poly) => polygonContains(lon, lat, poly))
}

/**
 * Compute area of a 2D ring (shoelace formula).
 */
export function ringArea(ring: number[][]): number {
	let area = 0
	for (let i = 0; i < ring.length; i++) {
		const p1 = ring[i]
		const p2 = ring[(i + 1) % ring.length]
		area += p1[0] * p2[1] - p2[0] * p1[1]
	}
	return Math.abs(area) * 0.5
}

/**
 * Compute a centroid unit vector from the largest polygon's outer ring.
 */
export function computeCentroidVector(
	polygons: number[][][][],
	toVec3: (lat: number, lon: number, r: number) => THREE.Vector3,
	radius: number,
): THREE.Vector3 {
	let bestRing = polygons?.[0]?.[0] ?? []
	let maxArea = -Infinity
	polygons.forEach((poly) => {
		const outer = poly[0]
		const area = ringArea(outer)
		if (area > maxArea) {
			maxArea = area
			bestRing = outer
		}
	})
	if (!bestRing.length) return new THREE.Vector3(0, 0, radius)
	const centroidVec = new THREE.Vector3()
	bestRing.forEach((p) => {
		centroidVec.add(toVec3(p[1], p[0], 1))
	})
	if (centroidVec.lengthSq() === 0) return new THREE.Vector3(0, 0, radius)
	return centroidVec.normalize()
}
