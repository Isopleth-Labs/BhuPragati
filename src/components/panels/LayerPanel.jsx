import { infrastructureLayers } from "../../data/infrastructureLayers";

export default function LayerPanel({ activeLayers, onToggleLayer, onResetLayers }) {
  const activeCount = infrastructureLayers.filter((layer) => activeLayers[layer.id]).length;

  return (
    <aside className="layer-panel panel-surface" aria-label="Infrastructure layer controls">
      <div className="layer-panel__header">
        <div>
          <p className="panel-kicker">Infrastructure Layers</p>
          <h2>{activeCount}/5 active</h2>
        </div>
        <button className="layer-panel__reset" type="button" onClick={onResetLayers}>
          Reset
        </button>
      </div>

      <div className="layer-panel__stack">
        {infrastructureLayers.map((layer) => {
          const isActive = activeLayers[layer.id];

          return (
            <button
              key={layer.id}
              type="button"
              className="layer-toggle"
              style={{ "--layer-color": layer.color }}
              aria-pressed={isActive}
              onClick={() => onToggleLayer(layer.id)}
            >
              <span className="layer-toggle__swatch" aria-hidden="true" />
              <span className="layer-toggle__content">
                <span className="layer-toggle__label">{layer.label}</span>
                <span className="layer-toggle__summary">{layer.summary}</span>
              </span>
              <span className="layer-toggle__status">{isActive ? "On" : "Off"}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
