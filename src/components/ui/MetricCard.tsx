import { memo } from "react";

// Reusable metric card. Shares visuals with `.readout-card`.

type MetricCardProps = {
  label: string;
  value: number | string;
  unit?: string;
};

function MetricCard({ label, value, unit }: MetricCardProps) {
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
