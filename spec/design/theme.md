# Theme Spec

## Theme Strategy

Better Bharat Map uses **system default** theme — it respects the OS `prefers-color-scheme` preference with an optional manual override toggle in the header.

Implementation uses a simple CSS-variable based approach with a small React theme hook (preferences stored in `localStorage`) plus shadcn's CSS variable tokens.

---

## shadcn Theme Override

`components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## CSS Variables (globals.css)

```css
@layer base {
  :root {
    /* shadcn base tokens */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;

    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    /* Brand primary: India saffron */
    --primary: 24 100% 50%; /* #FF6200 */
    --primary-foreground: 0 0% 100%;

    /* Secondary: slate */
    --secondary: 215 16% 47%;
    --secondary-foreground: 0 0% 100%;

    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;

    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 24 100% 50%; /* saffron focus ring */

    --radius: 0.5rem;

    /* Map panel tokens */
    --panel-bg: 0 0% 100%;
    --panel-border: 214 32% 91%;
    --panel-width: 320px;

    /* Score colors (hsl) */
    --score-critical: 4 76% 49%;
    --score-poor: 4 86% 58%;
    --score-moderate: 36 92% 50%;
    --score-good: 152 63% 53%;
    --score-excellent: 158 79% 34%;
  }

  .dark {
    --background: 222 47% 4%;
    --foreground: 210 40% 98%;

    --card: 222 47% 7%;
    --card-foreground: 210 40% 98%;

    --popover: 222 47% 7%;
    --popover-foreground: 210 40% 98%;

    --primary: 24 100% 50%; /* saffron stays same in dark */
    --primary-foreground: 0 0% 100%;

    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;

    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;

    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 24 100% 50%;

    /* Map panel tokens (dark) */
    --panel-bg: 222 47% 7%;
    --panel-border: 217 33% 17%;
  }
}
```

---

## Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
      },
      colors: {
        brand: {
          saffron: "#FF6200",
          green: "#138808",
          navy: "#0D2137",
          blue: "#1E5F96",
        },
        score: {
          critical: "#D92D20",
          poor: "#F04438",
          moderate: "#F79009",
          good: "#32D583",
          excellent: "#039855",
        },
        map: {
          flood: "#2563EB",
          road: "#F59E0B",
          healthcare: "#EF4444",
          school: "#8B5CF6",
          electricity: "#F59E0B",
          river: "#60A5FA",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      width: {
        panel: "320px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## Map Style (Light vs Dark)

MapLibre uses its own style system separate from Tailwind. We maintain two base styles.

```typescript
// src/data/map-config.ts

export const MAP_STYLES = {
  light: "https://tiles.openstreetmap.org/styles/osm-bright/style.json",
  // fallback to: https://demotiles.maplibre.org/style.json
  dark: "https://tiles.openstreetmap.org/styles/dark-matter/style.json",
} as const;

export const INITIAL_VIEWPORT = {
  // Center on Darbhanga, Bihar
  longitude: 85.8956,
  latitude: 26.1542,
  zoom: 9,
  pitch: 0,
  bearing: 0,
} as const;

export const ZOOM_LEVELS = {
  earth: 1,
  india: 4,
  state: 6, // Bihar
  district: 9, // Darbhanga
  block: 12,
  panchayat: 14,
  village: 16,
} as const;
```

---

## Theme hook (React)

Use a tiny hook that respects `prefers-color-scheme` and stores manual overrides in `localStorage`. Apply `.dark` to the `html` element to switch themes.

```javascript
// src/hooks/useTheme.js
import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
```

```javascript
// src/components/layout/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```
