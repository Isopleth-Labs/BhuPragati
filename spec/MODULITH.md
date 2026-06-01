# Modulith conventions

This project follows a **modulith** (modular monolith) layout. Organize code by business domains (modules) rather than technical layers. Each module should own its UI, hooks, services, types and public API via a single `index.ts` barrel.

Recommended structure:

```
src/
├── app/
├── modules/
│   ├── map/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   └── ...
├── shared/
└── main.tsx
```

Rules and guidance
- Each module must export a public API from `index.ts` and avoid consumers reaching into internal files.
- Place module-specific types under `module/types/` and shared types under `src/types/`.
- All type definition files MUST use the `.d.ts` extension (e.g. `settlement.d.ts`, `layer.d.ts`) so they are clearly identifiable as declaration/type files. This project enforces that convention.
- Prefer `export type` / `export interface` in `.d.ts` files rather than emitting runtime code.
- Create a top-level `src/modules` grouping for new domains; migrate existing feature folders into `modules/` progressively.

Migration guidance
- Start incrementally: add a `src/modules/<domain>/index.ts` barrel that re-exports the existing `src/features/<domain>` implementation. Update a few consumers to import from `src/modules/<domain>` to validate resolution.
- After barrels are in place and tests pass, move implementation folders into `src/modules/<domain>/` and keep a compatibility barrel at the old path for one release.
- Update `tsconfig.json` paths (optional) to map `@/modules/*` and prevent wide-reaching refactors.


Why this helps
- Improves encapsulation and makes boundaries explicit.
- Simplifies future extraction of modules into packages if needed.
- Keeps `shared/` for cross-cutting UI and utilities only.

See `spec/workflow.md` for integration steps and tracker discipline.
