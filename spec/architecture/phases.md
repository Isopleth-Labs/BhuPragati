# Phases Roadmap Spec

## Phase Overview

```mermaid
gantt
    title Better Bharat Map — Development Phases
    dateFormat  YYYY-Q[Q]
    axisFormat  %Y Q%q

    section Foundation
    Phase 1 - GIS Foundation         :p1, 2025-Q1, 90d
    Phase 2 - Real Geo Intelligence  :p2, after p1, 90d

    section Intelligence
    Phase 3 - Infra Intelligence Engine :p3, after p2, 120d
    Phase 4 - Darbhanga Digital Twin    :p4, after p3, 120d

    section Simulation
    Phase 5 - Dev Simulation Engine  :p5, after p4, 150d
    Phase 6 - 3D Infra Visualization :p6, after p5, 120d

    section Scale
    Phase 7 - State-Level Expansion  :p7, after p6, 180d
    Phase 8 - India Infra Network    :p8, after p7, 180d

    section AI
    Phase 9 - AI Planning Platform   :p9, after p8, 240d
    Phase 10 - Better Bharat Earth   :p10, after p9, 365d
```

---

## Phase 1 — GIS Foundation & Intelligence Dashboard

**Deployment**: Static (GitHub Pages)
**Stack**: React + Vite, shadcn, MapLibre, GeoJSON

### Goals

- Establish the visual and technical foundation
- Render India map with state/district boundaries
- Build the layer toggle system
- Homepage with mission and vision
- Navigation hierarchy (Earth → India → Bihar → Darbhanga)

### Deliverables

- [ ] Vite-built React SPA deployed to GitHub Pages
- [ ] MapLibre integrated with OSM base tiles
- [ ] India + Bihar + Darbhanga GeoJSON boundaries
- [ ] Layer panel with category grouping
- [ ] Earth→Village zoom hierarchy component
- [ ] Homepage / landing page
- [ ] About / Vision page
- [ ] Design system with shadcn + system theme

### Acceptance Criteria

- App loads in < 3s on a mobile 4G connection
- Map renders Darbhanga district with correct boundary
- At least 3 infrastructure layers toggleable
- Responsive across mobile, tablet, desktop

---

## Phase 2 — Real Geographic Intelligence

**Deployment**: Static (GitHub Pages)
**Stack**: Phase 1 + OSM Overpass data extraction scripts

### Goals

- Replace placeholder GeoJSON with real OSM data
- Add settlement hierarchy (district → block → panchayat → village)
- Add road network layer from OSM
- Add river/waterway layer from OSM
- Infrastructure presence markers (hospitals, schools, police stations)

### Deliverables

- [ ] OSM data extraction scripts (Overpass API queries)
- [ ] Processed GeoJSON for all 7 pilot blocks
- [ ] Road network layer (classified by type)
- [ ] River/waterway layer
- [ ] Settlement points layer
- [ ] Block-level boundary polygons
- [ ] Popup with feature attributes

---

## Phase 3 — Infrastructure Intelligence Engine

**Deployment**: Server-backed (Vercel / Railway)
**Stack**: Phase 2 + FastAPI, PostgreSQL + PostGIS

### Goals

- Move from static GeoJSON to dynamic API
- Introduce infrastructure scoring algorithms
- Flood risk composite score
- Healthcare accessibility score
- Road connectivity index

### Deliverables

- [ ] FastAPI backend with PostGIS
- [ ] Infrastructure scoring engine
- [ ] Dynamic tile generation (Martin)
- [ ] Search / geocoding integration
- [ ] Intelligence dashboard with real metrics

---

## Phase 4 — Darbhanga Digital Twin

**Deployment**: Server-backed
**Stack**: Phase 3 + Deck.GL

### Goals

- Complete digital twin of Darbhanga district
- All 7 pilot blocks fully mapped
- Real infrastructure condition data
- Historical flood data overlay
- Seasonal connectivity analysis

---

## Phase 5 — Development Simulation Engine

**Deployment**: Server-backed
**Stack**: Phase 4 + simulation engine

### Goals

- "What-if" infrastructure investment scenarios
- Before/after comparison views
- Outcome projection models
- Development gap identification

---

## Phase 6 — 3D Infrastructure Visualization

**Deployment**: Server-backed
**Stack**: Phase 5 + Three.js / Deck.GL 3D

### Goals

- 3D terrain rendering
- Elevated road/river visualization
- Flood inundation 3D simulation
- Infrastructure density heatmaps in 3D

---

## Phase 7 — State-Level Expansion

**Scope**: Full Bihar state
**Goals**: Expand from Darbhanga to all 38 Bihar districts

---

## Phase 8 — India Infrastructure Network

**Scope**: All Indian states
**Goals**: National-scale infrastructure intelligence

---

## Phase 9 — AI-Assisted Planning Platform

**Scope**: National + AI layer
**Goals**: LLM-assisted infrastructure planning recommendations

---

## Phase 10 — Better Bharat Earth

**Scope**: Full platform
**Goals**: Earth-scale visualization, village-level planning for all of India
