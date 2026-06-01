# Implementation Workflow

> This document defines an actionable, step-by-step process for humans and AI agents to implement the Better Bharat Map spec in this React + Vite project. It replaces framework-specific Next.js requirements with React/Vite-compatible steps and enforces tracker discipline so automation remains safe and auditable.

---

## ⚠️ Mandatory Pre-Read

Before writing ANY code, you MUST do the following:

1. Read `AGENTS.md` and this repository's `spec/` files — understand agent roles and safety constraints.
2. Read the spec file(s) covering the component/feature you will implement and open the corresponding `SPEC-` row in the Specs tracker.
3. Check `spec/trackers/issues-tracker.md` for blocking `P0/P1` issues that must be resolved first.
4. Ensure design tokens, global styles, and theme expectations in `spec/design/theme.md` are understood (preserve CSS variables).
5. Mark the `SPEC-` row as `[/]` when you start work.

---

## Tracker Discipline

When starting a task

1. Open the `SPEC-` row in `spec/trackers/specs-tracker.md` and set `Status = [/]` (in progress).
2. Confirm there are no P0 blockers in `spec/trackers/issues-tracker.md`.

When completing a task

1. Mark the `SPEC-` row as `[x]` and update `Last Updated`.
2. Add or update `TEST-` rows for all acceptance criteria in `spec/trackers/tests-tracker.md` and mark tests as passing = `[x]`.
3. If you discover bugs or design decisions, file an `ISSUE-` row linking the `SPEC-` and `TEST-` IDs.

When stuck

1. Add an `[!]` note to the `SPEC-` row and create a corresponding `ISSUE-` entry describing the blocker.
2. Move on to the next unblocked `SPEC-` unless the blocker is P0.

---

## Phase 1 Implementation Order (by dependency)

Follow these steps in order; each step depends on the previous.

### Step 0: Environment & Compatibility Audit

Goal: Resolve P0/P1 issues before writing code.

Actions:

| Action | Reference |
| ------ | --------- |
| Read React + Vite docs and local toolchain notes (`vite.config.js`, `package.json`) | repo root |
| Resolve ISSUE-001 (`src/` vs root layout) | `spec/trackers/issues-tracker.md` |
| Resolve ISSUE-002 (Tailwind v4 / CSS-native tokens) | `spec/trackers/issues-tracker.md` |
| Clean up boilerplate and irrelevant scaffold files | repo root |

Checklist:

- [ ] Confirm `package.json` scripts: `dev`, `build`, `preview` work locally
- [ ] Confirm theme tokens exist in `src/styles` or `config/theme.js` and are preserved
- [ ] Note any compatibility issues in `spec/trackers/issues-tracker.md`

---

### Step 1: Project Scaffolding

Goal: Ensure consistent project layout, linting, and test harness.

Tasks:

- [ ] Create or confirm `src/` or root layout per ISSUE-001 decision
- [ ] Add `vitest` + `@testing-library/react` and minimal config
- [ ] Add `playwright` for E2E (optional for Phase 1)
- [ ] Add a `spec/trackers/` watcher script (optional) that validates tracker header names before automation writes

---

### Step 2: Implement Core Data Types & Registry

Target: types and layer registry used by Map engine and UI.

- [ ] Implement `types/region.ts` and `types/layer.ts` per `spec/db/enums.md` and `spec/trackers/specs-tracker.md`
- [ ] Add `src/config/layers.js` entries for Phase 1 layers and link to `public/geojson/` files
- [ ] Write unit tests for type validation and layer registry

---

### Step 3: Map Engine Basics

- [ ] Create `MapEngine.jsx` that mounts MapLibre and exposes `addInfraLayer()`, `removeInfraLayer()`, `flyToRegion()`
- [ ] Add tests: `TEST-Map-001` (mount), `TEST-Map-002` (add layer), `TEST-Map-003` (popup rendering)

---

## Automation & AI Assistant Rules

- Allowed `ai-assistant` actions:
   - Create or update tracker rows (must include `createdBy: ai-assistant` in `Notes`).
   - Generate test skeletons from `Acceptance Criteria` and add `TEST-` rows with `Status=Not Written`.
   - Parse CI artifacts (JUnit/JSON) and update `Last Run`, `Result`, and `Fail Count` in `tests-tracker.md`.
   - Draft PR bodies, suggested code diffs, and branch names; a human must create the PR and approve merging.

- Forbidden `ai-assistant` actions:
   - Merge to `master`/`main` or deploy releases.
   - Modify trackers without leaving an audit note `updatedBy=ai-assistant`.
   - Close or delete human-raised `ISSUE-` rows without explicit human confirmation.

---

## CI & Tracker Integration (recommended)

- CI should run `test:unit` and `test:e2e`, then upload JUnit/JSON artifacts to the run.
- A small CI step or `ai-assistant` action should parse artifacts and produce a tracker update PR that:
   - Updates `tests-tracker.md` `Result` and `Last Run` for affected tests
   - Creates `ISSUE-` rows for persistent failures (after N retries)

Example GitHub Action (sketch):

```yaml
name: CI
on: [push, pull_request]
jobs:
   test:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v4
         - run: pnpm install
         - run: pnpm test:unit --reporter junit
         - run: pnpm test:e2e --reporter junit
         - uses: actions/upload-artifact@v4
            with:
               name: test-results
               path: ./test-results
         - name: Update trackers (optional)
            run: node ./scripts/ci-update-trackers.js
            if: always()
```

---

## Quick Operational Checklist

- Add specs in `spec/` and create `SPEC-` row before implementing.
- Use branch names referencing `SPEC-###` and reference `SPEC-###` in commits and PRs.
- Add tests locally and update `tests-tracker.md`.
- Let CI upload test artifacts and use `ai-assistant` to propose tracker updates as PRs.

---

If you want, I can now:

- convert the remaining checklist items in `specs-tracker.md` into `SPEC-` rows, or
- scaffold `vitest` + `@testing-library/react` and add skeleton tests for `TEST-Map-001` and `TEST-UI-001`.

