# Data Policy

## Rule: No hardcoded datasets

This project is a static site with dynamic data loading. All datasets must live in
`.json` files from the start — never as inline arrays or objects in TypeScript.

This is not a refactor-later policy. Write it correctly the first time.

---

## What counts as a dataset

Anything that is a collection of domain entities:

- Districts, states, villages, regions
- Infrastructure items (roads, hospitals, schools, bridges)
- Categories, tags, lookup values
- Any array with more than ~3 items that represents real-world data

---

## Where data lives

```
src/
└── data/
    ├── districts.json
    ├── states.json
    ├── infrastructure.json
    └── maharashtra.geojson
```

TypeScript files import from these. They do not define the data.

---

## What TypeScript files may contain

- Type definitions for the data shape
- Loader/fetcher functions that read from `.json`
- Derived values computed from loaded data
- Enums for fixed finite sets (e.g. `InfrastructureType`)
- Configuration constants (URLs, keys, thresholds)
- Test fixtures (in `*.test.ts` files only)

---

## Examples

**Correct**

```ts
// src/types/district.ts
export interface District {
  id: string;
  name: string;
  stateId: string;
}

// src/loaders/district-loader.ts
import data from '../data/districts.json';
import type { District } from '../types/district';

export const districts: District[] = data;
```

```json
// src/data/districts.json
[
  { "id": "darbhanga", "name": "Darbhanga", "stateId": "bihar" },
  { "id": "muzaffarpur", "name": "Muzaffarpur", "stateId": "bihar" }
]
```

**Wrong — do not do this**

```ts
// ❌ never
export const districts = [
  { id: 'darbhanga', name: 'Darbhanga', stateId: 'bihar' },
  { id: 'muzaffarpur', name: 'Muzaffarpur', stateId: 'bihar' },
];
```

---

## Why

The frontend will eventually fetch this data from an API or query layer. Starting
with `.json` files means the loader/fetcher functions already exist and only the
data source needs to change — not the components, not the types, not the logic.

Hardcoding data into TypeScript creates a refactor burden with no upside.