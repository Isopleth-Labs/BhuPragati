# Test Tracker

Tracks all tests that must pass for each spec domain. Update checkboxes as tests are written and passing.

---

## Legend

| Symbol | Meaning |
| ------ | ------- |
| `[ ]`  | Not written |
| `[/]`  | Written, failing |
| `[x]`  | Written, passing |
| `[!]`  | Blocked / cannot test yet |

---

## Test Infrastructure

- [ ] Testing framework configured (`vitest` recommended)
- [ ] `@testing-library/react` installed for component tests
- [ ] Test scripts in `package.json` (`test`, `test:unit`, `test:integration`, `test:e2e`)
- [ ] CI test pipeline (GitHub Actions)
- [ ] Test coverage reporting configured (coverage badge)

---

## 1. Type Safety

### 1.1 Type Definitions

- [ ] `Region` type matches spec contract (id, slug, name, name_hi, level, parentId, centroid, bbox, zoom)
- [ ] `RegionLevel` enum matches spec (`country | state | district | block | panchayat | village`)
- [ ] `LayerConfig` interface matches spec (id, name, description, category, geomType, geojsonPath, minZoom, maxZoom, paint, layout, scoreType, defaultVisible, phase)
- [ ] `InfraCategory` type matches spec (`flood | road | healthcare | agriculture | railway | electricity | education | public_safety`)

### 1.2 TypeScript Strict Mode

- [ ] `tsconfig.json` has `strict: true`
- [ ] No `@ts-ignore` in production code
- [ ] No `any` types in production code (except necessary third-party boundaries)

---

## 2. Data Integrity

### 2.1 Region Data

- [ ] All `REGIONS` entries have valid `id`, `slug`, `name`, `level`
- [ ] All `REGIONS` entries have valid `centroid` (lon/lat within India bounds)
- [ ] All `REGIONS` entries have valid `bbox` (north > south, east > west)
- [ ] All `REGIONS` entries with `parentId` reference a valid parent
- [ ] Region hierarchy is consistent (country → state → district → block)
- [ ] Pilot blocks: exactly 7 blocks under Darbhanga (Kusheshwar Asthan, Biraul, Ghanshyampur, Kiratpur, Benipur, Hayaghat, Jale)

### 2.2 Layer Registry

- [ ] All layer configs have unique `id`
- [ ] All layer configs have valid `category` from `InfraCategory`
- [ ] All layer configs have valid `geomType` (`polygon | linestring | point`)
- [ ] All layer configs have `scoreType` (`risk | quality`)
- [ ] All layer configs reference a valid `geojsonPath`
- [ ] All Phase 1 layers have `phase: 1`
- [ ] Layer IDs are stable (match future API endpoint names)

### 2.3 Map Config

- [ ] `MAP_STYLES.light` is a valid MapLibre style spec (Carto basemap)
- [ ] `MAP_STYLES.dark` is a valid MapLibre style spec (Carto dark)
- [ ] `INITIAL_VIEWPORT` — longitude and latitude within Darbhanga bounds
- [ ] `ZOOM_LEVELS` matches spec contract

### 2.4 GeoJSON Validation

- [ ] All GeoJSON files in `public/geojson/` are valid GeoJSON
- [ ] All GeoJSON files have correct geometry type for their layer
- [ ] GeoJSON features have required properties per spec (e.g., flood zones have `return_period_years`, `max_depth_m`, `affected_villages_count`)
- [ ] No duplicate feature IDs within a single GeoJSON file

---

## 3. Map & Components Tests

### 3.1 Map Engine

- [ ] `MapCanvas` mounts without runtime errors (`TEST-Map-001`)
- [ ] Theme → map style sync (`TEST-Map-002`)
- [ ] `addInfraLayer()` loads GeoJSON and adds source & layer (`TEST-Map-003`)
- [ ] Layer toggle uses `setLayoutProperty` without re-parsing source (`TEST-Map-004`)
- [ ] Popup registers and renders content for click (`TEST-Map-005`)

### 3.2 UI Components

- [ ] `ThemeToggle` toggles class on `html` (`TEST-UI-001`)
- [ ] `LayerPanel` renders category tabs and toggles (`TEST-UI-002`)
- [ ] `ZoomHierarchy` breadcrumb fly-to behavior (`TEST-UI-003`)

---

## 4. Integration & E2E

- [ ] Full user flow: Landing → Zoom → /map HUD slides in (`E2E-001`)
- [ ] Region deep-link: link to `#/regions/kusheshwar-asthan` loads region and sidebar (`E2E-002`)
- [ ] Multi-layer comparison UX with overlap rendering (`E2E-003`)

---

## 5. Automation & CI

- [ ] Emit JUnit or JSON reports from unit/integration tests for AI parsing
- [ ] CI job to run `test:unit` and `test:e2e` and upload artifacts
- [ ] Auto-create `ISSUE-` when CI finds new failing tests (via `ai-assistant`)

---

## 6. How to mark tests

- Developers write tests and mark the checkbox once tests are written and passing.
- For automated updates, CI artifacts or an `ai-assistant` may update statuses; such updates must include `Notes: updated-by=ai-assistant`.

---

If you'd like, I can now:
- scaffold `vitest` + `@testing-library/react` and add `TEST-Map-001` and `TEST-UI-001` skeletons,
- or create a GitHub Action template to run tests and upload results for AI parsing.
