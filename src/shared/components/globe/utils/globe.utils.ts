import * as THREE from "three"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js"
import type { BoundingBox, CountryPoint } from "./globe.constants"
import { AXIS_TILT_DEG, INDIA_FOCUS } from "./globe.constants"

export function latLonToVector(
	lat: number,
	lon: number,
	radius = 1,
): THREE.Vector3 {
	const phi = THREE.MathUtils.degToRad(90 - lat)
	const theta = THREE.MathUtils.degToRad(lon + 90)
	const spherical = new THREE.Spherical(radius, phi, theta)
	return new THREE.Vector3().setFromSpherical(spherical)
}

export function orientEarthTowardsIndia(pivot: THREE.Group) {
	const target = latLonToVector(INDIA_FOCUS.lat, INDIA_FOCUS.lon).normalize()
	const reference = new THREE.Vector3(0, 0, 1)
	const quaternion = new THREE.Quaternion().setFromUnitVectors(
		target,
		reference,
	)
	pivot.quaternion.copy(quaternion)
	pivot.rotateX(THREE.MathUtils.degToRad(AXIS_TILT_DEG))
}

export function ringArea(ring: CountryPoint[]): number {
	let area = 0
	for (let i = 0; i < ring.length; i += 1) {
		const p1 = ring[i]
		const p2 = ring[(i + 1) % ring.length]
		area += p1.lon * p2.lat - p2.lon * p1.lat
	}
	return Math.abs(area) * 0.5
}

export function computeCentroidVector(
	polygons: CountryPoint[][][],
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
		centroidVec.add(latLonToVector(p.lat, p.lon, 1))
	})
	if (centroidVec.lengthSq() === 0) return new THREE.Vector3(0, 0, radius)
	centroidVec.normalize().multiplyScalar(radius)
	return centroidVec
}

export function unwrapRing(ring: CountryPoint[]): CountryPoint[] {
	if (!ring.length) return ring
	const unwrapped = [{ ...ring[0] }]
	let lastLon = ring[0].lon
	for (let i = 1; i < ring.length; i += 1) {
		let lon = ring[i].lon
		const lat = ring[i].lat
		let diff = lon - lastLon
		if (diff > 180) lon -= 360
		else if (diff < -180) lon += 360
		diff = lon - lastLon
		if (diff > 180) lon -= 360
		if (diff < -180) lon += 360
		unwrapped.push({ lon, lat })
		lastLon = lon
	}
	const first = unwrapped[0]
	const last = unwrapped[unwrapped.length - 1]
	if (
		Math.abs(first.lon - last.lon) > 1e-6 ||
		Math.abs(first.lat - last.lat) > 1e-6
	) {
		unwrapped.push({ ...first })
	}
	return unwrapped
}

export function buildGreatCirclePoints(
	a: CountryPoint,
	b: CountryPoint,
	radius: number,
): THREE.Vector3[] {
	const v1 = latLonToVector(a.lat, a.lon, radius)
	const v2 = latLonToVector(b.lat, b.lon, radius)
	const angle = v1.angleTo(v2)
	const stepRad = THREE.MathUtils.degToRad(2)
	const steps = Math.max(1, Math.ceil(angle / stepRad))
	const points = []
	for (let i = 0; i <= steps; i += 1) {
		const t = i / steps
		const v = new THREE.Vector3()
			.lerpVectors(v1, v2, t)
			.normalize()
			.multiplyScalar(radius)
		points.push(v)
	}
	return points
}

export function ringContains(
	lon: number,
	lat: number,
	ring: CountryPoint[],
): boolean {
	let inside = false
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
		const xi = ring[i].lon
		const yi = ring[i].lat
		const xj = ring[j].lon
		const yj = ring[j].lat
		const intersect =
			yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
		if (intersect) inside = !inside
	}
	return inside
}

export function polygonContains(
	lon: number,
	lat: number,
	polygon: CountryPoint[][],
): boolean {
	const [outer, ...holes] = polygon
	if (!ringContains(lon, lat, outer)) return false
	for (const hole of holes) {
		if (ringContains(lon, lat, hole)) return false
	}
	return true
}

export function featureContains(
	lon: number,
	lat: number,
	polygons: CountryPoint[][][],
	bbox: BoundingBox | null,
): boolean {
	if (bbox) {
		if (
			lon < bbox.minLon ||
			lon > bbox.maxLon ||
			lat < bbox.minLat ||
			lat > bbox.maxLat
		)
			return false
	}
	return polygons.some((poly) => polygonContains(lon, lat, poly))
}

export function buildBorderGeometry(
	polygons: CountryPoint[][][],
	radius: number,
): THREE.BufferGeometry {
	const positions: number[] = []
	polygons.forEach((poly) => {
		poly.forEach((ring) => {
			const unwrapped = unwrapRing(ring)
			for (let i = 0; i < unwrapped.length - 1; i += 1) {
				const curr = unwrapped[i]
				const next = unwrapped[i + 1]
				const arcPoints = buildGreatCirclePoints(curr, next, radius)
				for (let p = 0; p < arcPoints.length - 1; p += 1) {
					const v1 = arcPoints[p]
					const v2 = arcPoints[p + 1]
					positions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z)
				}
			}
		})
	})
	const geometry = new THREE.BufferGeometry()
	geometry.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(positions, 3),
	)
	return geometry
}

export function buildFillGeometry(
	polygons: CountryPoint[][][],
	radius: number,
): THREE.BufferGeometry | null {
	const geometries: THREE.BufferGeometry[] = []
	const up = new THREE.Vector3(0, 1, 0)
	polygons.forEach((poly) => {
		const outerRing = unwrapRing(poly[0])
		const holeRings = poly.slice(1).map((r) => unwrapRing(r))
		const densifyRing = (ring: CountryPoint[]) => {
			const pts: THREE.Vector3[] = []
			for (let i = 0; i < ring.length - 1; i += 1) {
				const a = ring[i]
				const b = ring[i + 1]
				const arc = buildGreatCirclePoints(a, b, radius)
				if (i > 0 && arc.length > 0) {
					arc.shift()
				}
				pts.push(...arc)
			}
			return pts
		}
		const outerPts = densifyRing(outerRing)
		const holePts = holeRings.map((r) => densifyRing(r))

		if (outerPts.length < 3) return
		const basisNormal = computeCentroidVector([outerRing], 1).normalize()
		let tangent = new THREE.Vector3().crossVectors(basisNormal, up)
		if (tangent.lengthSq() < 1e-6) {
			tangent = new THREE.Vector3().crossVectors(
				basisNormal,
				new THREE.Vector3(1, 0, 0),
			)
		}
		tangent.normalize()
		const bitangent = new THREE.Vector3()
			.crossVectors(basisNormal, tangent)
			.normalize()

		const project2D = (vec3: THREE.Vector3) =>
			new THREE.Vector2(vec3.dot(tangent), vec3.dot(bitangent))
		const outer2D = outerPts.map(project2D)
		const holes2D = holePts.map((ring) => ring.map(project2D))
		const triangles = THREE.ShapeUtils.triangulateShape(outer2D, holes2D)

		const geom = new THREE.BufferGeometry()
		const remap: THREE.Vector3[] = []
		outerPts.forEach((p) => {
			remap.push(p)
		})
		holePts.forEach((ring) => {
			ring.forEach((p) => {
				remap.push(p)
			})
		})
		const vertices = remap
		const flatPositions = new Float32Array(vertices.length * 3)
		vertices.forEach((v, idx) => {
			flatPositions[idx * 3] = v.x
			flatPositions[idx * 3 + 1] = v.y
			flatPositions[idx * 3 + 2] = v.z
		})
		const triIndices: number[] = []
		const totalOuter = outerPts.length
		const holeSizes = holePts.map((r) => r.length)

		const resolveIndex = (idx: number) => {
			if (idx < totalOuter) return idx
			let offset = totalOuter
			for (let h = 0; h < holeSizes.length; h += 1) {
				const size = holeSizes[h]
				if (idx < offset + size) return idx
				offset += size
			}
			return idx
		}
		triangles.forEach((tri) => {
			const [a, b, c] = tri
			triIndices.push(resolveIndex(a), resolveIndex(b), resolveIndex(c))
		})
		geom.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(flatPositions, 3),
		)
		geom.setIndex(triIndices)
		geometries.push(geom)
	})

	if (!geometries.length) return null
	return BufferGeometryUtils.mergeGeometries(geometries, false)
}
