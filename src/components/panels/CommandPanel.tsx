import { memo } from "react";
import { infrastructureLayers } from "../../config/layers";
import LayerToggle from "../ui/LayerToggle";
import MetricBar from "../ui/MetricBar";

function CommandPanel({ activeLayers, onToggleLayer }) {
  return (
    <aside className="command-panel panel-surface" aria-label="Kusheshwar Asthan intelligence">
      <header className="command-panel__header">
        <h2>Kusheshwar Asthan</h2>
        <div className="command-panel__meta">PIN Code: 848213</div>
      </header>

      <div className="command-panel__layers" role="list">
        {infrastructureLayers.map((layer) => (
          <LayerToggle
            key={layer.id}
            layer={layer}
            isActive={!!activeLayers[layer.id]}
            onToggle={onToggleLayer}
          />
        ))}
      </div>

      <div className="command-panel__scores">
        <p className="panel-kicker">Infrastructure Scores</p>
        <div className="command-panel__metrics">
          {infrastructureLayers.map((layer) => (
            <MetricBar
              key={layer.id}
              label={layer.scoreLabel}
              value={layer.score}
              color={layer.color}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default memo(CommandPanel);
