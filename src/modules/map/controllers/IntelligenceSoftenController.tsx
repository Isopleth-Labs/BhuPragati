import { useEffect } from "react";
import { useMapReady } from "../hooks/useMapReady";
import { softenIntelligenceLayers } from "../overlays/intelligence";

interface IntelligenceSoftenControllerProps {
	// Gated on InfrastructureLayer having finished loading — softening
	// mutates paint props that only exist once those layers are added.
	ready: boolean;
}

export function IntelligenceSoftenController({
	ready,
}: IntelligenceSoftenControllerProps) {
	const map = useMapReady();

	useEffect(() => {
		if (!map || !ready) return;
		softenIntelligenceLayers(map);
	}, [map, ready]);

	return null;
}
