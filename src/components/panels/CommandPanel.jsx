import { infrastructureLayers, systemReadouts } from "../../data/infrastructureLayers";
import MetricBar from "../ui/MetricBar";

export default function CommandPanel() {
  return (
    <aside className="command-panel panel-surface" aria-label="Kusheshwar Asthan overview">
      <div className="command-panel__header">
        <p className="panel-kicker">Priority Zone</p>
        <h2>Kusheshwar Asthan</h2>
        <div className="command-panel__meta">PIN Code: 848213</div>
        <p>
          Floodplain infrastructure command surface for roads, health access,
          agriculture dependency and rural electricity stability.
        </p>
      </div>

      <div className="readout-grid">
        {systemReadouts.map((item) => (
          <div key={item.label} className="readout-card">
            <span>{item.label}</span>
            <strong>
              {item.value}
              <small>{item.unit}</small>
            </strong>
          </div>
        ))}
      </div>

      <div className="command-panel__metrics">
        {infrastructureLayers.map((layer) => (
          <MetricBar
            key={layer.id}
            label={layer.label}
            value={layer.score}
            color={layer.color}
          />
        ))}
      </div>
    </aside>
  );
}
