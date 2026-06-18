import type { RefObject } from "react";
import { useEffect } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { getFitPadding } from "#/shared/lib/utils/utils";
import {
	FOCUS_EASE,
	INITIAL_VIEW_STATE,
	MAP_FIT_BOUNDS,
} from "@/shared/lib/config/mapConfig";

// One-time camera fit on mount: fits MAP_FIT_BOUNDS then eases into the
// cinematic FOCUS_EASE view. Pure viewport math, no overlays/business logic —
// lives in a dedicated hook per the MapEngine spec's viewport-fit rule.
export function useFocusViewport(
	mapRef: RefObject<MapRef | null>,
	onComplete?: () => void,
) {
	useEffect(() => {
		const instance = mapRef.current;
		if (!instance) return;
		const map = instance.getMap();

		const run = () => {
			map.fitBounds(MAP_FIT_BOUNDS as [[number, number], [number, number]], {
				padding: getFitPadding(map.getContainer()),
				duration: 0,
			});

			map.easeTo({
				center: FOCUS_EASE.center as [number, number],
				zoom: FOCUS_EASE.zoom,
				pitch: INITIAL_VIEW_STATE.pitch,
				bearing: INITIAL_VIEW_STATE.bearing,
				duration: FOCUS_EASE.duration,
			});

			onComplete?.();
		};

		if (map.loaded()) run();
		else map.once("load", run);
	}, [mapRef, onComplete]);
}
