# Better Bharat Map

A Vite React and MapLibre dashboard for infrastructure intelligence around
Kusheshwar Asthan, Darbhanga, Bihar.

## Architecture

- `src/components/map` contains the interactive MapLibre implementation.
- `src/components/panels` contains reusable dashboard HUD panels.
- `src/components/ui` contains small reusable interface primitives.
- `src/data` contains local map configuration, infrastructure layer metadata and
  GeoJSON feature collections.
- `src/styles` contains split CSS for base, layout, panels and map overrides.

## Commands

```bash
npm run dev
npm run build
npm run lint
```
