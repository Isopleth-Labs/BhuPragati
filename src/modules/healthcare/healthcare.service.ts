import data from './data/healthcareData.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export class HealthcareService {
  static getData(): FeatureCollection<Geometry, GeoJsonProperties> {
    return data as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
