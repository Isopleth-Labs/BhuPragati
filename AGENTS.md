# AGENTS.md

Purpose: Define agent roles (human and AI), allowed/forbidden actions, safety checks, and prompt templates for automated workflows in this repository.

---

## Agents & Roles

- `spec-author` (human)
  - Owns spec content under `spec/` and creates `SPEC-` rows in `spec/trackers/specs-tracker.md`.
  - Responsible for acceptance criteria clarity.

- `developer` (human)
  - Implements features. Creates branches `feat/SPEC-###-short-desc` and references `SPEC-###` in commits.
  - Updates `spec/trackers/tests-tracker.md` when adding tests.

- `tester` (human or CI)
  - Writes and runs tests. Posts results to CI; test artifacts are used to update trackers.

- `reviewer` (human)
  - Reviews PRs, approves merges, and verifies that `SPEC-` acceptance criteria are met.

- `release-manager` (human)
  - Coordinates releases and merges release branches. Only humans perform production deploys.

- `ai-assistant` (AI)
  - Automates scaffolding, tracker updates, CI triage suggestions, and PR draft generation.
  - Must follow safety rules below and leave an audit trail on all automated edits.

---

## Mandatory Pre-Read for Any Agent (esp. `ai-assistant`)

1. Read `spec/workflow.md` and `spec/trackers/*` before making changes.
2. Read the spec file(s) relevant to the task and confirm no `P0` blockers exist in `spec/trackers/issues-tracker.md`.
3. Preserve design tokens and theming from `spec/design/theme.md` — do not alter token names or remove variables.

---

## Allowed Actions (ai-assistant)

- Create or update tracker rows (`spec/trackers/*.md`) with an audit note: `updatedBy: ai-assistant` in `Notes`.
- Scaffold spec or test skeletons and add `SPEC-`/`TEST-` rows in trackers (leave skeleton code as drafts; human must finalize).
- Parse CI artifacts (JUnit/JSON) and propose tracker updates as a draft PR (or directly update trackers if repository policy grants an `ai-assistant` service account write access).
- Suggest PR titles, bodies, and branch names; produce a patch suggestion but never merge.
- Propose labels and assignees based on git blame / CODEOWNERS heuristics.

---

## Forbidden Actions (ai-assistant)

- Merge PRs to `master`/`main` or perform any deployment.
- Close or delete human-raised `ISSUE-` entries without explicit human approval.
- Remove or rename spec files or tracker headers without a human reviewer sign-off.
- Modify `package.json` scripts or dependencies without creating a draft PR and human approval.

---

## Safety & Approval Rules

- Any code or dependency change proposed by `ai-assistant` must be created as a draft PR; a human reviewer must approve and merge.
- All automated edits to trackers must include `Notes: updatedBy=ai-assistant, timestamp=YYYY-MM-DD`.
- For AI-created `ISSUE-` rows, a human must assign an `Owner:` and confirm `Priority:` before the AI may open remediation branches.

---

## Prompt Templates (useful for automation)

- Scaffold spec:

```
Scaffold SPEC draft for: <short title>
- Owner: @username
- Priority: P0|P1|P2|P3
- Acceptance Criteria: - <criterion 1>\n- <criterion 2>
Return: a markdown row for `specs-tracker.md` and a `spec/<slug>.md` skeleton.
```

- Generate tests from spec:

```
Generate tests for SPEC-###:
- Read Acceptance Criteria
- For each criterion output: Test ID, Test Name, Type(unit|integration|e2e), Component, Suggested file path, Starter test code snippet
Return: `TEST-` rows and test file snippets.
```

- Triage failing CI run:

```
Triage CI failure:
- Input: CI job name, failing test IDs, JUnit/JSON artifact
- Output: If reproducible, create ISSUE- row with reproduction steps, severity suggestion, and linked TEST- IDs.
```

---

## Audit and Traceability

- Always include `updatedBy: ai-assistant` and a timestamp on automated tracker edits.
- Keep automated code suggestions as draft PRs; prefer one master branch per feature (e.g., `feat/SPEC-###-...`).

---

## Contact / Owners

- By default assign `Owner: @maintainers` for infra or repo-level changes.
- For domain-specific features, assign to the component owner listed in `spec/` or `CODEOWNERS` if present.

---

Place this file at the repo root so CI and automation can reference it to enforce agent rules.