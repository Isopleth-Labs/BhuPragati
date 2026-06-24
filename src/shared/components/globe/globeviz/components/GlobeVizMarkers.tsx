import { useEffect } from "react"
import * as THREE from "three"
import type { GlobeVizCountryEntry } from "../utils/globeviz.constants"
import {
	BORDER_COLOR,
	BORDER_RADIUS_SCALE,
	FILL_RADIUS_SCALE,
	GEOJSON_URL,
	GLOBE_RADIUS,
	HIGHLIGHT_COLOR,
	HOVER_BORDER_COLOR,
	SELECTED_BORDER_COLOR,
} from "../utils/globeviz.constants"
import { buildCountryFill } from "../utils/globeviz.geometry"
import { computeCentroidVector, latLonToVec3 } from "../utils/globeviz.math"

interface GlobeVizMarkersProps {
	scene: THREE.Scene
	globeGroup: THREE.Group
	onCountriesLoaded: (entries: GlobeVizCountryEntry[]) => void
	onGeoJsonLoaded: () => void
	onMaterialsReady: (mats: {
		borderMat: THREE.LineBasicMaterial
		hoverBorderMat: THREE.LineBasicMaterial
		selectedBorderMat: THREE.LineBasicMaterial
		highlightMat: THREE.MeshBasicMaterial
	}) => void
}

export function GlobeVizMarkers({
	scene,
	globeGroup,
	onCountriesLoaded,
	onGeoJsonLoaded,
	onMaterialsReady,
}: GlobeVizMarkersProps) {
	useEffect(() => {
		// ── Border materials ──
		const borderMat = new THREE.LineBasicMaterial({
			color: BORDER_COLOR,
			transparent: true,
			opacity: 0.0,
			depthTest: true,
		})

		const hoverBorderMat = new THREE.LineBasicMaterial({
			color: HOVER_BORDER_COLOR,
			transparent: true,
			opacity: 1.0,
			depthTest: true,
		})

		const selectedBorderMat = new THREE.LineBasicMaterial({
			color: SELECTED_BORDER_COLOR,
			transparent: true,
			opacity: 1.0,
			depthTest: true,
		})

		const highlightMat = new THREE.MeshBasicMaterial({
			color: HIGHLIGHT_COLOR,
			transparent: true,
			opacity: 0.0,
			side: THREE.DoubleSide,
			depthWrite: false,
		})

		onMaterialsReady({
			borderMat,
			hoverBorderMat,
			selectedBorderMat,
			highlightMat,
		})

		// ── Groups ──
		const borderLines = new THREE.Group()
		borderLines.visible = true
		scene.add(borderLines)

		const fillGroup = new THREE.Group()
		fillGroup.visible = true
		scene.add(fillGroup)

		// ── GeoJSON load ──
		const countryEntries: GlobeVizCountryEntry[] = []

		fetch(GEOJSON_URL)
			.then((r) => r.json())
			.then((data) => {
				data.features.forEach(
					(feature: {
						properties?: { name?: string }
						geometry: {
							type: string
							coordinates: number[][][] | number[][][][]
						}
					}) => {
						const name = feature.properties?.name ?? "Unknown"
						const geom = feature.geometry
						const rings =
							geom.type === "Polygon"
								? geom.coordinates
								: geom.type === "MultiPolygon"
									? (geom.coordinates as unknown as number[][][][]).flat(1)
									: []

						// Build border lines
						const borderMeshes: THREE.Line[] = []
						;(rings as number[][][]).forEach((ring) => {
							const pts = ring.map(([lon, lat]: number[]) =>
								latLonToVec3(lat, lon, GLOBE_RADIUS * BORDER_RADIUS_SCALE),
							)
							const geo = new THREE.BufferGeometry().setFromPoints(pts)
							const mesh = new THREE.Line(geo, borderMat)
							borderLines.add(mesh)
							borderMeshes.push(mesh)
						})

						// Build fill meshes
						const fillGeometries = buildCountryFill(
							geom.coordinates,
							geom.type,
							latLonToVec3,
							GLOBE_RADIUS * FILL_RADIUS_SCALE,
							computeCentroidVector,
						)
						const fillMeshes = fillGeometries.map((geo) => {
							const mesh = new THREE.Mesh(geo, highlightMat.clone())
							mesh.visible = false
							fillGroup.add(mesh)
							return mesh
						})

						const polys: number[][][][] =
							geom.type === "Polygon"
								? [geom.coordinates as number[][][]]
								: geom.type === "MultiPolygon"
									? (geom.coordinates as number[][][][])
									: []
						let centroid = new THREE.Vector3(0, 0, GLOBE_RADIUS)
						if (polys.length) {
							centroid = computeCentroidVector(
								polys,
								latLonToVec3,
								GLOBE_RADIUS,
							)
						}

						countryEntries.push({
							name,
							type: geom.type,
							coordinates: geom.coordinates,
							fillMeshes,
							borderMeshes,
							centroid,
						})
					},
				)
				// Match globe group orientation
				borderLines.rotation.copy(globeGroup.rotation)
				fillGroup.rotation.copy(globeGroup.rotation)
				console.log(
					`[GlobeViz] ${countryEntries.length} countries loaded for interaction`,
				)
				onCountriesLoaded(countryEntries)
				onGeoJsonLoaded()
			})
			.catch((err) => {
				console.warn("[GlobeViz] GeoJSON load failed", err)
				onGeoJsonLoaded()
			})

		return () => {
			scene.remove(borderLines)
			scene.remove(fillGroup)
			borderMat.dispose()
			hoverBorderMat.dispose()
			selectedBorderMat.dispose()
			highlightMat.dispose()
			countryEntries.forEach((entry) => {
				entry.fillMeshes.forEach((m) => {
					m.geometry.dispose()
					m.material.dispose()
				})
				entry.borderMeshes.forEach((m) => {
					m.geometry.dispose()
				})
			})
		}
	}, [scene, globeGroup, onCountriesLoaded, onGeoJsonLoaded, onMaterialsReady])

	return null
}
