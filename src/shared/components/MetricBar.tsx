import { memo } from "react"

type MetricBarProps = {
	label?: string
	value?: number
	color?: string
}

function MetricBar({ label = "", value = 0, color }: MetricBarProps) {
	const style = { ["--metric-color" as string]: color } as React.CSSProperties
	return (
		<div className="[&+&]:mt-3" style={style}>
			<div className="flex gap-3 items-center justify-between mb-1.5 text-[0.84rem] text-[#dce8f8]/78">
				<span>{label}</span>
				<strong className="text-[0.78rem] font-semibold text-[#dce8f8]/86 tracking-[0.02em]">
					{value}/100
				</strong>
			</div>
			<div
				className="h-[5px] overflow-hidden bg-[#b9d1e8]/8 rounded-full"
				aria-hidden="true"
			>
				<div
					className="h-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--metric-color)_80%,transparent),var(--metric-color))] rounded-[inherit] shadow-[0_0_14px_color-mix(in_srgb,var(--metric-color)_70%,transparent)]"
					style={{ width: `${value}%` }}
				/>
			</div>
		</div>
	)
}

export default memo(MetricBar)
