# PROJECT CONTEXT

## Project Name

Better Bharat Map

---

## Project Type

Infrastructure Intelligence Platform

Not a Google Maps clone.

The platform combines:

* Geographic Intelligence
* Infrastructure Intelligence
* Development Analytics
* Future Scenario Simulation
* District Digital Twins

---

## Core Vision

Earth
→ India
→ State
→ District
→ Block
→ Panchayat
→ Village
→ Infrastructure Intelligence
→ Development Simulation

---

## Current Phase

Phase 2

Real Geographic Intelligence

Current Priority:

Settlement Hierarchy
→ OSM Integration
→ Road Network
→ Healthcare
→ Education
→ Public Safety

---

## Technology Stack

Frontend:

* React
* Vite

Mapping:

* MapLibre

Future Technologies:

* Deck.gl
* CesiumJS
* PostGIS

---

## Branch Architecture

master

* Stable branch
* Tested code only
* No active development

homepage-ui

* Homepage development only

gis-platform

* GIS
* OSM
* Dashboard
* Intelligence Systems

---

## Current GIS Architecture

Primary Folder:

src/features/map/

Modules:

* labels.js
* osm.js
* roads.js
* healthcare.js
* flood.js
* agriculture.js
* electricity.js
* intelligence.js
* region.js

Architecture Goal:

Highly modular GIS engine.

---

## Homepage Status

Homepage development exists in a separate branch.

Branch:

homepage-ui

Current GIS work must not modify homepage systems.

---

## Long-Term Roadmap

Phase 3

Infrastructure Intelligence Engine

* Flood Intelligence
* Healthcare Intelligence
* Agriculture Intelligence
* Road Intelligence
* Electricity Intelligence

Phase 4

District Digital Twin

* District
* Block
* Village

Phase 5

Development Simulation

Examples:

* Road Investments
* Flood Mitigation
* Healthcare Expansion
* School Expansion
* Connectivity Improvements

Phase 6

3D Infrastructure Visualization

* Deck.gl
* Terrain
* 3D Buildings

Phase 7

Earth Navigation

Earth
→ India
→ State
→ District
→ GIS Dashboard

Possible Technologies:

* CesiumJS
* MapLibre
* Deck.gl

---

## Working Principles

Do Not:

* Break GIS architecture
* Remove modularity
* Replace MapLibre
* Create fake geographic data

Prefer:

* Real OSM data
* Modular development
* Incremental improvements
* Documentation updates

---

## Current Focus

Real Geographic Intelligence

Settlement Hierarchy
→ OSM Integration
→ Roads
→ Healthcare
→ Education
→ Public Safety
