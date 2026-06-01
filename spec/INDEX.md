# Better Bharat Map — Spec Index

> Infrastructure Intelligence & Development Simulation Platform
> Pilot Region: Darbhanga District, Bihar

---

## Spec Files

| File                                                         | Domain                                                | Status |
| ------------------------------------------------------------ | ----------------------------------------------------- | ------ |
| [architecture/architecture.md](architecture/architecture.md) | System architecture, deployment topology, data flow   | ✅     |
| [architecture/phases.md](architecture/phases.md)             | Roadmap phases 1–10, scope and milestones             | ✅     |
| [db/enums.md](db/enums.md)                                   | Custom enums, data sources, and category types         | ✅     |
| [db/tables.md](db/tables.md)                                 | Core database schema tables, indexes, and structures  | ✅     |
| [db/repositories.md](db/repositories.md)                     | Spatial query patterns, database access, and migrations| ✅     |
| [db/erd.md](db/erd.md)                                       | Entity relationship diagrams (Mermaid)                | ✅     |
| [db/caching.md](db/caching.md)                               | Caching strategy, layers, TTL policy                  | ✅     |
| [design/design.md](design/design.md)                         | Design system, tokens, typography, component library  | ✅     |
| [design/theme.md](design/theme.md)                           | Light/dark theme tokens, shadcn overrides             | ✅     |
| [services/business.md](services/business.md)                 | Business rules, access model, data governance         | ✅     |
| [services/workflows.md](services/workflows.md)               | User workflows, scenario simulation logic             | ✅     |
| [map-engine/map_engine.md](map-engine/map_engine.md)         | MapLibre integration, layer system, tile strategy     | ✅     |
| [map-engine/layers_spec.md](map-engine/layers_spec.md)       | Per-category intelligence layer specs                 | ✅     |
| [map-engine/navigation.md](map-engine/navigation.md)         | Earth→Village zoom hierarchy, camera transitions      | ✅     |
| [services/external.md](services/external.md)                 | OSM, tile providers, data APIs, integration contracts | ✅     |
| [pages/pages.md](pages/pages.md)                             | Page inventory, routes, components per page           | ✅     |

---

## Tech Stack

-### Phase 1–2 (Static / GitHub Pages)

- **Frontend**: React (Vite-built SPA)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Map**: MapLibre GL JS
- **Data**: GeoJSON (static, bundled)
- **Hosting**: GitHub Pages

### Phase 3+ (Server-backed)

- **Backend**: FastAPI (Python) or Node.js
- **Database**: PostgreSQL + PostGIS
- **Cache**: Redis
- **Tiles**: PMTiles / Martin tile server
- **AI**: LLM-assisted planning layer

---

## Pilot Region

```
Bihar → Darbhanga District
  ├── Kusheshwar Asthan
  ├── Biraul
  ├── Ghanshyampur
  ├── Kiratpur
  ├── Benipur
  ├── Hayaghat
  └── Jale
```
