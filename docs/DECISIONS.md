# Architecture Decisions

## 2026-05-30

Decision:
MapLibre is the primary map engine.

Reason:
Open-source, scalable, vendor independent.

---

Decision:
Homepage and GIS development separated into dedicated branches.

Reason:
Prevent accidental cross-system modifications and allow parallel development.

Branches:
master      -> Stable branch
homepage-ui -> Homepage development
gis-platform -> GIS, Dashboard, OSM, MapLibre

---

Decision:
Navigation flow retained.

Earth
→ India
→ State
→ District
→ Village

Reason:
Core platform vision.

---

Decision:
Spec-driven development adopted.

Reason:
Multiple AI systems will work on the project.

---

Decision:
Tracker hierarchy adopted.

MASTER_TRACKER
→ GIS_TRACKER
→ HOMEPAGE_TRACKER
→ DATA_TRACKER
→ SIMULATION_TRACKER
→ PLATFORM_TRACKER

---

Decision:
Documentation freeze after governance system established.

Reason:
Focus must shift from documentation to implementation.

---

Decision:
Branch governance adopted.

Reason:
AI-assisted development requires strict separation of responsibilities.

Rules:
homepage-ui:
- Homepage only

gis-platform:
- GIS only

master:
- Stable branch
- No active development