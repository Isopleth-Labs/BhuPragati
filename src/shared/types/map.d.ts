/**
 * Map viewport and camera type definitions
 * Matches spec contract: types/map.ts
 */

export interface Viewport {
  center: [number, number]; // [lon, lat]
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface CameraTransition {
  duration: number; // ms
  easing: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
}

export interface MapStyle {
  id: string;
  url: string;
}

export type CanvasMode = "landing" | "dashboard";

export interface MapState {
  viewport: Viewport;
  style: "light" | "dark";
  canvasMode: CanvasMode;
  isLoading: boolean;
  error?: string;
}
