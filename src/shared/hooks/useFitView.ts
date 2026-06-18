import type { RefObject } from "react"
import { useEffect } from "react"
import type { MapRef } from "react-map-gl/maplibre"
import { getFitPadding } from "#/shared/lib/utils/utils"
import { getRegionMetaAnyProvider } from "@/shared/boundary/registry"

// Region-driven viewport fit-on-mount: looks up the region's bbox/centroid/
// defaultZoom via BoundaryProvider instead of hardcoded geography-specific
// constants. Pure viewport math + one boundary lookup — no overlays, no
// business logic — lives in a dedicated hook per the MapEngine spec.
export function useFitView(
	mapRef: RefObject<MapRef | null>,
	regionId: string,
	onComplete?: () => void,
) {
	useEffect(() => {
		const instance = mapRef.current
		if (!instance) return
		const map = instance.getMap()
		let cancelled = false

		const run = async () => {
			const region = await getRegionMetaAnyProvider(regionId)
			if (cancelled || !region) return

			map.fitBounds(
				[
					[region.bbox.west, region.bbox.south],
					[region.bbox.east, region.bbox.north],
				],
				{ padding: getFitPadding(map.getContainer()), duration: 0 },
			)

			map.easeTo({
				center: [region.centroid.lon, region.centroid.lat],
				zoom: region.defaultZoom,
				duration: 900,
			})

			onComplete?.()
		}

		if (map.loaded()) run()
		else map.once("load", run)

		return () => {
			cancelled = true
		}
	}, [mapRef, regionId, onComplete])
}
