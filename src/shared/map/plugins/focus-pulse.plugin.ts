import type { MapLibreMap } from "maplibre-gl"
import { startFocusPulse } from "../animation/focusPulse"

/**
 * Plugin factory gated by readiness.
 * Starts a long-running animation and returns a cleanup function.
 */
export function focusPulsePlugin(ready: boolean) {
  return (map: MapLibreMap) => {
    if (!ready) return

    const stop = startFocusPulse(map)

    return () => {
      stop?.()
    }
  }
}