# Better Bharat Map

## BEFORE MAKING CHANGES

1. Check current branch
2. Respect branch scope
3. Read MASTER_TRACKER.md
4. Read active tracker
5. Read active spec
6. Create backup commit before major changes


## Branches

master
- Stable branch
- Tested code only
- No active development

homepage-ui
- Homepage development only

gis-platform
- GIS, Dashboard, OSM, MapLibre

## PROJECT STATE

Current Phase:
GIS Foundation

Current Tracker:
GIS_TRACKER.md

Current Spec:
002-LABEL-SYSTEM.md

Current Mode:
WORKER MODE

Homepage:
ACTIVE (homepage-ui)

Simulation:
NOT STARTED

READ IN ORDER

1. docs/MASTER_TRACKER.md
2. docs/DECISIONS.md
3. docs/PROJECT_CONTEXT.md
4. docs/ROADMAP.md
5. docs/DATASET_VISION.md
6. Active Tracker
7. Active Spec

---

Rules

Do not delete files.

Do not perform major refactors without approval.

Before major changes:

Create backup commit.

After completing work:

Update active tracker.

Update MASTER_TRACKER.md.

Preserve architecture.

Current Long Term Goal:

Earth
→ India
→ State
→ District
→ Village
→ Infrastructure Intelligence Platform
SPEC SYSTEM

Read relevant spec before implementing a feature.

GIS:
docs/specs/002-LABEL-SYSTEM.md
docs/specs/003-OSM-INTEGRATION.md
docs/specs/004-ROAD-NETWORK.md

Homepage:
docs/specs/005-HOMEPAGE-VISION.md

## AI MODES

ARCHITECT MODE

Use for:

- Roadmap
- GIS Architecture
- Simulation Design
- PostGIS Planning
- Platform Decisions

WORKER MODE

Use for:

- Coding
- Refactoring
- Bug Fixes
- CSS
- Components
- Tracker Updates

Default:

WORKER MODE

## GOLDEN RULE

Before changing code:

Read:

MASTER_TRACKER.md

Relevant Tracker

Relevant Spec

Do not modify unrelated systems.

Do not delete files.

Do not perform large refactors without approval.

## BRANCH SCOPE

homepage-ui:
- Homepage only
- Do not modify GIS
- Do not modify Dashboard
- Do not modify OSM

gis-platform:
- GIS
- Dashboard
- OSM
- MapLibre
- Do not modify Homepage

master:
- Stable branch
- No active development

## TASK COMPLETION RULE

When a task is completed:

1. Update Spec Status
2. Update Tracker Progress
3. Update MASTER_TRACKER
4. Move focus to next spec