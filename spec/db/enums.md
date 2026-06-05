# Database Enums Spec

> Applies from **Phase 3** onward.
> All geometry columns use **SRID 4326** (WGS84 — standard for web maps).

---

## Technology Stack

| Component         | Choice                   | Reason                            |
| ----------------- | ------------------------ | --------------------------------- |
| RDBMS             | PostgreSQL 16            | ACID, mature ecosystem            |
| Spatial extension | PostGIS 3.4              | Industry standard for geo queries |
| Migrations        | golang-migrate or Flyway | Forward-only versioned migrations |
| Connection pool   | PgBouncer                | Reduce connection overhead        |

---

## Custom ENUM Types

```sql
-- Geographic hierarchy level
CREATE TYPE region_level AS ENUM (
  'country',
  'state',
  'district',
  'block',
  'panchayat',
  'village'
);

-- Infrastructure category
CREATE TYPE infra_category AS ENUM (
  'flood',
  'road',
  'healthcare',
  'agriculture',
  'railway',
  'electricity',
  'education',
  'public_safety'
);

-- Infrastructure layer type
CREATE TYPE layer_type AS ENUM (
  'polygon',       -- areas (flood zones, admin boundaries)
  'linestring',    -- roads, rivers, power lines
  'point'          -- hospitals, schools, police stations
);

-- Risk / quality scoring level
CREATE TYPE score_level AS ENUM (
  'very_low',
  'low',
  'moderate',
  'high',
  'very_high'
);

-- Data source type
CREATE TYPE data_source AS ENUM (
  'osm',               -- OpenStreetMap
  'census',            -- Census of India
  'ministry',          -- Government ministry data
  'survey',            -- Field survey
  'satellite',         -- Satellite-derived
  'manual'             -- Manually entered
);

-- Scenario type for simulation engine (Phase 5)
CREATE TYPE scenario_type AS ENUM (
  'baseline',
  'current_plan',
  'alternative',
  'optimistic',
  'pessimistic'
);
```
