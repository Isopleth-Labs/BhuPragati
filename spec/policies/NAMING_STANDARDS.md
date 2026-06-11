# Naming Standards

## General Rules

| Item | Convention |
|------|------------|
| Variables, functions, methods, object properties | `camelCase` |
| Types, interfaces, classes, enums | `PascalCase` |
| React components and their files | `PascalCase` |
| Constants | `SCREAMING_SNAKE_CASE` |
| Other files and folders | `kebab-case` |
| Booleans | `is / has / can / should / was / will` + camelCase |
| IDs | camelCase ending in `Id` (e.g. `districtId`, not `districtID`) |
| Collections | plural camelCase (e.g. `districts`, `routes`) |

---

## File Naming Patterns

All files follow `<domain>-<responsibility>.ts`. Domain comes first.

| Purpose | Pattern | Example |
|---------|---------|---------|
| Service | `<domain>-service.ts` | `district-service.ts` |
| Repository | `<domain>-repository.ts` | `district-repository.ts` |
| Types | `<domain>.ts` | `district.ts` |
| Declaration (ambient only) | `<domain>.d.ts` | `geojson.d.ts` |
| Constants | `<domain>-constants.ts` | `map-constants.ts` |
| Utilities | `<domain>-utils.ts` | `geo-utils.ts` |
| Helpers | `<domain>-helpers.ts` | `route-helpers.ts` |
| Hooks | `use-<feature>.ts` | `use-map-state.ts` |
| Store | `<domain>-store.ts` | `map-store.ts` |
| Loader | `<domain>-loader.ts` | `boundary-loader.ts` |
| Adapter | `<domain>-adapter.ts` | `osm-adapter.ts` |
| Validator | `<domain>-validator.ts` | `district-validator.ts` |
| Schema | `<domain>-schema.ts` | `district-schema.ts` |
| Config | `<domain>-config.ts` | `map-config.ts` |
| React component | `PascalCase.tsx` | `MapView.tsx` |
| JSON data | `<domain>.json` | `districts.json` |
| GeoJSON | `<domain>.geojson` | `maharashtra.geojson` |
| Barrel | `index.ts` | `index.ts` |
| Route files | TanStack Router conventions | `__root.tsx`, `index.tsx` |

---

## Key Constraints

**Type files**
- All shared types live in `src/types/<domain>.ts`
- `.d.ts` is only for ambient/global/module declarations — never for regular app types

**Static data**
- Datasets go in `src/data/` as `.json` or `.geojson`
- Never hardcode datasets in `.ts`/`.tsx` files

**Abbreviations**
- Do not abbreviate unless universally recognised
- `district` not `dist`, `connectivityIndex` not `connIdx`

**No Hungarian notation**
- `District` not `IDistrict`

---

## Forbidden Patterns

| Forbidden | Use instead |
|-----------|-------------|
| `snake_case` | `camelCase` |
| `Pascal_Case`, `camel_Case` | pure case, no underscores |
| `districtID` | `districtId` |
| `IDistrict` | `District` |
| `dist`, `connIdx`, `popIdx` | full words |
| `export const districts = [...]` in `.ts` | `districts.json` |