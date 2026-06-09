import { create } from "zustand";

export type ThemeMode = "day" | "night" | "auto";

export interface ThemeState {
  mode: ThemeMode;
  resolvedMode: "day" | "night";
  sunrise?: string; // optional, for overrides (hh:mm or ISO)
  sunset?: string;  // optional
}

export interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  setSunTimes: (sunrise?: string, sunset?: string) => void;
  resolve: () => void;
}

export type ThemeStore = ThemeState & ThemeActions;

function parseTimeToMinutes(value?: string): number | null {
  if (!value) return null;
  const parts = value.split(":");
  if (parts.length >= 2) {
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    if (Number.isFinite(h) && Number.isFinite(m)) return h * 60 + m;
  }
  return null;
}

function isNightNow(sunrise?: string, sunset?: string): boolean {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const sunriseMinutes = parseTimeToMinutes(sunrise);
  const sunsetMinutes = parseTimeToMinutes(sunset);

  if (sunriseMinutes === null || sunsetMinutes === null) {
    // Fallback: treat 7pm-6am as night
    return minutes >= 19 * 60 || minutes < 6 * 60;
  }

  return minutes < sunriseMinutes || minutes >= sunsetMinutes;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: "auto",
  resolvedMode: "night",
  sunrise: undefined,
  sunset: undefined,

  setMode: (mode) => {
    set({ mode });
    get().resolve();
  },

  setSunTimes: (sunrise, sunset) => {
    set({ sunrise, sunset });
    if (get().mode === "auto") get().resolve();
  },

  resolve: () => {
    const state = get();
    if (state.mode === "day") {
      set({ resolvedMode: "day" });
      return;
    }
    if (state.mode === "night") {
      set({ resolvedMode: "night" });
      return;
    }
    const night = isNightNow(state.sunrise, state.sunset);
    set({ resolvedMode: night ? "night" : "day" });
  },
}));
