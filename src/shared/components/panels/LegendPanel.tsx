import { memo } from "react"
import { infrastructureLayers } from "@/shared/lib/config/layers"

// Tactical legend: maps map color codes to intelligence verdicts.
// Static, lightweight, sits on the right edge of the map.

function LegendPanel() {
	return (
		<aside
			className="panel-surface py-3 px-3.5 rounded-[10px] max-[820px]:w-full max-[820px]:min-w-0 max-[820px]:max-h-none max-[820px]:py-2.5 max-[820px]:px-3"
			aria-label="Map legend"
		>
			<ul className="grid gap-2 p-0 m-0 list-none">
				{infrastructureLayers.map((layer) => (
					<li
						key={layer.id}
						className="flex gap-2.5 items-center text-[0.8rem] text-[#e1ebfa]/85"
						style={{ "--layer-color": layer.color } as React.CSSProperties}
					>
						<span
							className="w-2 h-2 bg-[var(--layer-color)] rounded-full shadow-[0_0_10px_var(--layer-color),0_0_0_1px_color-mix(in_srgb,var(--layer-color)_60%,transparent)]"
							aria-hidden="true"
						/>
						<span>{layer.legendLabel}</span>
					</li>
				))}
			</ul>
		</aside>
	)
}

export default memo(LegendPanel)
