export default function MetricBar({ label, value, color }) {
  return (
    <div className="metric-bar" style={{ "--metric-color": color }}>
      <div className="metric-bar__header">
        <span>{label}</span>
        <strong>{value}/100</strong>
      </div>
      <div className="metric-bar__track" aria-hidden="true">
        <div className="metric-bar__value" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
