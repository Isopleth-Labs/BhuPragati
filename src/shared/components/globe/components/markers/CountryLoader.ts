import * as THREE from "three"
import type { CountryEntry } from "../../utils/globe.constants"
import {
	COUNTRY_GEOJSON_URL,
	EARTH_RADIUS,
	LABEL_OFFSET,
} from "../../utils/globe.constants"
import { computeCentroidVector } from "../../utils/globe.utils"
import { createCountryFill, createCountryLine } from "./CountryGeometry"

export interface GeoJsonFeature {
	id?: string | number | null
	properties?: {
		name?: string | null
	}
	geometry?: {
		type: string
		coordinates: number[][][] | number[][][][]
	}
}

export async function fetchAndParseCountries(
	borderMaterial: THREE.LineBasicMaterial,
	fillMaterial: THREE.MeshBasicMaterial,
	indiaBorderMaterial: THREE.LineBasicMaterial,
	indiaFillMaterial: THREE.MeshBasicMaterial,
	countryLinesGroup: THREE.Group,
	countryFillsGroup: THREE.Group,
): Promise<CountryEntry[]> {
	const response = await fetch(COUNTRY_GEOJSON_URL)
	if (!response.ok) {
		throw new Error(`Failed to load countries: ${response.status}`)
	}
	const data = await response.json()
	const features = (data?.features ?? []) as GeoJsonFeature[]
	const entries: CountryEntry[] = []

	features.forEach((feature, featureIndex) => {
		const name = feature?.properties?.name ?? "Unknown"
		const geom = feature?.geometry
		const coords =
			geom?.type === "Polygon"
				? [geom.coordinates as number[][][]]
				: geom?.type === "MultiPolygon"
					? (geom.coordinates as number[][][][])
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

		const isIndia = name === "India"
		const lineMaterial = isIndia ? indiaBorderMaterial : borderMaterial
		const line = createCountryLine(polygons, name, lineMaterial)
		countryLinesGroup.add(line)

		const baseFillMaterial = isIndia ? indiaFillMaterial : fillMaterial
		const fill = createCountryFill(polygons, name, baseFillMaterial)
		if (fill) {
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

		const entry: CountryEntry = {
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
		entries.push(entry)
	})

	return entries
}
export { buildBorderGeometry, buildFillGeometry } from "../../utils/globe.utils"
