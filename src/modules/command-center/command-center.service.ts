import data from "./data/commandCenter.json";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export const CommandCenterService = {
	getCenter(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>;
	},
};
