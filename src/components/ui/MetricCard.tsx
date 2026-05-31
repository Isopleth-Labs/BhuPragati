import { memo } from "react";

// Reusable metric card. Shares visuals with `.readout-card`.

function MetricCard({ label, value, unit }) {
  return (
    <div className="readout-card">
      <span>{label}</span>
      <strong>
        {value}
        {unit ? <small>{unit}</small> : null}
      </strong>
    </div>
  );
}

export default memo(MetricCard);
