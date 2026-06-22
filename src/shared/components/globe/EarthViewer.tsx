import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GlobeControls } from "./components/GlobeControls"
import { GlobeEffects } from "./components/GlobeEffects"
import { GlobeMarkers } from "./components/GlobeMarkers"
import { GlobeScene } from "./components/GlobeScene"
import { applyCameraPosition } from "./utils/globe.camera"
import type { CountryEntry } from "./utils/globe.constants"
import {
	CAMERA_DISTANCE,
	CAMERA_LIFT,
	EARTH_RADIUS,
	INDIA_Y_ADJUST,
	LINE_THRESHOLD,
} from "./utils/globe.constants"
import { orientEarthTowardsIndia } from "./utils/globe.utils"

interface EarthViewerProps {
	className?: string
	onReady?: (engine: {
		scene: THREE.Scene
		camera: THREE.PerspectiveCamera
		renderer: THREE.WebGLRenderer
		earthRoot: THREE.Group
		addRenderCallback: (cb: () => void) => () => void
	}) => void
}

interface GlobeEngine {
	scene: THREE.Scene
	camera: THREE.PerspectiveCamera
	renderer: THREE.WebGLRenderer
	raycaster: THREE.Raycaster
	pointerNdc: THREE.Vector2
	earthPivot: THREE.Group
	countryLinesGroup: THREE.Group
	countryFillsGroup: THREE.Group
	globeMesh: THREE.Mesh
	globeMaterial: THREE.MeshStandardMaterial
	spherical: THREE.Spherical
}

export default function EarthViewer({ className, onReady }: EarthViewerProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const tooltipRef = useRef<HTMLDivElement | null>(null)
	const countryEntriesRef = useRef<CountryEntry[]>([])
	const renderCallbacksRef = useRef(new Set<() => void>())
	const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0))

	const rotateStateRef = useRef({
		isDragging: false,
		lastX: 0,
		lastY: 0,
		inertiaX: 0,
		inertiaY: 0,
	})

	const [engine, setEngine] = useState<GlobeEngine | null>(null)
	const [countriesReady, setCountriesReady] = useState(false)
	const [hoveredCountry, setHoveredCountry] = useState<CountryEntry | null>(
		null,
	)
	const [selectedCountry, setSelectedCountry] = useState<CountryEntry | null>(
		null,
	)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return undefined

		const scene = new THREE.Scene()
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
		renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2))
		renderer.setSize(container.clientWidth, container.clientHeight)
		renderer.setClearColor(0x000000, 0)
		Object.assign(renderer, {
			toneMapping: THREE.ACESFilmicToneMapping,
			toneMappingExposure: 1.0,
			outputColorSpace: THREE.SRGBColorSpace,
		})
		container.appendChild(renderer.domElement)

		const camera = new THREE.PerspectiveCamera(
			28,
			container.clientWidth / container.clientHeight,
			0.1,
			350,
		)
		camera.position.set(0, CAMERA_LIFT, CAMERA_DISTANCE)
		camera.lookAt(cameraTargetRef.current)

		const raycaster = new THREE.Raycaster()
		raycaster.params.Line = { threshold: LINE_THRESHOLD }
		const pointerNdc = new THREE.Vector2()

		const earthRoot = new THREE.Group()
		earthRoot.name = "earthRoot"
		scene.add(earthRoot)

		const earthPivot = new THREE.Group()
		earthPivot.name = "earthPivot"
		earthRoot.add(earthPivot)

		const countryLinesGroup = new THREE.Group()
		Object.assign(countryLinesGroup, {
			name: "countryLinesGroup",
			renderOrder: 3,
			visible: false,
		})
		earthPivot.add(countryLinesGroup)

		const countryFillsGroup = new THREE.Group()
		Object.assign(countryFillsGroup, {
			name: "countryFillsGroup",
			renderOrder: 2,
			visible: false,
		})
		earthPivot.add(countryFillsGroup)

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
		earthPivot.add(globeMesh)

		orientEarthTowardsIndia(earthPivot)
		earthPivot.rotateY(Math.PI + INDIA_Y_ADJUST)
		earthPivot.rotateY(THREE.MathUtils.degToRad(8))
		earthPivot.rotateY(THREE.MathUtils.degToRad(4))

		const spherical = new THREE.Spherical()
		const camLen = camera.position.length()
		spherical.set(
			camLen,
			Math.acos(camera.position.y / camLen),
			Math.atan2(camera.position.x, camera.position.z),
		)
		applyCameraPosition(camera, spherical, cameraTargetRef.current)

		const tooltip = document.createElement("div")
		Object.assign(tooltip.style, {
			position: "fixed",
			pointerEvents: "none",
			padding: "6px 10px",
			borderRadius: "6px",
			background: "rgba(18,25,38,0.85)",
			color: "#e9eef7",
			font: '600 12px "Segoe UI", sans-serif',
			boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
			opacity: "0",
			transition: "opacity 120ms ease",
		})
		document.body.appendChild(tooltip)
		tooltipRef.current = tooltip

		const handleResize = () => {
			if (!containerRef.current) return
			const { clientWidth, clientHeight } = containerRef.current
			renderer.setSize(clientWidth, clientHeight)
			camera.aspect = clientWidth / clientHeight
			camera.updateProjectionMatrix()
		}
		window.addEventListener("resize", handleResize)

		let animationFrame = 0
		const renderLoop = () => {
			animationFrame = requestAnimationFrame(renderLoop)
			renderCallbacksRef.current.forEach((cb) => {
				cb()
			})
			renderer.render(scene, camera)
		}
		renderLoop()

		const currentEngine: GlobeEngine = {
			scene,
			camera,
			renderer,
			raycaster,
			pointerNdc,
			earthPivot,
			countryLinesGroup,
			countryFillsGroup,
			globeMesh,
			globeMaterial,
			spherical,
		}
		setEngine(currentEngine)

		onReady?.({
			scene,
			camera,
			renderer,
			earthRoot,
			addRenderCallback: (cb) => {
				renderCallbacksRef.current.add(cb)
				return () => renderCallbacksRef.current.delete(cb)
			},
		})

		return () => {
			setEngine(null)
			cancelAnimationFrame(animationFrame)
			window.removeEventListener("resize", handleResize)
			if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip)
			globeGeometry.dispose()
			globeMaterial.dispose()
			renderer.dispose()
			if (renderer.domElement.parentNode)
				renderer.domElement.parentNode.removeChild(renderer.domElement)
		}
	}, [onReady])

	const addRenderCallback = (cb: () => void) => {
		renderCallbacksRef.current.add(cb)
		return () => {
			renderCallbacksRef.current.delete(cb)
		}
	}

	const hideTooltip = () => {
		if (tooltipRef.current) tooltipRef.current.style.opacity = "0"
	}

	return (
		<div
			className={className}
			ref={containerRef}
			style={{ width: "100%", height: "100%" }}
		>
			{engine && containerRef.current && tooltipRef.current && (
				<>
					<GlobeScene
						scene={engine.scene}
						renderer={engine.renderer}
						globeMesh={engine.globeMesh}
						globeMaterial={engine.globeMaterial}
					/>
					<GlobeControls
						container={containerRef.current}
						camera={engine.camera}
						renderer={engine.renderer}
						globeMesh={engine.globeMesh}
						spherical={engine.spherical}
						cameraTarget={cameraTargetRef.current}
						rotateState={rotateStateRef.current}
						raycaster={engine.raycaster}
						pointerNdc={engine.pointerNdc}
						countryEntriesRef={countryEntriesRef}
						countriesReady={countriesReady}
						hoveredCountry={hoveredCountry}
						setHoveredCountry={setHoveredCountry}
						selectedCountry={selectedCountry}
						setSelectedCountry={setSelectedCountry}
						hideTooltip={hideTooltip}
					/>
					<GlobeEffects
						camera={engine.camera}
						spherical={engine.spherical}
						cameraTarget={cameraTargetRef.current}
						rotateState={rotateStateRef.current}
						addRenderCallback={addRenderCallback}
					/>
					<GlobeMarkers
						camera={engine.camera}
						renderer={engine.renderer}
						countryLinesGroup={engine.countryLinesGroup}
						countryFillsGroup={engine.countryFillsGroup}
						countryEntriesRef={countryEntriesRef}
						countriesReady={countriesReady}
						setCountriesReady={setCountriesReady}
						hoveredCountry={hoveredCountry}
						selectedCountry={selectedCountry}
						tooltip={tooltipRef.current}
						addRenderCallback={addRenderCallback}
					/>
				</>
			)}
		</div>
	)
}
