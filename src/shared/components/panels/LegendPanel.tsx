import { memo } from "react";
import { infrastructureLayers } from "@/shared/lib/config/layers";

// Tactical legend: maps map color codes to intelligence verdicts.
// Static, lightweight, sits on the right edge of the map.

function LegendPanel() {
  return (
    <aside className="legend-panel panel-surface" aria-label="Map legend">
      <ul className="legend-panel__list">
        {infrastructureLayers.map((layer) => (
          <li
            key={layer.id}
            className="legend-panel__item"
            style={{ ["--layer-color" as any]: layer.color } as React.CSSProperties}
          >
            <span className="legend-panel__dot" aria-hidden="true" />
            <span>{layer.legendLabel}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default memo(LegendPanel);
