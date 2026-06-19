import { useEffect, useRef } from "react"
import * as THREE from "three"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js"

const EARTH_TEXTURE_URL = "/homepage-earth/earth-day.jpg"
const EARTH_RADIUS = 1.35
const STAR_COUNT = 2200
const INDIA_FOCUS = { lat: 22.5, lon: 78.9 }
const AXIS_TILT_DEG = 0
const CAMERA_DISTANCE = EARTH_RADIUS * 4.0
const CAMERA_LIFT = EARTH_RADIUS * 0.05
const INDIA_Y_ADJUST = 0
const COUNTRY_GEOJSON_URL = "/homepage-earth/countries-110m.geojson"
const _INDIA_NAME = "India"
const BORDER_OFFSET = 1.0012
const LABEL_OFFSET = 1.01
function latLonToVector(lat, lon, radius = 1) {
	// Align with THREE.SphereGeometry orientation (seam at -X, lon 0 at +Z)
	const phi = THREE.MathUtils.degToRad(90 - lat) // polar angle from +Y
	const theta = THREE.MathUtils.degToRad(lon + 90) // azimuth from +Z toward +X
	const spherical = new THREE.Spherical(radius, phi, theta)
	return new THREE.Vector3().setFromSpherical(spherical)
}

function orientEarthTowardsIndia(pivot) {
	const target = latLonToVector(INDIA_FOCUS.lat, INDIA_FOCUS.lon).normalize()
	const reference = new THREE.Vector3(0, 0, 1)
	const quaternion = new THREE.Quaternion().setFromUnitVectors(
		target,
		reference,
	)
	pivot.quaternion.copy(quaternion)
	pivot.rotateX(THREE.MathUtils.degToRad(AXIS_TILT_DEG))
}

function ringArea(ring) {
	let area = 0
	for (let i = 0; i < ring.length; i += 1) {
		const p1 = ring[i]
		const p2 = ring[(i + 1) % ring.length]
		area += p1.lon * p2.lat - p2.lon * p1.lat
	}
	return Math.abs(area) * 0.5
}

function computeCentroidVector(polygons, radius) {
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

function unwrapRing(ring) {
	if (!ring.length) return ring
	const unwrapped = [{ ...ring[0] }]
	let lastLon = ring[0].lon
	for (let i = 1; i < ring.length; i += 1) {
		let lon = ring[i].lon
		const lat = ring[i].lat
		let diff = lon - lastLon
		if (diff > 180) lon -= 360
		else if (diff < -180) lon += 360
		// Re-evaluate diff after adjustment to handle large jumps.
		diff = lon - lastLon
		if (diff > 180) lon -= 360
		if (diff < -180) lon += 360
		unwrapped.push({ lon, lat })
		lastLon = lon
	}
	// Ensure closed ring
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

function buildGreatCirclePoints(a, b, radius) {
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

function ringContains(lon, lat, ring) {
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

function polygonContains(lon, lat, polygon) {
	const [outer, ...holes] = polygon
	if (!ringContains(lon, lat, outer)) return false
	for (const hole of holes) {
		if (ringContains(lon, lat, hole)) return false
	}
	return true
}

function featureContains(lon, lat, polygons, bbox) {
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

function buildBorderGeometry(polygons, radius) {
	const positions = []
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

function buildFillGeometry(polygons, radius) {
	const geometries = []
	const up = new THREE.Vector3(0, 1, 0)
	polygons.forEach((poly) => {
		const outerRing = unwrapRing(poly[0])
		const holeRings = poly.slice(1).map((r) => unwrapRing(r))
		const densifyRing = (ring) => {
			const pts = []
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

		const project2D = (vec3) =>
			new THREE.Vector2(vec3.dot(tangent), vec3.dot(bitangent))
		const outer2D = outerPts.map(project2D)
		const holes2D = holePts.map((ring) => ring.map(project2D))
		const triangles = THREE.ShapeUtils.triangulateShape(outer2D, holes2D)

		const geom = new THREE.BufferGeometry()
		const positions = []
		const _pushRing = (ring) =>
			ring.forEach((v) => {
				positions.push(v.x, v.y, v.z)
			})
		const remap = []
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
		const triIndices = []
		const totalOuter = outerPts.length
		const _holeOffset = totalOuter
		const holeSizes = holePts.map((r) => r.length)
		const holeIndexStarts = [totalOuter]
		holeSizes.reduce((acc, size) => {
			holeIndexStarts.push(acc + size)
			return acc + size
		}, totalOuter)
		const resolveIndex = (idx) => {
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

function EarthViewer({ className, onReady }) {
	const containerRef = useRef(null)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return undefined

		const scene = new THREE.Scene()

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
		renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2))
		renderer.setSize(container.clientWidth, container.clientHeight)
		renderer.setClearColor(0x000000, 0)
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = 1.0
		renderer.outputColorSpace = THREE.SRGBColorSpace
		container.appendChild(renderer.domElement)

		const camera = new THREE.PerspectiveCamera(
			28,
			container.clientWidth / container.clientHeight,
			0.1,
			350,
		)
		const cameraTarget = new THREE.Vector3(0, 0, 0)
		camera.position.set(0, CAMERA_LIFT, CAMERA_DISTANCE)
		camera.lookAt(cameraTarget)

		const ambientLight = new THREE.AmbientLight(0x141c2b, 0.6)
		scene.add(ambientLight)

		const sunLight = new THREE.DirectionalLight(0xffffff, 2.1)
		sunLight.position.set(0, 3.7, 8.36)
		scene.add(sunLight)

		const earthRoot = new THREE.Group()
		earthRoot.name = "earthRoot"
		scene.add(earthRoot)
		const earthPivot = new THREE.Group()
		earthPivot.name = "earthPivot"
		earthRoot.add(earthPivot)
		const countryLinesGroup = new THREE.Group()
		countryLinesGroup.name = "countryLinesGroup"
		countryLinesGroup.renderOrder = 3
		earthPivot.add(countryLinesGroup)
		const countryFillsGroup = new THREE.Group()
		countryFillsGroup.name = "countryFillsGroup"
		countryFillsGroup.renderOrder = 2
		earthPivot.add(countryFillsGroup)
		countryLinesGroup.visible = false // TEMP: isolate globe lighting/texture
		countryFillsGroup.visible = false // TEMP: isolate globe lighting/texture
		console.warn(
			"[country-overlays] temporarily hidden (lines/fills) to debug globe lighting/texture",
		)

		const globeGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 160, 160)
		const globeMaterial = new THREE.MeshStandardMaterial({
			color: 0xf9fbff,
			roughness: 0.68,
			metalness: 0.03,
			emissive: 0x060c1a,
			emissiveIntensity: 0.25,
		})
		const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial)
		globeMesh.name = "globeMesh"
		let globeAdded = false

		console.log("[earth-geometry]", {
			uvCount: globeGeometry.attributes.uv?.count,
			positionCount: globeGeometry.attributes.position?.count,
		})

		// Add globe immediately so a lit sphere is visible even if texture load fails.
		earthPivot.add(globeMesh)
		globeAdded = true
		console.log("[earth-mesh] added base globeMesh", {
			globeAdded,
			materialHasMap: !!globeMaterial.map,
			visible: globeMesh.visible,
			meshRotation: {
				x: globeMesh.rotation.x,
				y: globeMesh.rotation.y,
				z: globeMesh.rotation.z,
			},
			pivotRotation: {
				x: earthPivot.rotation.x,
				y: earthPivot.rotation.y,
				z: earthPivot.rotation.z,
			},
			rootRotation: {
				x: earthRoot.rotation.x,
				y: earthRoot.rotation.y,
				z: earthRoot.rotation.z,
			},
		})

		orientEarthTowardsIndia(earthPivot)
		earthPivot.rotateY(Math.PI + INDIA_Y_ADJUST)
		earthPivot.rotateY(THREE.MathUtils.degToRad(8))
		earthPivot.rotateY(THREE.MathUtils.degToRad(4))

		const loader = new THREE.TextureLoader()
		loader.load(
			EARTH_TEXTURE_URL,
			(texture) => {
				texture.colorSpace = THREE.SRGBColorSpace
				texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
				globeMaterial.map = texture
				globeMaterial.needsUpdate = true
				console.log("[earth-texture] loaded", {
					globeAdded,
					mapPresent: !!globeMaterial.map,
					material: {
						color: globeMaterial.color.getHexString(),
						roughness: globeMaterial.roughness,
						metalness: globeMaterial.metalness,
						emissive: globeMaterial.emissive.getHexString(),
						emissiveIntensity: globeMaterial.emissiveIntensity,
						visible: globeMesh.visible,
					},
					anisotropy: texture.anisotropy,
					colorSpace: texture.colorSpace,
					wrapS: texture.wrapS,
					wrapT: texture.wrapT,
					repeat: { x: texture.repeat.x, y: texture.repeat.y },
					offset: { x: texture.offset.x, y: texture.offset.y },
					flipY: texture.flipY,
				})
			},
			undefined,
			(error) => {
				console.error("[EarthViewer] day texture failed to load", error)
			},
		)

		const starGeometry = new THREE.BufferGeometry()
		const starVertices = new Float32Array(STAR_COUNT * 3)
		for (let i = 0; i < STAR_COUNT; i += 1) {
			const radius = 45 + Math.random() * 35
			const theta = Math.random() * Math.PI * 2
			const phi = Math.acos(Math.random() * 2 - 1)
			const x = radius * Math.sin(phi) * Math.cos(theta)
			const y = radius * Math.cos(phi)
			const z = radius * Math.sin(phi) * Math.sin(theta)
			starVertices[i * 3] = x
			starVertices[i * 3 + 1] = y
			starVertices[i * 3 + 2] = z
		}
		starGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(starVertices, 3),
		)
		const starMaterial = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.05,
			transparent: true,
			opacity: 0.88,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		})
		const stars = new THREE.Points(starGeometry, starMaterial)
		scene.add(stars)

		const renderCallbacks = new Set()
		renderCallbacks.add(() => {
			/* Intentionally empty: reserved for diagnostics */
		})

		const countryEntries = []
		let countriesReady = false
		const borderMaterial = new THREE.LineBasicMaterial({
			color: 0x6f7b8c,
			transparent: true,
			opacity: 0.55,
			depthTest: true,
			depthWrite: true,
		})
		const hoverBorderMaterial = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 1,
			depthTest: true,
			depthWrite: true,
		})
		const selectedBorderMaterial = new THREE.LineBasicMaterial({
			color: 0xdbe7ff,
			transparent: true,
			opacity: 1,
			depthTest: true,
			depthWrite: true,
		})
		const fillMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.04,
			depthTest: true,
			depthWrite: false,
			side: THREE.FrontSide,
		})
		const hoverFillMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.12,
			depthTest: true,
			depthWrite: false,
			side: THREE.FrontSide,
		})
		const selectedFillMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.18,
			depthTest: true,
			depthWrite: false,
			side: THREE.FrontSide,
		})

		const formatQuat = (q) =>
			[q.x, q.y, q.z, q.w].map((v) => Number(v.toFixed(6)))
		const formatEulerDeg = (e) =>
			[e.x, e.y, e.z].map((rad) =>
				Number(THREE.MathUtils.radToDeg(rad).toFixed(3)),
			)
		const parentChain = (obj) => {
			const chain = []
			let current = obj
			while (current) {
				chain.push(current.name || current.type || current.uuid)
				current = current.parent
			}
			return chain
		}
		const logWorldTransform = (label, obj) => {
			if (!obj) return
			const quat = new THREE.Quaternion()
			obj.getWorldQuaternion(quat)
			const euler = new THREE.Euler().setFromQuaternion(quat, "XYZ")
			console.log("[world-transform]", label, {
				uuid: obj.uuid,
				type: obj.type,
				parentChain: parentChain(obj),
				worldQuaternion: formatQuat(quat),
				worldRotationDeg: formatEulerDeg(euler),
			})
		}
		const raycaster = new THREE.Raycaster()
		raycaster.params.Line = { threshold: 0.02 }
		const pointerNdc = new THREE.Vector2()
		let hoveredCountry = null
		let selectedCountry = null
		const tooltip = document.createElement("div")
		tooltip.style.position = "fixed"
		tooltip.style.pointerEvents = "none"
		tooltip.style.padding = "6px 10px"
		tooltip.style.borderRadius = "6px"
		tooltip.style.background = "rgba(18,25,38,0.85)"
		tooltip.style.color = "#e9eef7"
		tooltip.style.font = '600 12px "Segoe UI", sans-serif'
		tooltip.style.boxShadow = "0 4px 20px rgba(0,0,0,0.35)"
		tooltip.style.opacity = "0"
		tooltip.style.transition = "opacity 120ms ease"
		document.body.appendChild(tooltip)

		const setHoveredCountry = (entry) => {
			if (hoveredCountry === entry) return
			if (hoveredCountry) {
				hoveredCountry.line.material =
					hoveredCountry === selectedCountry
						? selectedBorderMaterial
						: borderMaterial
				hoveredCountry.fill.material =
					hoveredCountry === selectedCountry
						? selectedFillMaterial
						: fillMaterial
			}
			hoveredCountry = entry
			if (hoveredCountry) {
				hoveredCountry.line.material = hoverBorderMaterial
				hoveredCountry.fill.material =
					hoveredCountry === selectedCountry
						? selectedFillMaterial
						: hoverFillMaterial
			}
		}

		const setSelectedCountry = (entry) => {
			if (selectedCountry && selectedCountry !== hoveredCountry) {
				selectedCountry.line.material = borderMaterial
				selectedCountry.fill.material = fillMaterial
			}
			selectedCountry = entry
			if (selectedCountry) {
				selectedCountry.line.material = hoverBorderMaterial
				selectedCountry.fill.material = selectedFillMaterial
			}
		}

		const loadCountries = async () => {
			try {
				const response = await fetch(COUNTRY_GEOJSON_URL)
				if (!response.ok)
					throw new Error(`Failed to load countries: ${response.status}`)
				const data = await response.json()
				const features = data?.features ?? []
				features.forEach((feature, featureIndex) => {
					const name = feature?.properties?.name ?? "Unknown"
					const geom = feature?.geometry
					const coords =
						geom?.type === "Polygon"
							? [geom.coordinates]
							: geom?.type === "MultiPolygon"
								? geom.coordinates
								: []
					if (!coords.length) return
					const polygons = coords.map((poly) =>
						poly.map((ring) => ring.map(([lon, lat]) => ({ lon, lat }))),
					)
					let minLon = Infinity
					let maxLon = -Infinity
					let minLat = Infinity
					let maxLat = -Infinity
					polygons.forEach((poly) => {
						poly.forEach((ring) => {
							ring.forEach(({ lon, lat }) => {
								minLon = Math.min(minLon, lon)
								maxLon = Math.max(maxLon, lon)
								minLat = Math.min(minLat, lat)
								maxLat = Math.max(maxLat, lat)
							})
						})
					})
					const bbox = { minLon, maxLon, minLat, maxLat }
					const borderGeometry = buildBorderGeometry(
						polygons,
						EARTH_RADIUS * BORDER_OFFSET,
					)
					const fillGeometry = buildFillGeometry(
						polygons,
						EARTH_RADIUS * BORDER_OFFSET,
					)
					const isIndia = name === "India"
					const lineMaterial = isIndia
						? new THREE.LineBasicMaterial({
								color: 0xff3b3b,
								transparent: true,
								opacity: 0.9,
								depthTest: true,
								depthWrite: true,
							})
						: borderMaterial.clone()
					const line = new THREE.LineSegments(borderGeometry, lineMaterial)
					line.name = `border:${name}`
					line.renderOrder = 3
					countryLinesGroup.add(line)

					let fill = null
					if (fillGeometry) {
						const baseFillMaterial = fillMaterial.clone()
						if (isIndia) {
							baseFillMaterial.color = new THREE.Color(0xff3b3b)
							baseFillMaterial.opacity = 0.12
						}
						fill = new THREE.Mesh(fillGeometry, baseFillMaterial)
						fill.name = `fill:${name}`
						fill.renderOrder = 2
						countryFillsGroup.add(fill)
					}

					const centroidVec = computeCentroidVector(
						polygons,
						EARTH_RADIUS * LABEL_OFFSET,
					)
					const centroidLat = THREE.MathUtils.radToDeg(
						Math.asin(centroidVec.clone().normalize().y),
					)
					const centroidLon = THREE.MathUtils.radToDeg(
						Math.atan2(centroidVec.z, centroidVec.x),
					)

					const entry = {
						name,
						polygons,
						bbox,
						line,
						fill,
						centroidVec,
						centroidLat,
						centroidLon,
						featureIndex,
						featureId: feature?.id ?? null,
					}
					line.userData.countryEntry = entry
					if (fill) fill.userData.countryEntry = entry
					countryEntries.push(entry)

					if (name === "India" || name === "Malaysia") {
						console.log("[country-debug]", name, {
							featureId: feature?.id ?? null,
							featureIndex,
							polygonCount: polygons.length,
							centroidLat,
							centroidLon,
							lineUuid: line.uuid,
							fillUuid: fill?.uuid ?? null,
							fillVisible: countryFillsGroup.visible,
							fillMaterialColor: fill?.material?.color?.getHexString?.(),
							fillOpacity: fill?.material?.opacity,
							fillTransparent: fill?.material?.transparent,
							fillRenderOrder: fill?.renderOrder,
							fillDepthTest: fill?.material?.depthTest,
							fillDepthWrite: fill?.material?.depthWrite,
						})
					}
				})
				countriesReady = true
				console.log("[country-debug] load complete", {
					featureCount: features.length,
					entries: countryEntries.length,
					borderMeshes: countryLinesGroup.children.length,
					fillMeshes: countryFillsGroup.children.length,
				})
			} catch (error) {
				console.warn("[EarthViewer] country data load failed", error)
			}
		}

		loadCountries()

		let transformDiagnosticsLogged = false
		const tryLogTransforms = () => {
			if (transformDiagnosticsLogged) return
			if (!countriesReady || !globeAdded) return
			scene.updateMatrixWorld(true)
			logWorldTransform("earth.globeMesh", globeMesh)
			logWorldTransform("earth.earthPivot", earthPivot)
			logWorldTransform("earth.earthRoot", earthRoot)
			countryEntries.forEach((entry) => {
				logWorldTransform(`country.border.${entry.name}`, entry.line)
				logWorldTransform(`country.fill.${entry.name}`, entry.fill)
			})
			transformDiagnosticsLogged = true
			renderCallbacks.delete(tryLogTransforms)
		}
		renderCallbacks.add(tryLogTransforms)

		const tooltipState = { visible: false, text: "", screenPos: null }

		const showTooltipAtScreenPos = (text, screenPos) => {
			tooltipState.visible = true
			tooltipState.text = text
			tooltipState.screenPos = screenPos
			tooltip.textContent = text
			tooltip.style.opacity = "1"
		}

		const hideTooltip = () => {
			tooltipState.visible = false
			tooltip.style.opacity = "0"
		}

		const spherical = new THREE.Spherical()
		const rotateState = {
			isDragging: false,
			lastX: 0,
			lastY: 0,
			inertiaX: 0,
			inertiaY: 0,
		}
		const damping = 0.92
		const minRadius = EARTH_RADIUS * 3.0
		const maxRadius = EARTH_RADIUS * 5.2
		spherical.set(
			camera.position.length(),
			Math.acos(camera.position.y / camera.position.length()),
			Math.atan2(camera.position.x, camera.position.z),
		)

		const applyCameraPosition = () => {
			spherical.radius = THREE.MathUtils.clamp(
				spherical.radius,
				minRadius,
				maxRadius,
			)
			spherical.phi = THREE.MathUtils.clamp(spherical.phi, 0.25, Math.PI - 0.22)
			const newPos = new THREE.Vector3().setFromSpherical(spherical)
			camera.position.copy(newPos)
			camera.lookAt(cameraTarget)
		}
		applyCameraPosition()

		const onPointerDown = (event) => {
			rotateState.isDragging = true
			rotateState.lastX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
			rotateState.lastY = event.clientY ?? event.touches?.[0]?.clientY ?? 0
		}

		const updateVisibility = () => {
			if (!countriesReady) return
			const camDir = camera.position.clone().normalize()
			countryEntries.forEach((entry) => {
				const centroidDir = entry.centroidVec.clone().normalize()
				const facing = centroidDir.dot(camDir) > 0.0
				const visible = facing
				if (entry.line) entry.line.visible = visible
				if (entry.fill) entry.fill.visible = visible
			})
		}
		renderCallbacks.add(updateVisibility)

		const _lastHoverName = null

		const handleHover = (event) => {
			if (!countriesReady) return
			const clientX = event.clientX ?? event.touches?.[0]?.clientX
			const clientY = event.clientY ?? event.touches?.[0]?.clientY
			if (clientX == null || clientY == null) return
			const rect = renderer.domElement.getBoundingClientRect()
			pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1
			pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1
			raycaster.setFromCamera(pointerNdc, camera)
			const hit = raycaster.intersectObject(globeMesh, true)[0]
			if (!hit) {
				setHoveredCountry(null)
				hideTooltip()
				container.style.cursor = "grab"
				return
			}
			if (hit.object) {
				console.log("[country-raycast]", {
					uuid: hit.object.uuid,
					userData: hit.object.userData,
				})
			}
			const point = hit.point.clone().normalize()
			const latDeg = THREE.MathUtils.radToDeg(Math.asin(point.y))
			const lonDeg = THREE.MathUtils.radToDeg(Math.atan2(point.z, point.x))
			let found = null
			for (const entry of countryEntries) {
				if (featureContains(lonDeg, latDeg, entry.polygons, entry.bbox)) {
					found = entry
					break
				}
			}
			setHoveredCountry(found)
			if (found) {
				container.style.cursor = "pointer"
			} else {
				hideTooltip()
				container.style.cursor = "grab"
			}
		}

		const onPointerMove = (event) => {
			handleHover(event)
			if (!rotateState.isDragging) return
			const currentX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
			const currentY = event.clientY ?? event.touches?.[0]?.clientY ?? 0
			const deltaX = (currentX - rotateState.lastX) * 0.005
			const deltaY = (currentY - rotateState.lastY) * 0.005
			spherical.theta -= deltaX
			spherical.phi -= deltaY
			rotateState.inertiaX = deltaX
			rotateState.inertiaY = deltaY
			rotateState.lastX = currentX
			rotateState.lastY = currentY
			applyCameraPosition()
		}

		const onPointerUp = () => {
			rotateState.isDragging = false
		}

		const onWheel = (event) => {
			event.preventDefault()
			spherical.radius += event.deltaY * 0.0012 * spherical.radius
			applyCameraPosition()
		}

		const onTouchMove = (event) => {
			if (event.touches.length === 1) {
				onPointerMove(event)
				return
			}
			if (event.touches.length === 2) {
				event.preventDefault()
				const [a, b] = event.touches
				const dx = a.clientX - b.clientX
				const dy = a.clientY - b.clientY
				const distance = Math.sqrt(dx * dx + dy * dy)
				if (onTouchMove.lastDistance) {
					const delta = distance - onTouchMove.lastDistance
					spherical.radius -= delta * 0.005
					applyCameraPosition()
				}
				onTouchMove.lastDistance = distance
			}
		}

		const onTouchEnd = () => {
			onTouchMove.lastDistance = undefined
			onPointerUp()
		}

		const onClick = (_event) => {
			if (!hoveredCountry) {
				setSelectedCountry(null)
				hideTooltip()
				return
			}
			setSelectedCountry(hoveredCountry)
			console.log("[country-click]", {
				clickedName: hoveredCountry.name,
				featureIndex: hoveredCountry.featureIndex,
				featureId: hoveredCountry.featureId,
				polygonCount: hoveredCountry.polygons.length,
				borderUUID: hoveredCountry.line?.uuid,
				fillUUID: hoveredCountry.fill?.uuid,
			})
			const targetDir = hoveredCountry.centroidVec.clone().normalize()
			const cameraDist = camera.position.length()
			const newCamPos = targetDir.clone().multiplyScalar(cameraDist)
			camera.position.copy(newCamPos)
			camera.lookAt(cameraTarget)
		}

		const updateSelectedLabel = () => {
			if (!selectedCountry) {
				hideTooltip()
				return
			}
			const camDir = camera.position.clone().normalize()
			const centroidDir = selectedCountry.centroidVec.clone().normalize()
			const facing = centroidDir.dot(camDir) > 0.0
			if (!facing) {
				hideTooltip()
				return
			}
			const worldPos = centroidDir
				.clone()
				.multiplyScalar(EARTH_RADIUS * LABEL_OFFSET)
			const projected = worldPos.project(camera)
			const rect = renderer.domElement.getBoundingClientRect()
			const x = (projected.x * 0.5 + 0.5) * rect.width + rect.left
			const y = (-projected.y * 0.5 + 0.5) * rect.height + rect.top
			showTooltipAtScreenPos(selectedCountry.name, { x, y })
			tooltip.style.left = `${x + 10}px`
			tooltip.style.top = `${y + 10}px`
		}
		renderCallbacks.add(updateSelectedLabel)

		let animationFrame = 0
		const renderLoop = () => {
			animationFrame = requestAnimationFrame(renderLoop)
			if (!rotateState.isDragging) {
				spherical.theta -= rotateState.inertiaX
				spherical.phi -= rotateState.inertiaY
				rotateState.inertiaX *= damping
				rotateState.inertiaY *= damping
				if (
					Math.abs(rotateState.inertiaX) > 0.00001 ||
					Math.abs(rotateState.inertiaY) > 0.00001
				) {
					applyCameraPosition()
				}
			}
			renderCallbacks.forEach((cb) => {
				cb()
			})
			renderer.render(scene, camera)
		}
		renderLoop()

		const handleResize = () => {
			if (!containerRef.current) return
			const { clientWidth, clientHeight } = containerRef.current
			renderer.setSize(clientWidth, clientHeight)
			camera.aspect = clientWidth / clientHeight
			camera.updateProjectionMatrix()
		}

		window.addEventListener("resize", handleResize)
		container.addEventListener("mousedown", onPointerDown)
		container.addEventListener("mousemove", onPointerMove)
		container.addEventListener("mouseup", onPointerUp)
		container.addEventListener("mouseleave", onPointerUp)
		container.addEventListener("wheel", onWheel, { passive: false })
		container.addEventListener("touchstart", onPointerDown, { passive: true })
		container.addEventListener("touchmove", onTouchMove, { passive: false })
		container.addEventListener("touchend", onTouchEnd)
		container.addEventListener("touchcancel", onTouchEnd)
		container.addEventListener("click", onClick)

		const engine = {
			scene,
			camera,
			renderer,
			earthRoot,
			addRenderCallback: (cb) => {
				renderCallbacks.add(cb)
				return () => renderCallbacks.delete(cb)
			},
		}
		onReady?.(engine)

		return () => {
			cancelAnimationFrame(animationFrame)
			window.removeEventListener("resize", handleResize)
			container.removeEventListener("mousedown", onPointerDown)
			container.removeEventListener("mousemove", onPointerMove)
			container.removeEventListener("mouseup", onPointerUp)
			container.removeEventListener("mouseleave", onPointerUp)
			container.removeEventListener("wheel", onWheel)
			container.removeEventListener("touchstart", onPointerDown)
			container.removeEventListener("touchmove", onTouchMove)
			container.removeEventListener("touchend", onTouchEnd)
			container.removeEventListener("touchcancel", onTouchEnd)
			container.removeEventListener("click", onClick)
			renderCallbacks.clear()
			countryEntries.forEach((entry) => {
				entry.line.geometry.dispose()
				entry.line.material.dispose()
				entry.fill?.geometry.dispose()
				entry.fill?.material.dispose()
			})
			borderMaterial.dispose()
			hoverBorderMaterial.dispose()
			selectedBorderMaterial.dispose()
			fillMaterial.dispose()
			hoverFillMaterial.dispose()
			selectedFillMaterial.dispose()
			document.body.removeChild(tooltip)
			globeGeometry.dispose()
			globeMaterial.map?.dispose()
			globeMaterial.dispose()
			starGeometry.dispose()
			starMaterial.dispose()
			renderer.dispose()
			if (renderer.domElement.parentNode) {
				renderer.domElement.parentNode.removeChild(renderer.domElement)
			}
		}
	}, [onReady])

	return (
		<div
			className={className}
			ref={containerRef}
			style={{ width: "100%", height: "100%" }}
		/>
	)
}

export default EarthViewer
