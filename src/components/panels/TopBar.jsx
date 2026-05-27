import { operationalStats } from "../../data/infrastructureLayers";

export default function TopBar() {
  return (
    <header className="top-bar panel-surface">
      <div>
        <p className="panel-kicker">Better Bharat Map</p>
        <h1>Regional Infrastructure Intelligence</h1>
      </div>

      <dl className="top-bar__stats" aria-label="Operational context">
        {operationalStats.slice(1).map((stat) => (
          <div key={stat.label} className="top-bar__stat">
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
