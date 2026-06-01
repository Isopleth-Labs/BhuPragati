# Database Repositories & Migrations Spec

> Applies from **Phase 3** onward.
> Outlines spatial database access queries and migration management.

---

## Spatial Query Patterns (Repositories)

### Features within a region boundary

```sql
SELECT f.*
FROM infrastructure_features f
JOIN regions r ON r.id = $1
WHERE f.category = $2
  AND ST_Within(f.geometry, r.geometry);
```

### Features within radius of a point (accessibility score)

```sql
SELECT f.*, ST_Distance(f.geometry::geography, ST_MakePoint($lon, $lat)::geography) AS distance_m
FROM infrastructure_features f
WHERE f.category = 'healthcare'
  AND ST_DWithin(f.geometry::geography, ST_MakePoint($lon, $lat)::geography, 10000)  -- 10km
ORDER BY distance_m;
```

### Region score summary

```sql
SELECT r.name, r.level, s.category, s.score, s.level
FROM regions r
JOIN infrastructure_scores s ON s.region_id = r.id
WHERE r.parent_id = $district_id
ORDER BY r.name, s.category;
```

---

## Migration Strategy

```
migrations/
├── 001_create_enums.sql
├── 002_create_regions.sql
├── 003_create_infrastructure_features.sql
├── 004_create_infrastructure_scores.sql
├── 005_create_layers.sql
├── 006_create_data_imports.sql
├── 007_seed_layers_registry.sql
├── 008_seed_india_regions.sql
└── 009_seed_darbhanga_regions.sql
```

Rules:

- All migrations are **forward-only** (no down migrations in production)
- Every migration is **idempotent** where possible (`CREATE TABLE IF NOT EXISTS`, `INSERT ... ON CONFLICT DO NOTHING`)
- PostGIS extension created in migration 001: `CREATE EXTENSION IF NOT EXISTS postgis;`
