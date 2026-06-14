import data from './data/electricityData.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export const ElectricityService = {
  getData(): FeatureCollection<Geometry, GeoJsonProperties> {
    return data as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
