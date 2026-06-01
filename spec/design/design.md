# Design System Spec

---

## Design Philosophy

Better Bharat Map is an **infrastructure intelligence platform**, not a consumer product. Its aesthetic should communicate:

- **Precision** — government-grade seriousness, not playful
- **Clarity** — complex data made legible
- **Authority** — trustworthy, evidence-based
- **Accessibility** — works for researchers, NGO staff, and planners equally

**Reference aesthetic**: Civic tech meets satellite intelligence. Think ISRO mission control meets OpenStreetMap contributor tools. Dark map + light data panels.

---

## Typography

### Font Pairing

| Role               | Font                     | Source       | Usage                      |
| ------------------ | ------------------------ | ------------ | -------------------------- |
| Display / Headings | **Space Grotesk**        | Google Fonts | Hero text, section titles  |
| Body / UI          | **IBM Plex Sans**        | Google Fonts | Paragraphs, labels, panels |
| Monospace / Data   | **IBM Plex Mono**        | Google Fonts | Coordinates, scores, IDs   |
| Hindi / Devanagari | **Noto Sans Devanagari** | Google Fonts | Hindi place names          |

```css
/* globals.css */
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Devanagari:wght@400;500&display=swap");
```

### Type Scale

```css
--text-xs: 0.75rem; /* 12px — map labels, micro metadata */
--text-sm: 0.875rem; /* 14px — sidebar items, captions */
--text-base: 1rem; /* 16px — body */
--text-lg: 1.125rem; /* 18px — panel headings */
--text-xl: 1.25rem; /* 20px — section titles */
--text-2xl: 1.5rem; /* 24px — page headings */
--text-3xl: 1.875rem; /* 30px — hero */
--text-4xl: 2.25rem; /* 36px — hero large */
```

---

## Color System

### Semantic Palette

```css
:root {
  /* Brand */
  --color-brand-saffron: #ff6200; /* India saffron — primary accent */
  --color-brand-green: #138808; /* India green — positive/good */
  --color-brand-navy: #0d2137; /* Deep map navy — primary dark */
  --color-brand-blue: #1e5f96; /* Intelligence blue */

  /* Neutrals */
  --color-surface-0: #ffffff;
  --color-surface-1: #f8f9fa;
  --color-surface-2: #f0f2f5;
  --color-surface-3: #e4e7ec;
  --color-border: #d0d5dd;
  --color-border-subtle: #eaecf0;

  /* Text */
  --color-text-primary: #101828;
  --color-text-secondary: #475467;
  --color-text-tertiary: #98a2b3;
  --color-text-disabled: #d0d5dd;

  /* Infrastructure Score Colors */
  --score-very-high: #d92d20; /* critical / very bad */
  --score-high: #f04438; /* high risk / poor */
  --score-moderate: #f79009; /* moderate */
  --score-low: #32d583; /* low risk / good */
  --score-very-low: #039855; /* very low risk / excellent */

  /* Map-specific */
  --map-flood-fill: rgba(37, 99, 235, 0.25);
  --map-flood-stroke: #2563eb;
  --map-road-primary: #f59e0b;
  --map-road-secondary: #94a3b8;
  --map-road-rural: #cbd5e1;
  --map-healthcare: #ef4444;
  --map-school: #8b5cf6;
  --map-electricity: #f59e0b;
  --map-river: #60a5fa;
}
```

### Dark Mode Tokens

```css
[data-theme="dark"] {
  --color-surface-0: #0d1117;
  --color-surface-1: #161b22;
  --color-surface-2: #21262d;
  --color-surface-3: #30363d;
  --color-border: #30363d;
  --color-border-subtle: #21262d;

  --color-text-primary: #e6edf3;
  --color-text-secondary: #8b949e;
  --color-text-tertiary: #484f58;
  --color-text-disabled: #30363d;
}
```

### Score Level to Color Mapping

| Level       | Score Range | Color        | Hex       |
| ----------- | ----------- | ------------ | --------- |
| `very_low`  | 0–20        | Critical Red | `#D92D20` |
| `low`       | 21–40       | Warning Red  | `#F04438` |
| `moderate`  | 41–60       | Amber        | `#F79009` |
| `high`      | 61–80       | Light Green  | `#32D583` |
| `very_high` | 81–100      | Deep Green   | `#039855` |

Note: For **risk** layers (flood, disaster), scale is **inverted**: higher score = higher risk = red.

---

## Spacing Scale

```css
--space-1: 0.25rem; /*  4px */
--space-2: 0.5rem; /*  8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

---

## Layout

### Map View Layout

```
┌─────────────────────────────────────────────────────┐
│  Header (48px) — Logo, Nav, Theme toggle            │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│  Layer   │         Map Canvas (MapLibre)            │
│  Panel   │                                          │
│  (320px) │    ┌────────────────────────────┐        │
│          │    │  Zoom Hierarchy Bar (top)  │        │
│  ───     │    └────────────────────────────┘        │
│          │                                          │
│  Score   │         (feature popups appear here)     │
│  Panel   │                                          │
│  (below) │    ┌──────────────────────────────────┐  │
│          │    │  Map Controls (zoom, compass)    │  │
│          │    └──────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────┐
│ Header (48px)        │
├──────────────────────┤
│                      │
│   Map Canvas         │
│   (full screen)      │
│                      │
│ ┌──────────────────┐ │
│ │ Zoom Hierarchy   │ │
│ └──────────────────┘ │
│                      │
└──────────────────────┘
  ↑ Bottom sheet
┌──────────────────────┐
│ Layer Panel          │
│ (slide up drawer)    │
└──────────────────────┘
```

### Breakpoints

```css
--bp-mobile: 480px;
--bp-tablet: 768px;
--bp-desktop: 1024px;
--bp-wide: 1280px;
--bp-ultra: 1536px;
```

---

## Component Inventory

### shadcn Components Used

| Component     | Usage                             |
| ------------- | --------------------------------- |
| `Button`      | Layer toggles, CTA buttons        |
| `Badge`       | Score level badges, category tags |
| `Card`        | Intelligence panels, stat cards   |
| `Separator`   | Panel section dividers            |
| `Tooltip`     | Layer name tooltips on hover      |
| `Sheet`       | Mobile layer drawer               |
| `Tabs`        | Category switching in layer panel |
| `Switch`      | Layer on/off toggle               |
| `Slider`      | Layer opacity control             |
| `ScrollArea`  | Scrollable layer list             |
| `Skeleton`    | Loading states for panels         |
| `Dialog`      | Feature detail expanded view      |
| `HoverCard`   | Quick feature preview             |
| `Progress`    | Score bar visualization           |
| `Breadcrumb`  | Earth → Village navigation        |
| `Collapsible` | Layer category accordion          |

### Custom Components

| Component           | Description                        |
| ------------------- | ---------------------------------- |
| `MapCanvas`         | MapLibre GL JS mount + lifecycle   |
| `ZoomHierarchy`     | Earth→Village breadcrumb bar       |
| `IntelligencePanel` | Right-side data panel              |
| `ScoreBadge`        | Color-coded infrastructure score   |
| `LayerCard`         | Single layer toggle card           |
| `RegionCard`        | Summary card for a region          |
| `FeaturePopup`      | MapLibre popup with styled content |
| `ScoreBar`          | Horizontal score progress bar      |
| `CategoryTabs`      | Infrastructure category switcher   |

---

## Animation & Motion

Minimal, purposeful animations only. This is a data platform, not a marketing site.

| Interaction           | Animation          | Duration       |
| --------------------- | ------------------ | -------------- |
| Panel open/close      | slide-in from left | 200ms ease     |
| Layer toggle          | fade in on map     | 300ms ease     |
| Map camera transition | MapLibre `flyTo`   | 1000–1500ms    |
| Popup appear          | scale + fade       | 150ms ease-out |
| Score bar fill        | width transition   | 600ms ease-out |
| Page load             | stagger fade-in    | 300ms stagger  |
| Hover states          | color transition   | 100ms          |

```css
/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Iconography

Use **Lucide Icons** (ships with shadcn). Supplement with custom SVG for India-specific concepts.

| Icon        | Lucide Name     | Usage               |
| ----------- | --------------- | ------------------- |
| Layers      | `Layers`        | Layer panel toggle  |
| Flood       | `Droplets`      | Flood intelligence  |
| Road        | `Route`         | Road & connectivity |
| Hospital    | `Cross`         | Healthcare          |
| Agriculture | `Wheat`         | Agriculture         |
| Train       | `Train`         | Railway             |
| Electricity | `Zap`           | Electricity         |
| School      | `GraduationCap` | Education           |
| Police      | `Shield`        | Public safety       |
| Village     | `Home`          | Settlement marker   |
| Search      | `Search`        | Search bar          |
| Info        | `Info`          | Feature popup       |
| Warning     | `AlertTriangle` | High risk indicator |

---

## Accessibility

- **Color contrast**: All text on backgrounds meets WCAG AA (4.5:1 minimum)
- **Focus indicators**: Visible keyboard focus ring on all interactive elements
- **ARIA labels**: All icon-only buttons have `aria-label`
- **Map accessibility**: Map canvas has `role="img"` + `aria-label` describing current view
- **Screen reader**: Panel content is readable without the map
- **Language**: `lang="en"` on html; Hindi text wrapped in `lang="hi"`
