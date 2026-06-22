import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GlobeVizControls } from "./globeviz/components/GlobeVizControls"
import { GlobeVizEffects } from "./globeviz/components/GlobeVizEffects"
import { GlobeVizMarkers } from "./globeviz/components/GlobeVizMarkers"
import { GlobeVizScene } from "./globeviz/components/GlobeVizScene"
import type { GlobeVizCountryEntry } from "./globeviz/utils/globeviz.constants"
import {
	CAMERA_FAR,
	CAMERA_FOV,
	CAMERA_NEAR,
	CAMERA_POS_X,
	CAMERA_POS_Y,
	CAMERA_POS_Z,
	CLEAR_COLOR,
	CONTROLS_DAMPING_FACTOR,
	CONTROLS_MAX_DISTANCE,
	CONTROLS_MIN_DISTANCE,
	CONTROLS_ROTATE_SPEED,
	CONTROLS_ZOOM_SPEED,
	FILL_FADE_STEP,
	FOG_DENSITY,
	HIGHLIGHT_MAX_OPACITY,
	INDIA_LAT_DEG,
	INDIA_LON_DEG,
	TONE_MAPPING_EXPOSURE,
} from "./globeviz/utils/globeviz.constants"

export default function GlobeViz() {
	const mountRef = useRef<HTMLDivElement>(null)

	// Core Three.js objects owned by this component
	const sceneRef = useRef<THREE.Scene | null>(null)
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
	const controlsRef = useRef<OrbitControls | null>(null)
	const globeGroupRef = useRef<THREE.Group | null>(null)
	const backgroundGroupRef = useRef<THREE.Group | null>(null)

	// Animation loop state
	const renderCallbacksRef = useRef(new Set<() => void>())
	const tooltipRef = useRef<HTMLDivElement | null>(null)

	// Assets loading coordination
	const texturesLoadedRef = useRef(false)
	const geoJsonLoadedRef = useRef(false)
	const assetsLoadedRef = useRef(false)
	const fadeFactorRef = useRef(0.0)

	// Country interaction state
	const countryEntriesRef = useRef<GlobeVizCountryEntry[]>([])
	const selectedEntryRef = useRef<GlobeVizCountryEntry | null>(null)
	const cameraTargetPosRef = useRef<THREE.Vector3 | null>(null)
	const fadeAnimRef = useRef<number | null>(null)

	// Material refs for sub-components
	const globeMeshRef = useRef<THREE.Mesh | null>(null)
	const globeMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
	const cloudMatRef = useRef<THREE.MeshPhongMaterial | null>(null)
	const atmMatRef = useRef<THREE.MeshPhongMaterial | null>(null)
	const starMatRef = useRef<THREE.ShaderMaterial | null>(null)
	const borderMatRef = useRef<THREE.LineBasicMaterial | null>(null)
	const hoverBorderMatRef = useRef<THREE.LineBasicMaterial | null>(null)
	const selectedBorderMatRef = useRef<THREE.LineBasicMaterial | null>(null)
	const highlightMatRef = useRef<THREE.MeshBasicMaterial | null>(null)

	// Disposable scene object refs
	const globeGeoRef = useRef<THREE.SphereGeometry | null>(null)
	const cloudGeoRef = useRef<THREE.SphereGeometry | null>(null)
	const atmGeoRef = useRef<THREE.SphereGeometry | null>(null)
	const starGeoRef = useRef<THREE.BufferGeometry | null>(null)
	const mwGeoRef = useRef<THREE.SphereGeometry | null>(null)
	const mwMatRef = useRef<THREE.MeshBasicMaterial | null>(null)

	const [initialized, setInitialized] = useState(false)
	const [countriesReady, setCountriesReady] = useState(false)
	const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(
		null,
	)

	// ── Core setup: renderer, scene, camera, controls, animation loop ──
	useEffect(() => {
		const container = mountRef.current
		if (!container) return

		// Renderer
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: false,
			powerPreference: "high-performance",
		})
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.setSize(container.clientWidth, container.clientHeight)
		renderer.setClearColor(CLEAR_COLOR)
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE
		renderer.outputColorSpace = THREE.SRGBColorSpace
		container.appendChild(renderer.domElement)
		rendererRef.current = renderer

		// Scene
		const scene = new THREE.Scene()
		scene.background = new THREE.Color(CLEAR_COLOR)
		scene.fog = new THREE.FogExp2(CLEAR_COLOR, FOG_DENSITY)
		sceneRef.current = scene

		// Camera
		const camera = new THREE.PerspectiveCamera(
			CAMERA_FOV,
			container.clientWidth / container.clientHeight,
			CAMERA_NEAR,
			CAMERA_FAR,
		)
		camera.position.set(CAMERA_POS_X, CAMERA_POS_Y, CAMERA_POS_Z)
		camera.lookAt(0, 0, 0)
		cameraRef.current = camera

		// Controls
		const controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		controls.dampingFactor = CONTROLS_DAMPING_FACTOR
		controls.enablePan = false
		controls.minDistance = CONTROLS_MIN_DISTANCE
		controls.maxDistance = CONTROLS_MAX_DISTANCE
		controls.rotateSpeed = CONTROLS_ROTATE_SPEED
		controls.zoomSpeed = CONTROLS_ZOOM_SPEED
		controlsRef.current = controls

		// Globe group (India centered)
		const globeGroup = new THREE.Group()
		const lat = INDIA_LAT_DEG * (Math.PI / 180)
		const lon = INDIA_LON_DEG * (Math.PI / 180)
		globeGroup.rotation.y = -2 * lon
		globeGroup.rotation.x = lat * 0.55
		scene.add(globeGroup)
		globeGroupRef.current = globeGroup

		// Background group
		const backgroundGroup = new THREE.Group()
		scene.add(backgroundGroup)
		backgroundGroupRef.current = backgroundGroup

		// Tooltip
		const tooltip = document.createElement("div")
		tooltip.style.cssText = `
      position: fixed;
      pointer-events: none;
      background: rgba(0,0,0,0.8);
      color: #fff;
      border-radius: 6px;
      padding: 6px 10px;
      font: 600 12px "Segoe UI", system-ui, sans-serif;
      opacity: 0;
      transition: opacity 100ms ease;
      z-index: 9999;
      white-space: nowrap;
    `
		document.body.appendChild(tooltip)
		tooltipRef.current = tooltip

		// Resize
		function onResize() {
			const w = container.clientWidth
			const h = container.clientHeight
			camera.aspect = w / h
			camera.updateProjectionMatrix()
			renderer.setSize(w, h)
		}
		window.addEventListener("resize", onResize)

		// Animation loop
		let animId = 0
		function animate() {
			animId = requestAnimationFrame(animate)
			renderCallbacksRef.current.forEach((cb) => {
				cb()
			})
			controls.update()
			renderer.render(scene, camera)
		}
		animate()

		setInitialized(true)

		// Cleanup
		return () => {
			setInitialized(false)
			cancelAnimationFrame(animId)
			controls.dispose()
			window.removeEventListener("resize", onResize)
			if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip)
			renderer.dispose()
			if (renderer.domElement.parentNode) {
				renderer.domElement.parentNode.removeChild(renderer.domElement)
			}
		}
	}, [])

	// ── Render callback registration ──
	const addRenderCallback = useCallback((cb: () => void) => {
		renderCallbacksRef.current.add(cb)
		return () => {
			renderCallbacksRef.current.delete(cb)
		}
	}, [])

	// ── Assets coordination ──
	const checkAssetsLoaded = useCallback(() => {
		if (texturesLoadedRef.current && geoJsonLoadedRef.current) {
			assetsLoadedRef.current = true
		}
	}, [])

	const onTexturesLoaded = useCallback(() => {
		texturesLoadedRef.current = true
		checkAssetsLoaded()
	}, [checkAssetsLoaded])

	const onGeoJsonLoaded = useCallback(() => {
		geoJsonLoadedRef.current = true
		checkAssetsLoaded()
	}, [checkAssetsLoaded])

	// ── Scene ready callback ──
	const onSceneReady = useCallback(
		(refs: {
			globeMesh: THREE.Mesh
			globeMat: THREE.MeshPhysicalMaterial
			cloudMat: THREE.MeshPhongMaterial
			atmMat: THREE.MeshPhongMaterial
			starMat: THREE.ShaderMaterial
			globeGeo: THREE.SphereGeometry
			cloudGeo: THREE.SphereGeometry
			atmGeo: THREE.SphereGeometry
			starGeo: THREE.BufferGeometry
			mwGeo: THREE.SphereGeometry
			mwMat: THREE.MeshBasicMaterial
		}) => {
			globeMeshRef.current = refs.globeMesh
			globeMatRef.current = refs.globeMat
			cloudMatRef.current = refs.cloudMat
			atmMatRef.current = refs.atmMat
			starMatRef.current = refs.starMat
			globeGeoRef.current = refs.globeGeo
			cloudGeoRef.current = refs.cloudGeo
			atmGeoRef.current = refs.atmGeo
			starGeoRef.current = refs.starGeo
			mwGeoRef.current = refs.mwGeo
			mwMatRef.current = refs.mwMat
		},
		[],
	)

	// ── Materials ready callback ──
	const onMaterialsReady = useCallback(
		(mats: {
			borderMat: THREE.LineBasicMaterial
			hoverBorderMat: THREE.LineBasicMaterial
			selectedBorderMat: THREE.LineBasicMaterial
			highlightMat: THREE.MeshBasicMaterial
		}) => {
			borderMatRef.current = mats.borderMat
			hoverBorderMatRef.current = mats.hoverBorderMat
			selectedBorderMatRef.current = mats.selectedBorderMat
			highlightMatRef.current = mats.highlightMat
		},
		[],
	)

	// ── Countries loaded callback ──
	const onCountriesLoaded = useCallback((entries: GlobeVizCountryEntry[]) => {
		countryEntriesRef.current = entries
		setCountriesReady(true)
	}, [])

	// ── Country click handler ──
	const onCountryClick = useCallback((name: string | null) => {
		const borderMat = borderMatRef.current
		const selectedBorderMat = selectedBorderMatRef.current
		if (!borderMat || !selectedBorderMat) return

		// Deselect previous
		if (selectedEntryRef.current) {
			selectedEntryRef.current.fillMeshes.forEach((m) => {
				m.material.opacity = 0.0
				m.visible = false
			})
			selectedEntryRef.current.borderMeshes.forEach((m) => {
				m.material = borderMat
			})
			if (fadeAnimRef.current) {
				cancelAnimationFrame(fadeAnimRef.current)
				fadeAnimRef.current = null
			}
		}

		if (name) {
			const entry = countryEntriesRef.current.find((e) => e.name === name)
			if (entry) {
				selectedEntryRef.current = entry

				entry.borderMeshes.forEach((m) => {
					m.material = selectedBorderMat
				})

				if (entry.fillMeshes.length) {
					entry.fillMeshes.forEach((m) => {
						m.visible = true
						m.material.opacity = 0.0
					})
					let progress = 0
					const fadeIn = () => {
						progress += FILL_FADE_STEP
						const opacity = Math.min(progress, HIGHLIGHT_MAX_OPACITY)
						entry.fillMeshes.forEach((m) => {
							m.material.opacity = opacity
						})
						if (progress < HIGHLIGHT_MAX_OPACITY) {
							fadeAnimRef.current = requestAnimationFrame(fadeIn)
						} else {
							fadeAnimRef.current = null
						}
					}
					fadeAnimRef.current = requestAnimationFrame(fadeIn)
				}
				console.log(`Selected: ${name}`)

				if (entry.centroid && globeGroupRef.current && cameraRef.current) {
					const worldCentroid = entry.centroid
						.clone()
						.applyMatrix4(globeGroupRef.current.matrixWorld)
						.normalize()
					cameraTargetPosRef.current = worldCentroid.multiplyScalar(
						cameraRef.current.position.length(),
					)
				}
			}
		} else {
			selectedEntryRef.current = null
			cameraTargetPosRef.current = null
			console.log("[GlobeViz] Selection cleared")
		}
	}, [])

	const onCameraTargetClear = useCallback(() => {
		cameraTargetPosRef.current = null
	}, [])

	return (
		<div ref={mountRef} style={{ width: "100%", height: "100%" }}>
			{initialized &&
				sceneRef.current &&
				rendererRef.current &&
				cameraRef.current &&
				globeGroupRef.current &&
				backgroundGroupRef.current && (
					<>
						<GlobeVizScene
							scene={sceneRef.current}
							renderer={rendererRef.current}
							globeGroup={globeGroupRef.current}
							backgroundGroup={backgroundGroupRef.current}
							onSceneReady={onSceneReady}
							onTexturesLoaded={onTexturesLoaded}
						/>
						<GlobeVizMarkers
							scene={sceneRef.current}
							globeGroup={globeGroupRef.current}
							onCountriesLoaded={onCountriesLoaded}
							onGeoJsonLoaded={onGeoJsonLoaded}
							onMaterialsReady={onMaterialsReady}
						/>
						{countriesReady &&
							globeMeshRef.current &&
							mountRef.current &&
							tooltipRef.current &&
							borderMatRef.current &&
							hoverBorderMatRef.current && (
								<GlobeVizControls
									container={mountRef.current}
									camera={cameraRef.current}
									renderer={rendererRef.current}
									globeMesh={globeMeshRef.current}
									globeGroup={globeGroupRef.current}
									countryEntries={countryEntriesRef.current}
									tooltip={tooltipRef.current}
									onCountryClick={onCountryClick}
									onHoverChange={setHoveredCountryName}
									hoveredCountryName={hoveredCountryName}
									selectedEntryRef={selectedEntryRef}
									borderMat={borderMatRef.current}
									hoverBorderMat={hoverBorderMatRef.current}
									onCameraTargetClear={onCameraTargetClear}
								/>
							)}
						<GlobeVizEffects
							camera={cameraRef.current}
							backgroundGroup={backgroundGroupRef.current}
							globeMat={globeMatRef.current}
							cloudMat={cloudMatRef.current}
							atmMat={atmMatRef.current}
							starMat={starMatRef.current}
							borderMat={borderMatRef.current}
							selectedBorderMat={selectedBorderMatRef.current}
							assetsLoadedRef={assetsLoadedRef}
							fadeFactorRef={fadeFactorRef}
							cameraTargetPosRef={cameraTargetPosRef}
							addRenderCallback={addRenderCallback}
						/>
					</>
				)}
		</div>
	)
}
