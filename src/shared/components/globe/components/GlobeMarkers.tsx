import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import type { CountryEntry } from "../utils/globe.constants"
import { fetchAndParseCountries } from "./markers/CountryLoader"
import { updateCountryVisibility } from "./markers/CountryVisibility"
import { updateTooltipPosition } from "./markers/TooltipProjection"

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
				const entries = await fetchAndParseCountries(
					borderMaterial,
					fillMaterial,
					indiaBorderMaterial,
					indiaFillMaterial,
					countryLinesGroup,
					countryFillsGroup,
				)

				countryEntriesRef.current = entries
				setCountriesReady(true)
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
			updateCountryVisibility(camera, countryEntriesRef.current)
		}

		const updateSelectedLabel = () => {
			updateTooltipPosition(camera, renderer, tooltip, selectedCountry)
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
