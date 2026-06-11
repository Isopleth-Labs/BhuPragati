import data from './data/analysisGrid.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export class AnalysisGridService {
  static getGrid(): FeatureCollection<Geometry, GeoJsonProperties> {
    return data as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
