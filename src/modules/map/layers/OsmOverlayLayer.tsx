import { useEffect } from "react";
import { useMapReady } from "../hooks/useMapReady";
import { addOsmOverlays } from "../overlays/osm";

export function OsmOverlayLayer() {
	const map = useMapReady();

	useEffect(() => {
		if (!map) return;
		addOsmOverlays(map).catch((err) => console.warn("[osm] failed:", err));
	}, [map]);

	return null;
}
