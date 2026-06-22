import * as THREE from "three"

/**
 * Unwrap a GeoJSON coordinate ring to prevent antimeridian crossing artifacts.
 */
export function unwrapRing(ring: number[][]): number[][] {
	if (!ring.length) return ring
	const unwrapped: number[][] = [[ring[0][0], ring[0][1]]]
	let lastLon = ring[0][0]
	for (let i = 1; i < ring.length; i++) {
		let lon = ring[i][0]
		const lat = ring[i][1]
		let diff = lon - lastLon
		if (diff > 180) lon -= 360
		else if (diff < -180) lon += 360
		diff = lon - lastLon
		if (diff > 180) lon -= 360
		if (diff < -180) lon += 360
		unwrapped.push([lon, lat])
		lastLon = lon
	}
	const first = unwrapped[0]
	const last = unwrapped[unwrapped.length - 1]
	if (
		Math.abs(first[0] - last[0]) > 1e-6 ||
		Math.abs(first[1] - last[1]) > 1e-6
	) {
		unwrapped.push([...first])
	}
	return unwrapped
}

/**
 * Build great-circle interpolation points between two coordinate pairs.
 */
export function buildGreatCirclePoints(
	a: number[],
	b: number[],
	toVec3: (lat: number, lon: number, r: number) => THREE.Vector3,
	radius: number,
): THREE.Vector3[] {
	const v1 = toVec3(a[1], a[0], radius)
	const v2 = toVec3(b[1], b[0], radius)
	const angle = v1.angleTo(v2)
	const stepRad = THREE.MathUtils.degToRad(2)
	const steps = Math.max(1, Math.ceil(angle / stepRad))
	const points: THREE.Vector3[] = []
	for (let i = 0; i <= steps; i++) {
		const t = i / steps
		const v = new THREE.Vector3()
			.lerpVectors(v1, v2, t)
			.normalize()
			.multiplyScalar(radius)
		points.push(v)
	}
	return points
}

/**
 * Build triangulated fill geometry for a country (EarthViewer pipeline).
 */
export function buildCountryFill(
	coordinates: number[][][] | number[][][][],
	type: string,
	toVec3: (lat: number, lon: number, r: number) => THREE.Vector3,
	radius: number,
	computeCentroidVectorFn: (
		polygons: number[][][][],
		toVec3: (lat: number, lon: number, r: number) => THREE.Vector3,
		radius: number,
	) => THREE.Vector3,
): THREE.BufferGeometry[] {
	const polygons: number[][][][] =
		type === "Polygon"
			? [coordinates as number[][][]]
			: type === "MultiPolygon"
				? (coordinates as number[][][][])
				: []
	const geometries: THREE.BufferGeometry[] = []
	const up = new THREE.Vector3(0, 1, 0)

	polygons.forEach((poly) => {
		const outerRing = unwrapRing(poly[0])
		const holeRings = poly.slice(1).map((r) => unwrapRing(r))

		const densifyRing = (ring: number[][]): THREE.Vector3[] => {
			const pts: THREE.Vector3[] = []
			for (let i = 0; i < ring.length - 1; i++) {
				const a = ring[i]
				const b = ring[i + 1]
				const arc = buildGreatCirclePoints(a, b, toVec3, radius)
				if (i > 0 && arc.length > 0) arc.shift()
				pts.push(...arc)
			}
			return pts
		}

		const outerPts = densifyRing(outerRing)
		const holePts = holeRings.map((r) => densifyRing(r))

		if (outerPts.length < 3) return

		const basisNormal = computeCentroidVectorFn([poly], toVec3, 1)
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

		try {
			const triangles = THREE.ShapeUtils.triangulateShape(outer2D, holes2D)
			if (!triangles.length) return

			const geom = new THREE.BufferGeometry()
			const vertices = [...outerPts]
			holePts.forEach((ring) => {
				vertices.push(...ring)
			})

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
				for (let h = 0; h < holeSizes.length; h++) {
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
			geom.computeVertexNormals()
			geometries.push(geom)
		} catch (_e) {
			// skip invalid triangulation
		}
	})

	return geometries
}
