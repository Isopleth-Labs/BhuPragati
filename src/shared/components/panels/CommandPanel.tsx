import { memo } from "react"
import LayerToggle from "@/shared/components/LayerToggle"
import MetricBar from "@/shared/components/MetricBar"
import { infrastructureLayers } from "@/shared/lib/config/layers"

type CommandPanelProps = {
	activeLayers: Record<string, boolean>
	onToggleLayer: (id: string) => void
}

function CommandPanel({ activeLayers, onToggleLayer }: CommandPanelProps) {
	return (
		<aside
			className="panel-surface flex flex-col gap-[18px] max-h-[calc(100vh-180px)] py-[22px] px-5 overflow-auto [scrollbar-color:rgba(90,171,222,0.42)_transparent] [scrollbar-width:thin] max-[820px]:w-full max-[820px]:min-w-0 max-[820px]:max-h-none max-[820px]:p-4 max-[820px]:mt-[clamp(150px,30vh,260px)]"
			aria-label="Kusheshwar Asthan intelligence"
		>
			<header>
				<h2 className="m-0 font-['Barlow_Condensed',Barlow,sans-serif] text-[clamp(1.55rem,2.4vw,2rem)] font-bold leading-none tracking-[0.005em]">
					Kusheshwar Asthan
				</h2>
				<div className="mt-1.5 text-[0.78rem] text-[#bed2e8]/60 tracking-[0.04em]">
					PIN Code: 848213
				</div>
			</header>

			<ul className="grid gap-2 p-0 m-0 list-none">
				{infrastructureLayers.map((layer) => (
					<LayerToggle
						key={layer.id}
						layer={layer}
						isActive={!!activeLayers[layer.id]}
						onToggle={onToggleLayer}
					/>
				))}
			</ul>

			<div className="mt-1">
				<p className="panel-kicker">Infrastructure Scores</p>
				<div className="grid gap-[14px]">
					{infrastructureLayers.map((layer) => (
						<MetricBar
							key={layer.id}
							label={layer.scoreLabel}
							value={layer.score}
							color={layer.color}
						/>
					))}
				</div>
			</div>
		</aside>
	)
}

export default memo(CommandPanel)
