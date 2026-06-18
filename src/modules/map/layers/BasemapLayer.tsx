import { useEffect } from "react";
import { useMapReady } from "../hooks/useMapReady";
import { addBasemapOverlay } from "../overlays/basemap";

export function BasemapLayer() {
	const map = useMapReady();

	useEffect(() => {
		if (!map) return;
		addBasemapOverlay(map);
	}, [map]);

	return null;
}
