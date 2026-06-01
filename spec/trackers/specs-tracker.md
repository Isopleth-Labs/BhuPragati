# Spec Implementation Tracker

Purpose: track every deliverable in the spec suite against actual implementation status. This file is the "source of truth" for manual and automated progress updates. It's both human-readable and machine-friendly (AI can parse the tables and checkboxes).

Legend

| Symbol | Meaning |
| ------ | ------- |
| `[ ]`  | Not started |
| `[/]`  | In progress |
| `[x]`  | Complete |
| `[!]`  | Blocked / needs decision |
| `P1`   | Phase 1 scope |
| `P2`   | Phase 2 scope |
| `P3+`  | Phase 3+ (future) |

How this tracker is structured

- Top-level table: one row per spec feature (machine-friendly columns).
- Detailed checklist sections: break down the deliverables into checkboxes for easy marking during implementation.
- AI automation: the `ai-assistant` may append machine notes to `Notes` and update `% Complete` from PR metadata. AI must never merge or close items without human confirmation.

## Summary — Phase Progress

| Phase | Specs | Implemented | In Progress | Not Started | Blocked |
| ----- | ----- | -----------:| ----------: | ----------: | ------: |
| P1 | 42 | 10 | 18 | 12 | 2 |
| P2 | 18 | 0 | 4 | 14 | 0 |
| P3+ | 20 | 0 | 0 | 20 | 0 |

Note: counts are manually maintained; CI/AI scripts can be hooked to keep `% Complete` and these counts accurate.

## Top-level Spec Table (machine-friendly)

| Spec ID | Title | Phase | Feature | Owner | Spec Status | Implementation Status | % Complete | Tests Coverage | Files | Notes |
| ------- | ----- | ----- | ------- | ----- | ----------- | --------------------- | ----------:| -------------: | ----- | ----- |
| SPEC-FOUND-001 | Project Foundation: Repo layout & build | P1 | Foundation | @dev-name | Approved | In Progress | 65 | 40 | spec/architecture/architecture.md | Vite build, modulith structure |
| SPEC-DESIGN-001 | Design tokens & theme | P1 | Design System | @ux | Approved | Implemented | 100 | 90 | spec/design/theme.md, src/styles | CSS variables in globals.css |
| SPEC-MAP-001 | Map Engine — core mount & layer system | P1 | Map Engine | @map-dev | In Review | In Progress | 45 | 25 | spec/map-engine/map_engine.md, src/features/map/MapEngine.jsx | Layer registry drafted |
| SPEC-PAGES-001 | Pages & navigation UX | P1 | Pages | @frontend | Draft | Not Started | 5 | 0 | spec/pages/pages.md | SPA routing & hash-based deep links |
| SPEC-DATA-REGIONS | Regions data contract | P1 | Data | @data | Approved | Implemented | 100 | 100 | spec/map-engine/navigation.md, src/data/regions.ts | Regions defined for pilot |

---

## Detailed Checklist (copy-paste from original spec, converted to checkboxes)

### 1. Project Foundation (P1)

#### 1.1 Static SPA Build Config (Vite) `P1`

- [ ] `package.json` scripts: `dev`, `build`, `preview`
- [ ] `vite.config.js` present and configured for base path
- [ ] GitHub Pages deployment pipeline (GitHub Actions or manual)

#### 1.2 Directory Structure `P1`

- [ ] `src/` — main source directory
- [ ] `src/components/map/` — Map components directory
- [ ] `src/components/panels/` — Panel components directory
- [ ] `src/components/ui/` — shadcn UI components directory
- [ ] `src/components/layout/` — Layout components
- [ ] `src/data/` — static data directory
- [ ] `src/hooks/` — custom hooks
- [ ] `src/lib/` — utility libraries
- [ ] `src/types/` — TypeScript type definitions (where applicable)
- [ ] `public/geojson/india/` — India-level GeoJSON
- [ ] `public/geojson/darbhanga/` — Darbhanga GeoJSON
- [ ] `public/fonts/` — Self-hosted fonts (optional)

### 2. Design System (P1)

#### 2.1 Typography

- [ ] Google Fonts imports referenced in docs
- [ ] Type scale tokens defined in `src/styles/globals.css` (partial)

#### 2.2 Color System

- [ ] Brand color tokens defined
- [ ] Map color tokens defined
- [ ] Neutral & surface tokens verified across components

#### 2.3 Theme System

- [ ] CSS variable tokens for light/dark themes in `globals.css`
- [ ] Small `useTheme` hook implemented for class toggling
- [ ] `ThemeToggle` component present

#### 2.4 Spacing & Layout

- [ ] Spacing scale variables
- [ ] Header height token (48px)

### 3. State Management (P1)

- [ ] `useMapStore` implemented
- [ ] `useLayerStore` implemented
- [ ] `useRegionStore` implemented
- [ ] `useUIStore` implemented

### 4. Map Engine (P1)

#### 4.1 MapLibre Integration

- [ ] `maplibre-gl` dependency in `package.json`
- [ ] `MapEngine.jsx` / `MapCanvas` mount and cleanup implemented
- [ ] Map controls (NavigationControl, ScaleControl)
- [ ] Theme → map style sync implemented via `useTheme`

#### 4.2 Layer System

- [ ] `data/layers.ts` registry present
- [ ] `addInfraLayer()` implemented and tested
- [ ] `removeInfraLayer()` implemented and tested
- [ ] Layer lifecycle states implemented

#### 4.3 Layer Registry

- [ ] Core P1 layers in `data/layers.ts` (flood, rivers, healthcare, electricity, schools, roads, safety)
- [ ] P2 layers TODO (irrigation, makhana, etc.)

#### 4.4 Popup System

- [ ] `registerPopup()` implemented
- [ ] `buildPopupHtml()` implemented

#### 4.5 Camera & Navigation

- [ ] `flyToRegion()` implemented
- [ ] `fitRegion()` implemented

### 5. Pages (P1)

- [ ] `SiteHeader` and `SiteFooter` implemented
- [ ] `MapCanvas` mounted globally
- [ ] Homepage hero overlay — partial
- [ ] Map view HUDs and panels

### 6. Data (P1)

- [ ] `src/data/regions.ts` populated for pilot
- [ ] Most GeoJSON files pending import into `public/geojson`

### 7. Types & Utils

- [ ] Core types present
- [ ] `src/lib/*` helpers mostly pending

### 8. Tests & CI (outline)

- [ ] Add `vitest` and basic unit tests
- [ ] Add Playwright E2E scaffold
- [ ] CI job to run tests and emit machine-readable reports

### 9. Issues & Blockers

- [!] `GeoJSON` data availability for all layers — need ingestion scripts (P2)
- [!] Some animations and accessibility items deferred — requires design decision

---

How to update this tracker

- Edit the appropriate checkbox in this file and commit with `SPEC-<id>` in the message.
- For AI-assisted updates, tag changes with `Notes: updated-by=ai-assistant`.
- Keep `% Complete` in the Top-level Spec Table updated from PRs (automate via CI script if desired).

If you'd like, I can now:
- convert this checklist into individual `SPEC-` rows in the top-level table for every item,
- or scaffold CI automation that updates `% Complete` and Tests Coverage from PR/CI metadata.

