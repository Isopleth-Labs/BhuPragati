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
			className="command-panel panel-surface"
			aria-label="Kusheshwar Asthan intelligence"
		>
			<header className="command-panel__header">
				<h2>Kusheshwar Asthan</h2>
				<div className="command-panel__meta">PIN Code: 848213</div>
			</header>

			<ul className="command-panel__layers">
				{infrastructureLayers.map((layer) => (
					<LayerToggle
						key={layer.id}
						layer={layer}
						isActive={!!activeLayers[layer.id]}
						onToggle={onToggleLayer}
					/>
				))}
			</ul>

			<div className="command-panel__scores">
				<p className="panel-kicker">Infrastructure Scores</p>
				<div className="command-panel__metrics">
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
