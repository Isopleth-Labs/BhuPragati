import { useEffect } from "react";
import { useMapReady } from "../hooks/useMapReady";
import { attachInteractivePopups } from "../interactions/popup";

interface FeaturePopupControllerProps {
	// interactiveLayerIds spans AdministrativeBoundaryLayer's kusheshwar-focus-core
	// and InfrastructureLayer's layers (flood/road/healthcare/agriculture/
	// electricity) — gated on both being ready.
	ready: boolean;
}

export function FeaturePopupController({ ready }: FeaturePopupControllerProps) {
	const map = useMapReady();

	useEffect(() => {
		if (!map || !ready) return;
		attachInteractivePopups(map);
	}, [map, ready]);

	return null;
}
