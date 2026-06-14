import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import data from "./data/electricityData.json";

export const ElectricityService = {
	getData(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>;
	},
};
