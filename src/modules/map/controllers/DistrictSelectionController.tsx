import { useEffect, useRef } from "react";
import type { MapLayerMouseEvent } from "maplibre-gl";
import { useMapReady } from "../hooks/useMapReady";
import {
  DISTRICT_SOURCE,
  DISTRICT_FILL_LAYER,
} from "@/shared/selectors";

interface DistrictSelectionControllerProps {
  ready: boolean;
  onDistrictClick: (districtId: string) => void;
}

// Handles hover + click interaction for district-fill.
// Emits districtId via callback only — owns zero navigation, routing, or region state.
// Two independent feature states: hover (transient) and selected (persists until next click).
// Uses string slug IDs directly — promoteId: "id" on DISTRICT_SOURCE eliminates numeric lookup.
//
// Pattern mirrors StateSelectionController. Next level: BlockSelectionController on BLOCK_FILL_LAYER.
export function DistrictSelectionController({
  ready,
  onDistrictClick,
}: DistrictSelectionControllerProps) {
  const map = useMapReady();
  const lastHoveredRef = useRef<string | null>(null);
  const lastSelectedRef = useRef<string | null>(null);

  // Stable ref so onDistrictClick identity changes don't re-run the listener effect.
  const onDistrictClickRef = useRef<(districtId: string) => void>(onDistrictClick);
  useEffect(() => {
    onDistrictClickRef.current = onDistrictClick;
  }, [onDistrictClick]);

  useEffect(() => {
    if (!map || !ready) return;

    // Bind to non-null local — TypeScript can't narrow `map` through closure
    // boundaries even after the null check above.
    const m = map;
    const canvas = m.getCanvas();

    function clearHover() {
      if (lastHoveredRef.current !== null) {
        m.setFeatureState(
          { source: DISTRICT_SOURCE, id: lastHoveredRef.current },
          { hover: false },
        );
        lastHoveredRef.current = null;
      }
    }

    function clearSelected() {
      if (lastSelectedRef.current !== null) {
        m.setFeatureState(
          { source: DISTRICT_SOURCE, id: lastSelectedRef.current },
          { selected: false },
        );
        lastSelectedRef.current = null;
      }
    }

    function handleMouseMove(e: MapLayerMouseEvent) {
      if (!e.features?.length) return;
      const id = (e.features[0].properties as { id?: string }).id;
      if (!id) return;

      canvas.style.cursor = "pointer";

      if (id === lastHoveredRef.current) return;

      clearHover();

      m.setFeatureState(
        { source: DISTRICT_SOURCE, id },
        { hover: true },
      );
      lastHoveredRef.current = id;
    }

    function handleMouseLeave() {
      canvas.style.cursor = "";
      clearHover();
    }

    function handleClick(e: MapLayerMouseEvent) {
      if (!e.features?.length) return;
      const id = (e.features[0].properties as { id?: string }).id;
      if (!id) return;

      clearSelected();

      m.setFeatureState(
        { source: DISTRICT_SOURCE, id },
        { selected: true },
      );
      lastSelectedRef.current = id;

      onDistrictClickRef.current(id);
    }

    m.on("mousemove", DISTRICT_FILL_LAYER, handleMouseMove);
    m.on("mouseleave", DISTRICT_FILL_LAYER, handleMouseLeave);
    m.on("click", DISTRICT_FILL_LAYER, handleClick);

    return () => {
      m.off("mousemove", DISTRICT_FILL_LAYER, handleMouseMove);
      m.off("mouseleave", DISTRICT_FILL_LAYER, handleMouseLeave);
      m.off("click", DISTRICT_FILL_LAYER, handleClick);
      canvas.style.cursor = "";
      lastHoveredRef.current = null;
      lastSelectedRef.current = null;
    };
  }, [map, ready]);

  return null;
}
