import { memo } from "react";

type MetricBarProps = {
	label?: string;
	value?: number;
	color?: string;
};

function MetricBar({ label = "", value = 0, color }: MetricBarProps) {
	const style = { ["--metric-color" as string]: color } as React.CSSProperties;
	return (
		<div className="metric-bar" style={style}>
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

export default memo(MetricBar);
