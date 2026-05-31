import maplibregl, { Map } from "maplibre-gl";
import { interactiveLayerIds } from "../../../config/layers";
import { getPopupMarkup } from "../utils";

export function attachInteractivePopups(map: Map) {
  interactiveLayerIds.forEach((layerId) => {
    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("click", layerId, (event: any) => {
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
