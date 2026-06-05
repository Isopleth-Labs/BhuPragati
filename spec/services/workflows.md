# Workflows Spec

---

## User Personas

| Persona        | Goal                                           | Technical Level |
| -------------- | ---------------------------------------------- | --------------- |
| **Researcher** | Analyze infrastructure gaps in Bihar           | High            |
| **NGO Worker** | Identify underserved villages for intervention | Medium          |
| **Planner**    | Compare development outcomes across blocks     | Medium          |
| **Journalist** | Visualize flood impact zones                   | Low             |
| **Citizen**    | Understand infrastructure in their area        | Low             |

---

## Core Workflows

### Workflow 1: Infrastructure Layer Exploration

```mermaid
flowchart TD
    Start([User opens /map])
    Load[Map loads centered on Darbhanga\nwith base OSM tiles]
    ViewLayers[User opens Layer Panel\n→ sees 8 categories]
    Select[User clicks 'Flood Intelligence']
    Toggle[Toggles 'Flood Risk' layer ON]
    Fetch[Browser fetches flood-zones.geojson]
    Render[Flood zones render on map\nas blue polygons]
    Hover[User hovers over a polygon]
    Tooltip[Tooltip shows: 'High flood risk\nReturn period: 5yr']
    Click[User clicks polygon]
    Popup[Popup shows full details:\n• Villages affected: 14\n• Max depth: 2.1m\n• Embankment: None\n• Source: CWC 2023]

    Start --> Load --> ViewLayers --> Select --> Toggle
    Toggle --> Fetch --> Render --> Hover --> Tooltip
    Tooltip --> Click --> Popup
```

---

### Workflow 2: Earth → Village Navigation

```mermaid
flowchart TD
    Earth([User sees Earth / India view])
    ClickBihar[Clicks Bihar on India map]
    FlyBihar[Camera flies to Bihar\nzoom = 6]
    ZoomBar1[ZoomHierarchy bar shows:\nIndia → Bihar]
    ClickDarbhanga[Clicks Darbhanga district]
    FlyDarbhanga[Camera flies to Darbhanga\nzoom = 9\nBlock boundaries appear]
    ZoomBar2[ZoomHierarchy: India → Bihar → Darbhanga]
    ClickBlock[Clicks Kusheshwar Asthan block]
    FlyBlock[Camera flies to block\nzoom = 12\nPanchayat boundaries appear]
    ZoomBar3[ZoomHierarchy: … → Darbhanga → Kusheshwar Asthan]
    SidePanelUpdate[Intelligence panel updates\nwith block-level scores]

    Earth --> ClickBihar --> FlyBihar --> ZoomBar1
    ZoomBar1 --> ClickDarbhanga --> FlyDarbhanga --> ZoomBar2
    ZoomBar2 --> ClickBlock --> FlyBlock --> ZoomBar3
    ZoomBar3 --> SidePanelUpdate
```

---

### Workflow 3: Intelligence Score Review

```mermaid
flowchart TD
    SelectRegion[User navigates to Kusheshwar Asthan]
    PanelOpen[Intelligence Panel shows\nblock-level scores]
    ScoreGrid["Score Grid:
    • Flood Risk: 87/100 🔴 (Very High Risk)
    • Road Quality: 34/100 🟠 (Poor)
    • Healthcare: 42/100 🟡 (Moderate)
    • Electricity: 71/100 🟢 (Good)"]
    ClickScore[User clicks 'Flood Risk' score]
    Expand["Score Breakdown:
    • Flood zone coverage: 67%
    • Embankment protection: 20%
    • Road isolation risk: 80%
    • Evacuation access: 30%"]
    ViewLayer[User clicks 'View on Map'\n→ flood risk layer auto-enabled]

    SelectRegion --> PanelOpen --> ScoreGrid --> ClickScore --> Expand --> ViewLayer
```

---

### Workflow 4: Multi-Layer Comparison

```mermaid
flowchart TD
    Start[User on map view]
    EnableFlood[Enable Flood Risk layer]
    EnableRoad[Enable Road Quality layer]
    EnableHealth[Enable Healthcare layer]

    Overlap["Map shows overlapping layers:
    • Blue polygons = flood zones
    • Road colors = quality gradient
    • Red markers = healthcare facilities"]

    Identify["User visually identifies:
    High flood risk zone with no road access
    and no hospital within 10km"]

    ShareView["User copies URL
    (layer state in URL hash)
    → shares with colleague"]

    Start --> EnableFlood --> EnableRoad --> EnableHealth --> Overlap --> Identify --> ShareView
```

---

### Workflow 5: Simulation Scenario (Phase 5)

```mermaid
flowchart TD
    Start[User navigates to Simulation tab]
    Baseline["Baseline view:
    Current infrastructure state\n2024 data"]

    AddInvestment["User adds investments:
    + ₹45 Cr road upgrade (Biraul-Darbhanga)
    + ₹120 Cr embankment (Kusheshwar Asthan)
    + 2 new PHCs (Kiratpur, Jale)"]

    Simulate[Click 'Run Simulation']

    Engine["Simulation Engine:
    1. Recalculate road connectivity
    2. Recalculate flood protection
    3. Recalculate healthcare access
    4. Project outcomes to target year"]

    Compare["Split-screen comparison:
    LEFT: Current State
    RIGHT: Simulated State

    Flood Risk: 87 → 52 (-35)
    Road Quality: 34 → 68 (+34)
    Healthcare: 42 → 71 (+29)"]

    Export["User exports report as PDF"]

    Start --> Baseline --> AddInvestment --> Simulate --> Engine --> Compare --> Export
```

---

## URL State Management

Layer state and region state are encoded in the URL hash so views can be shared.

### URL Format

```
/map#region=darbhanga:kusheshwar-asthan&layers=flood-risk,road-quality&zoom=12&center=85.8956,26.1542
```

### URL Parameters

| Param      | Type                      | Example                              |
| ---------- | ------------------------- | ------------------------------------ |
| `region`   | `{district}:{block}`      | `darbhanga:kusheshwar-asthan`        |
| `layers`   | comma-separated layer IDs | `flood-risk,road-quality,healthcare` |
| `zoom`     | number                    | `12`                                 |
| `center`   | `{lon},{lat}`             | `85.8956,26.1542`                    |
| `scenario` | scenario UUID (Phase 5)   | `abc123`                             |

### Implementation

```typescript
// hooks/useUrlState.ts
import { useEffect } from "react";
import { useLayerStore } from "@/stores/layer";
import { useRegionStore } from "@/stores/region";
import { useMapStore } from "@/stores/map";

export function useUrlState() {
  // On mount: parse hash → hydrate stores
  // On store change: update hash
}
```

---

## Error States & Edge Cases

| Scenario               | Handling                                                                 |
| ---------------------- | ------------------------------------------------------------------------ |
| GeoJSON fetch fails    | Show toast "Layer data unavailable", keep layer toggle in error state    |
| No data for region     | Show "Insufficient data" in score panel, not 0                           |
| OSM tiles fail to load | Fallback to demotiles.maplibre.org                                       |
| Very slow connection   | Skeleton loading states in panel, progressive map tile loading           |
| Browser with no WebGL  | Show message: "Your browser doesn't support WebGL, required for the map" |
| GeoJSON malformed      | Catch parse error, log to console, show layer error state                |
