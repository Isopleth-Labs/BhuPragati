import type { Map as MaplibreMap } from "maplibre-gl";
import { SATELLITE_TILE_URL } from "@/shared/lib/config/mapConfig";
import { addLayer, getFirstSymbolLayerId } from "@/shared";

type FogOptions = Record<string, string | number>;

type ExtendedMap = MaplibreMap & { setFog?: (opts: FogOptions) => void };

export function addBasemapOverlay(map: ExtendedMap) {
  if (!map.getSource("satellite-texture")) {
    map.addSource("satellite-texture", {
      type: "raster",
      tiles: [SATELLITE_TILE_URL],
      tileSize: 256,
      attribution: "Tiles (c) Esri",
    });
  }

  addLayer(
    map,
    {
      id: "satellite-texture",
      type: "raster",
      source: "satellite-texture",
      paint: {
        "raster-opacity": 0.28,
        "raster-brightness-min": 0,
        "raster-brightness-max": 0.34,
        "raster-contrast": 0.36,
        "raster-saturation": -0.72,
        "raster-fade-duration": 450,
      },
    },
    getFirstSymbolLayerId(map),
  );

  if (typeof map.setFog === "function") {
    map.setFog({
      color: "#06131e",
      "high-color": "#0f3148",
      "horizon-blend": 0.18,
      "space-color": "#02050a",
      "star-intensity": 0,
    });
  }
}
