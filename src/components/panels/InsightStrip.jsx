import { infrastructureLayers } from "../../data/infrastructureLayers";

export default function InsightStrip() {
  return (
    <section className="insight-strip panel-surface" aria-label="Infrastructure status summary">
      {infrastructureLayers.map((layer) => (
        <article
          key={layer.id}
          className="insight-card"
          style={{ "--layer-color": layer.color }}
        >
          <div className="insight-card__topline">
            <span>{layer.shortLabel}</span>
            <strong>{layer.score}</strong>
          </div>
          <h3>{layer.status}</h3>
          <p>{layer.trend}</p>
        </article>
      ))}
    </section>
  );
}
