import infrastructureNodesData from './data/infrastructureNodes.json';
import regionalRiversData from './data/regionalRivers.json';
import settlementsData from './data/settlements.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export const SettlementsService = {
  getInfrastructureNodes(): FeatureCollection<Geometry, GeoJsonProperties> {
    return infrastructureNodesData as FeatureCollection<Geometry, GeoJsonProperties>;
  },
  getRegionalRivers(): FeatureCollection<Geometry, GeoJsonProperties> {
    return regionalRiversData as FeatureCollection<Geometry, GeoJsonProperties>;
  },
  getSettlements(): FeatureCollection<Geometry, GeoJsonProperties> {
    return settlementsData as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
