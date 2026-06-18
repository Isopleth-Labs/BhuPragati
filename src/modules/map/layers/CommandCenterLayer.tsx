import { useEffect } from "react";
import { addCommandCenterOverlay } from "#/modules/command-center";
import { useMapReady } from "../hooks/useMapReady";

export function CommandCenterLayer() {
	const map = useMapReady();

	useEffect(() => {
		if (!map) return;
		addCommandCenterOverlay(map);
	}, [map]);

	return null;
}
