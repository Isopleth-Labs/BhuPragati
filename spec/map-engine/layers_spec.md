# Infrastructure Layers Spec

## Layer Registry Contract

```typescript
// src/types/layer.ts
export interface LayerConfig {
  id: string; // 'flood-risk' — stable ID used in URL, DB, filenames
  name: string; // 'Flood Risk'
  description: string;
  category: InfraCategory;
  geomType: "polygon" | "linestring" | "point";
  geojsonPath: string; // relative to /public/geojson/
  minZoom: number;
  maxZoom: number;
  paint: maplibregl.LayerSpecification["paint"];
  layout?: maplibregl.LayerSpecification["layout"];
  scoreType: "risk" | "quality"; // inverts color scale for risk
  defaultVisible: boolean;
  phase: number; // minimum platform phase where this is available
}
```

---

## Category 1: Flood Intelligence

### Layer: Flood Risk Zones

```typescript
{
  id: 'flood-risk',
  name: 'Flood Risk Zones',
  description: 'Areas with assessed flood inundation risk by return period',
  category: 'flood',
  geomType: 'polygon',
  geojsonPath: 'darbhanga/flood-zones.geojson',
  minZoom: 6,
  maxZoom: 18,
  scoreType: 'risk',
  defaultVisible: false,
  phase: 1,
  paint: {
    'fill-color': [
      'match', ['get', 'return_period_years'],
      5,   '#1D4ED8',  // 5-year flood: dark blue (most frequent)
      10,  '#3B82F6',
      25,  '#60A5FA',
      100, '#93C5FD',  // 100-year flood: light blue (rarest)
      '#BFDBFE'
    ],
    'fill-opacity': 0.45,
    'fill-outline-color': '#1E40AF',
  }
}
```

**GeoJSON Properties:**

```json
{
  "return_period_years": 5,
  "max_depth_m": 2.1,
  "affected_villages_count": 14,
  "embankment_protected": false,
  "source": "CWC",
  "source_date": "2023-09-01"
}
```

### Layer: Rivers & Waterways

```typescript
{
  id: 'rivers',
  name: 'Rivers & Waterways',
  category: 'flood',
  geomType: 'linestring',
  paint: {
    'line-color': '#3B82F6',
    'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 14, 4],
  }
}
```

### Layer: Embankments

```typescript
{
  id: 'embankments',
  name: 'Flood Embankments',
  category: 'flood',
  geomType: 'linestring',
  paint: {
    'line-color': ['match', ['get', 'condition'], 'good', '#22C55E', 'poor', '#EF4444', '#F59E0B'],
    'line-width': 3,
  }
}
```

---

## Category 2: Road & Connectivity

### Layer: Road Network

```typescript
{
  id: 'road-network',
  name: 'Road Network',
  category: 'road',
  geomType: 'linestring',
  minZoom: 8,
  phase: 2,
  paint: {
    'line-color': [
      'match', ['get', 'surface'],
      'paved',   '#22C55E',
      'gravel',  '#F59E0B',
      'dirt',    '#EF4444',
      '#94A3B8'
    ],
    'line-width': [
      'interpolate', ['linear'], ['zoom'],
      8, ['match', ['get', 'road_class'], 'primary', 2, 1],
      14, ['match', ['get', 'road_class'], 'primary', 5, 'secondary', 3, 2]
    ],
  }
}
```

**GeoJSON Properties:**

```json
{
  "road_class": "primary|secondary|tertiary|unclassified|track",
  "surface": "paved|gravel|dirt|unknown",
  "width_m": 7,
  "pmgsy": true,
  "seasonal_cut": false,
  "bridge_dependent": false
}
```

### Layer: PMGSY Roads

```typescript
{
  id: 'pmgsy-roads',
  name: 'PMGSY Roads',
  description: 'Pradhan Mantri Gram Sadak Yojana rural connectivity roads',
  category: 'road',
  geomType: 'linestring',
  paint: { 'line-color': '#8B5CF6', 'line-width': 2, 'line-dasharray': [2, 2] }
}
```

### Layer: Village Accessibility Points

```typescript
{
  id: 'village-access',
  name: 'Village Accessibility',
  description: 'Villages color-coded by road accessibility',
  category: 'road',
  geomType: 'point',
  minZoom: 10,
  paint: {
    'circle-color': [
      'match', ['get', 'access_level'],
      'connected',          '#22C55E',
      'seasonal',           '#F59E0B',
      'unconnected',        '#EF4444',
      '#94A3B8'
    ],
    'circle-radius': 5,
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 1,
  }
}
```

---

## Category 3: Healthcare Intelligence

### Layer: Healthcare Facilities

```typescript
{
  id: 'healthcare-facilities',
  name: 'Healthcare Facilities',
  category: 'healthcare',
  geomType: 'point',
  minZoom: 8,
  paint: {
    'circle-color': [
      'match', ['get', 'facility_type'],
      'district-hospital', '#7F1D1D',
      'sub-district-hospital', '#DC2626',
      'PHC',     '#EF4444',
      'APHC',    '#F87171',
      'sub-centre', '#FCA5A5',
      '#94A3B8'
    ],
    'circle-radius': [
      'match', ['get', 'facility_type'],
      'district-hospital', 10,
      'PHC', 7,
      5
    ],
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 2,
  }
}
```

**GeoJSON Properties:**

```json
{
  "facility_type": "PHC|APHC|sub-centre|district-hospital|sub-district-hospital",
  "beds": 30,
  "emergency": true,
  "ambulance": false,
  "functional": true,
  "doctor_available": true,
  "source": "NHM Bihar",
  "source_date": "2024-01-01"
}
```

### Layer: Healthcare Accessibility Zones

```typescript
{
  id: 'healthcare-access-zones',
  name: 'Healthcare Catchment Areas',
  description: '5km, 10km buffer zones around functional PHCs',
  category: 'healthcare',
  geomType: 'polygon',
  paint: {
    'fill-color': '#EF4444',
    'fill-opacity': 0.08,
    'fill-outline-color': '#DC2626',
  }
}
```

---

## Category 4: Agriculture Intelligence

### Layer: Irrigation Coverage

```typescript
{
  id: 'irrigation-coverage',
  name: 'Irrigation Coverage',
  category: 'agriculture',
  geomType: 'polygon',
  paint: {
    'fill-color': [
      'interpolate', ['linear'], ['get', 'irrigation_pct'],
      0,   '#FEF3C7',
      50,  '#86EFAC',
      100, '#15803D',
    ],
    'fill-opacity': 0.5,
  }
}
```

### Layer: Makhana Cultivation Regions

```typescript
{
  id: 'makhana-regions',
  name: 'Makhana Cultivation',
  description: 'Water chestnut (Makhana/Fox Nut) cultivation areas — Bihar-specific',
  category: 'agriculture',
  geomType: 'polygon',
  paint: { 'fill-color': '#4ADE80', 'fill-opacity': 0.4 }
}
```

### Layer: Flood Crop Risk

```typescript
{
  id: 'flood-crop-risk',
  name: 'Flood Crop Risk',
  description: 'Agricultural land within 5-year flood zones',
  category: 'agriculture',
  geomType: 'polygon',
  paint: { 'fill-color': '#F97316', 'fill-opacity': 0.45 }
}
```

---

## Category 5: Electricity Intelligence

### Layer: Electricity Grid

```typescript
{
  id: 'electricity-grid',
  name: 'Electricity Grid',
  category: 'electricity',
  geomType: 'linestring',
  paint: {
    'line-color': [
      'match', ['get', 'condition'],
      'good',  '#F59E0B',
      'fair',  '#FB923C',
      'poor',  '#EF4444',
      '#94A3B8'
    ],
    'line-width': [
      'match', ['get', 'voltage_kv'],
      132, 3, 33, 2, 11, 1, 1
    ],
  }
}
```

### Layer: Electrification Status (Villages)

```typescript
{
  id: 'electrification-status',
  name: 'Village Electrification',
  category: 'electricity',
  geomType: 'point',
  minZoom: 10,
  paint: {
    'circle-color': [
      'match', ['get', 'status'],
      'fully-electrified',    '#22C55E',
      'partially-electrified','#F59E0B',
      'un-electrified',       '#EF4444',
      '#94A3B8'
    ],
    'circle-radius': 5,
  }
}
```

---

## Category 6: Education Intelligence

### Layer: Schools

```typescript
{
  id: 'schools',
  name: 'Schools',
  category: 'education',
  geomType: 'point',
  minZoom: 10,
  paint: {
    'circle-color': [
      'match', ['get', 'level'],
      'primary',   '#A78BFA',
      'middle',    '#8B5CF6',
      'secondary', '#7C3AED',
      'higher-secondary', '#6D28D9',
      '#94A3B8'
    ],
    'circle-radius': 5,
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 1,
  }
}
```

---

## Category 7: Public Safety

### Layer: Police Stations

```typescript
{
  id: 'police-stations',
  name: 'Police Stations',
  category: 'public_safety',
  geomType: 'point',
  paint: {
    'circle-color': '#1D4ED8',
    'circle-radius': 6,
    'circle-stroke-color': '#FFFFFF',
    'circle-stroke-width': 2,
  }
}
```

---

## Scoring Algorithms

### Flood Risk Score (0 = no risk, 100 = extreme risk)

```
score = (
  flood_zone_coverage_pct     × 0.35 +
  (1 - embankment_protection) × 0.25 +
  road_seasonal_isolation      × 0.20 +
  (1 - evacuation_score)       × 0.10 +
  historical_frequency_score   × 0.10
) × 100
```

### Healthcare Quality Score (0 = no access, 100 = excellent access)

```
score = (
  pct_population_within_5km_of_PHC  × 0.40 +
  pct_population_within_10km_of_hospital × 0.25 +
  emergency_coverage_score          × 0.20 +
  ambulance_coverage_score          × 0.15
) × 100
```

### Road Quality Score (0 = poor, 100 = excellent)

```
score = (
  pct_paved_roads                   × 0.35 +
  pct_connected_villages            × 0.30 +
  (1 - pct_seasonal_cut_roads)      × 0.20 +
  pmgsy_coverage_score              × 0.15
) × 100
```
