import { memo } from "react";
import LayerIcon from "@/shared/components/LayerIcon";
import { infrastructureLayers } from "@/shared/lib/config/layers";

function InsightStrip() {
	return (
		<section
			className="insight-strip panel-surface"
			aria-label="Quick overview"
		>
			<header className="insight-strip__header">
				<p className="panel-kicker">Kusheshwar Asthan — Quick Overview</p>
			</header>

			<div className="insight-strip__grid">
				{infrastructureLayers.map((layer) => (
					<article
						key={layer.id}
						className="insight-card"
						style={
							{ ["--layer-color" as any]: layer.color } as React.CSSProperties
						}
					>
						<span className="insight-card__icon" aria-hidden="true">
							<LayerIcon
								iconKey={layer.iconKey as any}
								size={26}
								strokeWidth={1.4}
							/>
						</span>
						<div className="insight-card__body">
							<span className="insight-card__label">
								{layer.intelligenceLabel}
							</span>
							<h3 className="insight-card__verdict">{layer.verdict}</h3>
							<p className="insight-card__foot">
								At {layer.score}/100 {layer.unitNote}
							</p>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}

export default memo(InsightStrip);
