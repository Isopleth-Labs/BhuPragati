# LABEL SYSTEM

## SPEC ID

002-LABEL-SYSTEM

## STATUS

IN PROGRESS

## BRANCH

gis-platform

## OWNER

GIS Domain

## TRACKER

GIS_TRACKER.md

---

## GOAL

Create intelligence-grade geographic typography for Better Bharat Map.

The map should feel like a professional intelligence platform rather than a consumer navigation application.

---

## CURRENT TASK

Settlement Hierarchy

Label Visibility

Regional Intelligence View

---

## REQUIREMENTS

### Operational Zones

Size:

34px–42px

Purpose:

Highest-level regional identity.

Examples:

* Mithila
* Magadh
* Seemanchal

Visibility:

Always visible at regional zoom levels.

---

### Major Towns

Size:

18px–24px

Purpose:

Primary urban reference points.

Visibility:

Visible at district and regional zoom levels.

---

### Villages

Size:

12px–15px

Purpose:

Local settlement intelligence.

Visibility:

Visible at operational zoom levels.

---

### Hamlets

Size:

10px–11px

Purpose:

Fine-grained settlement detail.

Visibility:

Visible only at close zoom levels.

---

## TYPOGRAPHY RULES

Labels:

* White text
* Dark halo
* Strong readability
* Professional appearance

Avoid:

* Neon effects
* Excessive glow
* Decorative typography

---

## ZOOM HIERARCHY

Regional Zoom

↓

Operational Zone

↓

District Zoom

↓

Major Towns

↓

Local Zoom

↓

Villages

↓

Close Zoom

↓

Hamlets

---

## DATA RULES

Use:

* Real OSM settlements
* Real administrative areas

Do Not Use:

* Generated settlements
* Placeholder locations
* Fake geographic labels

---

## TARGET OUTCOME

The map should immediately communicate settlement hierarchy through typography alone.

Users should be able to distinguish:

Operational Region

↓

Town

↓

Village

↓

Hamlet

without requiring additional UI elements.

---

## CURRENT PRIORITY

Improve visibility of:

* Kusheshwar Asthan
* Major settlement labels
* Village readability
* Regional intelligence labels

---

## FILES

Primary:

src/features/map/labels.js

Supporting:

src/features/map/osm.js

---

## SUCCESS CRITERIA

✓ Operational zones clearly visible

✓ Major towns easily identifiable

✓ Villages readable

✓ Hamlets visible at close zoom

✓ Professional intelligence-map appearance

---

## NEXT SPEC

003-OSM-INTEGRATION.md
