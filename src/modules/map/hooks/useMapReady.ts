import type { Map as MaplibreMap } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useMap } from "react-map-gl/maplibre";

// Returns the underlying MapLibre instance once its style has finished
// loading, or null until then. Lets layer/controller children gate their
// own setup on map-readiness without MapEngine orchestrating anything.
export function useMapReady(): MaplibreMap | null {
	const { current } = useMap();
	const [readyMap, setReadyMap] = useState<MaplibreMap | null>(null);

	useEffect(() => {
		const map = current?.getMap();
		if (!map) return;

		if (map.loaded()) {
			setReadyMap(map);
			return;
		}

		const handleLoad = () => setReadyMap(map);
		map.once("load", handleLoad);
		return () => {
			map.off("load", handleLoad);
		};
	}, [current]);

	return readyMap;
}
