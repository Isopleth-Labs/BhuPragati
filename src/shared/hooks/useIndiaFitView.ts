import { useEffect } from "react"
import type { MapRef } from "react-map-gl/maplibre"
import { INDIA_BOUNDS, INDIA_CENTER } from "#/shared/map/MapConstraints"

export function useIndiaFitView(mapRef: React.RefObject<MapRef | null>) {
	useEffect(() => {
		if (!mapRef.current) return

		const map = mapRef.current.getMap()
		const hasRun = { current: false }

		const run = () => {
			if (hasRun.current) return
			hasRun.current = true

			map.setRenderWorldCopies(false)
			map.resize()

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					const canvas = map.getCanvas()
					const vw = canvas.offsetWidth
					const vh = canvas.offsetHeight

					const PADDING = 40
					const [swLng, swLat, neLng, neLat] = INDIA_BOUNDS

					const lngSpan = neLng - swLng
					const availW = vw - PADDING * 2
					const availH = vh - PADDING * 2

					const centerLat = (swLat + neLat) / 2
					const cosLat = Math.cos((centerLat * Math.PI) / 180)

					const zoomW = Math.log2((availW / 256) * (360 / (lngSpan / cosLat)))

					const latRad = (lat: number) =>
						Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
					const latSpanMerc =
						(Math.abs(latRad(neLat) - latRad(swLat)) / (2 * Math.PI)) * 256
					const zoomH = Math.log2(availH / latSpanMerc)

					const zoom = Math.min(zoomW, zoomH)

					map.jumpTo({ center: INDIA_CENTER, zoom, bearing: 0, pitch: 0 })
				})
			})
		}

		map.once("load", run)
		if (map.loaded()) run()
	}, [mapRef])
}
