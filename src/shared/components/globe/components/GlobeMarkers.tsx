import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import type { CountryEntry } from "../utils/globe.constants"
import {
	BORDER_OFFSET,
	COUNTRY_GEOJSON_URL,
	EARTH_RADIUS,
	LABEL_OFFSET,
} from "../utils/globe.constants"
import {
	buildBorderGeometry,
	buildFillGeometry,
	computeCentroidVector,
} from "../utils/globe.utils"

interface GlobeMarkersProps {
	camera: THREE.PerspectiveCamera
	renderer: THREE.WebGLRenderer
	countryLinesGroup: THREE.Group
	countryFillsGroup: THREE.Group
	countryEntriesRef: React.MutableRefObject<CountryEntry[]>
	countriesReady: boolean
	setCountriesReady: (ready: boolean) => void
	hoveredCountry: CountryEntry | null
	selectedCountry: CountryEntry | null
	tooltip: HTMLDivElement
	addRenderCallback: (cb: () => void) => () => void
}

interface GeoJsonFeature {
	id?: string | number | null
	properties?: {
		name?: string | null
	}
	geometry?: {
		type: string
		coordinates: number[][][] | number[][][][]
	}
}

export function GlobeMarkers({
	camera,
	renderer,
	countryLinesGroup,
	countryFillsGroup,
	countryEntriesRef,
	countriesReady,
	setCountriesReady,
	hoveredCountry,
	selectedCountry,
	tooltip,
	addRenderCallback,
}: GlobeMarkersProps) {
	const prevHovered = useRef<CountryEntry | null>(null)
	const prevSelected = useRef<CountryEntry | null>(null)
	const isFetchedRef = useRef(false)

	// Create materials using useMemo so they are consistent across renders
	const {
		borderMaterial,
		hoverBorderMaterial,
		selectedBorderMaterial,
		fillMaterial,
		hoverFillMaterial,
		selectedFillMaterial,
		indiaBorderMaterial,
		indiaFillMaterial,
	} = useMemo(() => {
		return {
			borderMaterial: new THREE.LineBasicMaterial({
				color: 0x6f7b8c,
				transparent: true,
				opacity: 0.55,
				depthTest: true,
				depthWrite: true,
			}),
			hoverBorderMaterial: new THREE.LineBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 1,
				depthTest: true,
				depthWrite: true,
			}),
			selectedBorderMaterial: new THREE.LineBasicMaterial({
				color: 0xdbe7ff,
				transparent: true,
				opacity: 1,
				depthTest: true,
				depthWrite: true,
			}),
			fillMaterial: new THREE.MeshBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.04,
				depthTest: true,
				depthWrite: false,
				side: THREE.FrontSide,
			}),
			hoverFillMaterial: new THREE.MeshBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.12,
				depthTest: true,
				depthWrite: false,
				side: THREE.FrontSide,
			}),
			selectedFillMaterial: new THREE.MeshBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.18,
				depthTest: true,
				depthWrite: false,
				side: THREE.FrontSide,
			}),
			indiaBorderMaterial: new THREE.LineBasicMaterial({
				color: 0xff3b3b,
				transparent: true,
				opacity: 0.9,
				depthTest: true,
				depthWrite: true,
			}),
			indiaFillMaterial: new THREE.MeshBasicMaterial({
				color: 0xff3b3b,
				transparent: true,
				opacity: 0.12,
				depthTest: true,
				depthWrite: false,
				side: THREE.FrontSide,
			}),
		}
	}, [])

	// 1. Fetch GeoJSON and load country markers ONCE on mount
	useEffect(() => {
		if (isFetchedRef.current) return
		isFetchedRef.current = true

		const loadCountries = async () => {
			try {
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
					const borderGeometry = buildBorderGeometry(
						polygons,
						EARTH_RADIUS * BORDER_OFFSET,
					)
					const fillGeometry = buildFillGeometry(
						polygons,
						EARTH_RADIUS * BORDER_OFFSET,
					)
					const isIndia = name === "India"
					const lineMaterial = isIndia ? indiaBorderMaterial : borderMaterial
					const line = new THREE.LineSegments(borderGeometry, lineMaterial)
					line.name = `border:${name}`
					line.renderOrder = 3
					countryLinesGroup.add(line)

					let fill: THREE.Mesh | null = null
					if (fillGeometry) {
						const baseFillMaterial = isIndia ? indiaFillMaterial : fillMaterial
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

				countryEntriesRef.current = entries
				setCountriesReady(true)
				console.log("[country-debug] load complete", {
					featureCount: features.length,
					entries: entries.length,
				})
			} catch (error) {
				console.warn("[EarthViewer] country data load failed", error)
			}
		}

		loadCountries()

		return () => {
			// Dispose all country mesh geometries on cleanup
			if (countryEntriesRef.current) {
				countryEntriesRef.current.forEach((entry) => {
					entry.line.geometry.dispose()
					entry.fill?.geometry.dispose()
				})
				countryEntriesRef.current = []
			}
			// Clear children from groups
			while (countryLinesGroup.children.length > 0) {
				countryLinesGroup.remove(countryLinesGroup.children[0])
			}
			while (countryFillsGroup.children.length > 0) {
				countryFillsGroup.remove(countryFillsGroup.children[0])
			}
		}
	}, [
		countryLinesGroup,
		countryFillsGroup,
		countryEntriesRef,
		setCountriesReady,
		borderMaterial,
		fillMaterial,
		indiaBorderMaterial,
		indiaFillMaterial,
	])

	// 2. Dispose of static materials on unmount
	useEffect(() => {
		return () => {
			borderMaterial.dispose()
			hoverBorderMaterial.dispose()
			selectedBorderMaterial.dispose()
			fillMaterial.dispose()
			hoverFillMaterial.dispose()
			selectedFillMaterial.dispose()
			indiaBorderMaterial.dispose()
			indiaFillMaterial.dispose()
		}
	}, [
		borderMaterial,
		hoverBorderMaterial,
		selectedBorderMaterial,
		fillMaterial,
		hoverFillMaterial,
		selectedFillMaterial,
		indiaBorderMaterial,
		indiaFillMaterial,
	])

	// 3. Register render visibility & tooltip projection callbacks
	useEffect(() => {
		const updateVisibility = () => {
			if (!countriesReady || !countryEntriesRef.current) return
			const camDir = camera.position.clone().normalize()
			countryEntriesRef.current.forEach((entry) => {
				const centroidDir = entry.centroidVec.clone().normalize()
				const facing = centroidDir.dot(camDir) > 0.0
				const visible = facing
				if (entry.line) entry.line.visible = visible
				if (entry.fill) entry.fill.visible = visible
			})
		}

		const updateSelectedLabel = () => {
			if (!selectedCountry) {
				tooltip.style.opacity = "0"
				return
			}
			const camDir = camera.position.clone().normalize()
			const centroidDir = selectedCountry.centroidVec.clone().normalize()
			const facing = centroidDir.dot(camDir) > 0.0
			if (!facing) {
				tooltip.style.opacity = "0"
				return
			}
			const worldPos = centroidDir
				.clone()
				.multiplyScalar(EARTH_RADIUS * LABEL_OFFSET)
			const projected = worldPos.project(camera)
			const rect = renderer.domElement.getBoundingClientRect()
			const x = (projected.x * 0.5 + 0.5) * rect.width + rect.left
			const y = (-projected.y * 0.5 + 0.5) * rect.height + rect.top

			tooltip.textContent = selectedCountry.name
			tooltip.style.opacity = "1"
			tooltip.style.left = `${x + 10}px`
			tooltip.style.top = `${y + 10}px`
		}

		const cleanupVis = addRenderCallback(updateVisibility)
		const cleanupLabel = addRenderCallback(updateSelectedLabel)

		return () => {
			cleanupVis()
			cleanupLabel()
		}
	}, [
		camera,
		renderer,
		countriesReady,
		countryEntriesRef,
		selectedCountry,
		tooltip,
		addRenderCallback,
	])

	// 4. Update border and fill mesh materials on hover/selection change
	useEffect(() => {
		// Revert old hovered country styling
		if (prevHovered.current && prevHovered.current !== hoveredCountry) {
			const c = prevHovered.current
			const isIndia = c.name === "India"
			c.line.material =
				c === selectedCountry
					? selectedBorderMaterial
					: isIndia
						? indiaBorderMaterial
						: borderMaterial
			if (c.fill) {
				c.fill.material =
					c === selectedCountry
						? selectedFillMaterial
						: isIndia
							? indiaFillMaterial
							: fillMaterial
			}
		}

		// Revert old selected country styling
		if (prevSelected.current && prevSelected.current !== selectedCountry) {
			const c = prevSelected.current
			const isIndia = c.name === "India"
			if (c !== hoveredCountry) {
				c.line.material = isIndia ? indiaBorderMaterial : borderMaterial
				if (c.fill) {
					c.fill.material = isIndia ? indiaFillMaterial : fillMaterial
				}
			}
		}

		// Apply new hovered country styling
		if (hoveredCountry) {
			hoveredCountry.line.material = hoverBorderMaterial
			if (hoveredCountry.fill) {
				hoveredCountry.fill.material =
					hoveredCountry === selectedCountry
						? selectedFillMaterial
						: hoverFillMaterial
			}
		}

		// Apply new selected country styling
		if (selectedCountry) {
			selectedCountry.line.material = hoverBorderMaterial
			if (selectedCountry.fill) {
				selectedCountry.fill.material = selectedFillMaterial
			}
		}

		prevHovered.current = hoveredCountry
		prevSelected.current = selectedCountry
	}, [
		hoveredCountry,
		selectedCountry,
		borderMaterial,
		hoverBorderMaterial,
		selectedBorderMaterial,
		fillMaterial,
		hoverFillMaterial,
		selectedFillMaterial,
		indiaBorderMaterial,
		indiaFillMaterial,
	])

	return null
}
