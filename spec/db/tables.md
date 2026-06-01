# Database Tables Spec

> Applies from **Phase 3** onward.
> All geometry columns use **SRID 4326** (WGS84 — standard for web maps).

---

## Database Schema Tables

### `regions`

Administrative boundary hierarchy from country down to village.

```sql
CREATE TABLE regions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,          -- e.g. 'darbhanga', 'kusheshwar-asthan'
  name          TEXT NOT NULL,
  name_hi       TEXT,                          -- Hindi name
  level         region_level NOT NULL,
  parent_id     UUID REFERENCES regions(id),   -- NULL for country
  osm_id        BIGINT,                        -- OpenStreetMap relation ID
  census_code   TEXT,                          -- LGD / Census code
  population    INTEGER,
  area_sq_km    NUMERIC(10, 2),
  geometry      GEOMETRY(MULTIPOLYGON, 4326) NOT NULL,
  centroid      GEOMETRY(POINT, 4326),         -- precomputed for fast label placement
  bbox          GEOMETRY(POLYGON, 4326),       -- precomputed bounding box
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_regions_parent   ON regions(parent_id);
CREATE INDEX idx_regions_level    ON regions(level);
CREATE INDEX idx_regions_slug     ON regions(slug);
CREATE INDEX idx_regions_geom     ON regions USING GIST(geometry);
CREATE INDEX idx_regions_centroid ON regions USING GIST(centroid);
CREATE INDEX idx_regions_bbox     ON regions USING GIST(bbox);
```

---

### `infrastructure_features`

All infrastructure features: roads, hospitals, schools, power lines, flood zones, etc.

```sql
CREATE TABLE infrastructure_features (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  osm_id          BIGINT,                        -- NULL for non-OSM sources
  name            TEXT,
  name_hi         TEXT,
  category        infra_category NOT NULL,
  layer_id        TEXT NOT NULL,                 -- e.g. 'flood-risk', 'road-quality'
  geom_type       layer_type NOT NULL,
  geometry        GEOMETRY(GEOMETRY, 4326) NOT NULL,  -- accepts any geometry type
  region_id       UUID REFERENCES regions(id),   -- smallest enclosing region
  properties      JSONB NOT NULL DEFAULT '{}',   -- flexible category-specific attributes
  source          data_source NOT NULL,
  source_date     DATE,                          -- when data was collected
  verified        BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_infra_geom       ON infrastructure_features USING GIST(geometry);
CREATE INDEX idx_infra_category   ON infrastructure_features(category);
CREATE INDEX idx_infra_layer      ON infrastructure_features(layer_id);
CREATE INDEX idx_infra_region     ON infrastructure_features(region_id);
CREATE INDEX idx_infra_source     ON infrastructure_features(source);
CREATE INDEX idx_infra_props      ON infrastructure_features USING GIN(properties);

-- Partial index for verified features only (used in public-facing queries)
CREATE INDEX idx_infra_verified   ON infrastructure_features(category) WHERE verified = true;
```

**`properties` JSONB examples by category:**

```jsonc
// Road
{ "road_class": "primary", "surface": "paved", "width_m": 7, "pmgsy": true, "seasonal_cut": false }

// Healthcare
{ "facility_type": "PHC", "beds": 30, "emergency": true, "ambulance": true, "functional": true }

// Flood zone
{ "return_period_years": 5, "max_depth_m": 2.1, "affected_villages": 12, "embankment": false }

// School
{ "level": "primary", "medium": "Hindi", "students": 240, "internet": false, "functional": true }

// Power line
{ "voltage_kv": 33, "condition": "good", "last_inspected": "2024-09-01" }
```

---

### `infrastructure_scores`

Computed intelligence scores per region per category. Recalculated periodically.

```sql
CREATE TABLE infrastructure_scores (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id     UUID NOT NULL REFERENCES regions(id),
  category      infra_category NOT NULL,
  score         NUMERIC(5, 2) NOT NULL,   -- 0.00 to 100.00
  level         score_level NOT NULL,      -- derived from score thresholds
  components    JSONB NOT NULL DEFAULT '{}', -- breakdown of score components
  computed_at   TIMESTAMPTZ DEFAULT now(),
  valid_until   TIMESTAMPTZ,               -- NULL = always valid until recomputed
  algorithm_version TEXT NOT NULL DEFAULT '1.0',

  CONSTRAINT uq_score_region_category UNIQUE (region_id, category)
);

CREATE INDEX idx_scores_region   ON infrastructure_scores(region_id);
CREATE INDEX idx_scores_category ON infrastructure_scores(category);
CREATE INDEX idx_scores_level    ON infrastructure_scores(level);
```

**`components` JSONB example (flood score):**

```jsonc
{
  "flood_zone_coverage_pct": 67.4,
  "embankment_protection": 0.2,
  "road_seasonal_isolation": 0.8,
  "evacuation_route_score": 0.3,
  "historical_event_frequency": 4,
}
```

---

### `layers`

Registry of all available intelligence layers. Mirrors `src/data/layers.ts` in frontend.

```sql
CREATE TABLE layers (
  id            TEXT PRIMARY KEY,              -- e.g. 'flood-risk', 'road-quality'
  name          TEXT NOT NULL,
  description   TEXT,
  category      infra_category NOT NULL,
  geom_type     layer_type NOT NULL,
  min_zoom      SMALLINT NOT NULL DEFAULT 6,
  max_zoom      SMALLINT NOT NULL DEFAULT 18,
  style_config  JSONB NOT NULL DEFAULT '{}',   -- MapLibre paint/layout config
  data_source   data_source NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  phase_added   SMALLINT NOT NULL DEFAULT 1,   -- which platform phase introduced it
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_layers_category ON layers(category);
CREATE INDEX idx_layers_active   ON layers(is_active);
```

---

### `data_imports`

Audit log for all data ingestion runs (OSM downloads, census imports, etc.).

```sql
CREATE TABLE data_imports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source          data_source NOT NULL,
  layer_id        TEXT REFERENCES layers(id),
  region_id       UUID REFERENCES regions(id),
  status          TEXT NOT NULL CHECK (status IN ('pending', 'running', 'success', 'failed')),
  records_added   INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_deleted INTEGER DEFAULT 0,
  error_message   TEXT,
  started_at      TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  metadata        JSONB DEFAULT '{}'
);

CREATE INDEX idx_imports_source ON data_imports(source);
CREATE INDEX idx_imports_status ON data_imports(status);
```

---

### `scenarios` (Phase 5)

Development simulation scenarios.

```sql
CREATE TABLE scenarios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  region_id     UUID NOT NULL REFERENCES regions(id),
  type          scenario_type NOT NULL,
  base_year     SMALLINT NOT NULL,
  target_year   SMALLINT NOT NULL,
  investments   JSONB NOT NULL DEFAULT '[]',  -- array of investment items
  outcomes      JSONB,                         -- computed outcomes (NULL until simulated)
  is_public     BOOLEAN DEFAULT false,
  created_by    TEXT,                          -- user/org identifier (Phase 5 has auth)
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_scenarios_region ON scenarios(region_id);
CREATE INDEX idx_scenarios_type   ON scenarios(type);
```

**`investments` JSONB example:**

```jsonc
[
  {
    "category": "road",
    "description": "Upgrade Biraul-Darbhanga road to 2-lane paved",
    "cost_crore": 45,
  },
  {
    "category": "flood",
    "description": "Embankment reinforcement Kusheshwar Asthan",
    "cost_crore": 120,
  },
]
```

---

### `tile_cache` (Phase 3 — if not using Martin/PMTiles externally)

```sql
CREATE TABLE tile_cache (
  z             SMALLINT NOT NULL,
  x             INTEGER NOT NULL,
  y             INTEGER NOT NULL,
  layer_id      TEXT NOT NULL REFERENCES layers(id),
  tile_data     BYTEA NOT NULL,               -- gzip-compressed MVT
  etag          TEXT NOT NULL,
  generated_at  TIMESTAMPTZ DEFAULT now(),
  expires_at    TIMESTAMPTZ,

  PRIMARY KEY (z, x, y, layer_id)
);

CREATE INDEX idx_tile_expires ON tile_cache(expires_at);
```

> **Note**: In production prefer Martin tile server + PMTiles object storage over DB-backed tile cache.
