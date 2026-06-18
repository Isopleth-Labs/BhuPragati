import { useEffect } from "react";
import { resolveBoundaryProvider } from "@/shared/boundary/registry";
import { useMapReady } from "../hooks/useMapReady";
import {
	DISTRICT_SOURCE,
	DISTRICT_FILL_LAYER,
	DISTRICT_LINE_LAYER,
	DISTRICT_LABEL_LAYER,
} from "@/shared/selectors";

interface DistrictBoundaryLayerProps {
	stateId?: string;
	onReady?: () => void;
}

// Renders district boundaries for a single state via BoundaryProvider.
// Three layers over the district GeoJSON:
//   district-fill    — transparent hit surface; highlights on hover (feature-state.hover)
//   district-lines   — visible boundary lines; brightens on hover
//   district-labels  — district name labels
//
// stateId defaults to "bihar" — the only state with district geometry in MVP.
// Future: pass stateId explicitly when drilling down from StateSelectionController.
//
// promoteId: "id" promotes properties.id (slug) as the MapLibre feature id so
// setFeatureState calls in DistrictSelectionController can target by slug string.
//
// Cleanup removes all layers+source on unmount so switching states doesn't bleed.
export function DistrictBoundaryLayer({
	stateId = "bihar",
	onReady,
}: DistrictBoundaryLayerProps) {
	const map = useMapReady();

	useEffect(() => {
		if (!map) return;
		let cancelled = false;

		(async () => {
			const provider = resolveBoundaryProvider("district");
			const source = await provider.getSourceDescriptor("district", stateId);
			if (cancelled || !source || source.type !== "geojson" || !source.data) {
				return;
			}

			if (!map.getSource(DISTRICT_SOURCE)) {
				map.addSource(DISTRICT_SOURCE, {
					type: "geojson",
					data: source.data,
					promoteId: "id",
				});
			}

			if (!map.getLayer(DISTRICT_FILL_LAYER)) {
				map.addLayer({
					id: DISTRICT_FILL_LAYER,
					type: "fill",
					source: DISTRICT_SOURCE,
					paint: {
						"fill-color": "#5fa8d8",
						"fill-opacity": [
							"case",
							["boolean", ["feature-state", "selected"], false],
							0.38,
							["boolean", ["feature-state", "hover"], false],
							0.22,
							0.06,
						],
					},
				});
			}

			if (!map.getLayer(DISTRICT_LINE_LAYER)) {
				map.addLayer({
					id: DISTRICT_LINE_LAYER,
					type: "line",
					source: DISTRICT_SOURCE,
					paint: {
						"line-color": "#5fa8d8",
						"line-width": [
							"case",
							["boolean", ["feature-state", "selected"], false],
							2.5,
							["boolean", ["feature-state", "hover"], false],
							2.0,
							1.4,
						],
						"line-opacity": [
							"case",
							["boolean", ["feature-state", "selected"], false],
							0.90,
							["boolean", ["feature-state", "hover"], false],
							0.72,
							0.52,
						],
					},
				});
			}

			if (!map.getLayer(DISTRICT_LABEL_LAYER)) {
				map.addLayer({
					id: DISTRICT_LABEL_LAYER,
					type: "symbol",
					source: DISTRICT_SOURCE,
					layout: {
						"text-field": ["get", "name"],
						"text-size": 11,
						"text-font": ["Noto Sans Regular"],
					},
					paint: {
						"text-color": "#b9d4ea",
						"text-halo-color": "#04111c",
						"text-halo-width": 1,
					},
				});
			}

			onReady?.();
		})();

		return () => {
			cancelled = true;
			// react-map-gl destroys the map via useLayoutEffect, which fires before
			// useEffect cleanups. Guard with try/catch so switching states (which
			// triggers this cleanup) is safe, while unmount-during-navigation is too.
			try {
				if (map.getLayer(DISTRICT_LABEL_LAYER)) map.removeLayer(DISTRICT_LABEL_LAYER);
				if (map.getLayer(DISTRICT_LINE_LAYER)) map.removeLayer(DISTRICT_LINE_LAYER);
				if (map.getLayer(DISTRICT_FILL_LAYER)) map.removeLayer(DISTRICT_FILL_LAYER);
				if (map.getSource(DISTRICT_SOURCE)) map.removeSource(DISTRICT_SOURCE);
			} catch {
				// map.style may be undefined if map was already destroyed
			}
		};
	}, [map, stateId, onReady]);

	return null;
}
