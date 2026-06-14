import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import data from "./data/agricultureData.json";

export const AgricultureService = {
	getData(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>;
	},
};
