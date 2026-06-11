import data from './data/floodRiskData.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export class FloodService {
  static getRiskData(): FeatureCollection<Geometry, GeoJsonProperties> {
    return data as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
