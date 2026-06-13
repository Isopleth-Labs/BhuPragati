import maplibregl, { type Map as MaplibreMap } from "maplibre-gl";
import { interactiveLayerIds } from "@/shared/lib/config/layers";
import { getPopupMarkup } from "#/shared/lib/utils/utils";

export function attachInteractivePopups(map: MaplibreMap) {
  interactiveLayerIds.forEach((layerId) => {
    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("click", layerId, (event: maplibregl.MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;

      new maplibregl.Popup({
        closeButton: false,
        maxWidth: "300px",
        offset: 18,
      })
        .setLngLat(event.lngLat)
        .setHTML(getPopupMarkup(feature.properties ?? {}))
        .addTo(map);
    });
  });
}
